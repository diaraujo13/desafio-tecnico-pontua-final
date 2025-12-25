import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestVacationUseCase } from '../../../main/container';
import { RequestVacationDTO } from '../../../application/dtos/VacationRequestDTO';
import { Result } from '../../../domain/shared/Result';
import { DomainError } from '../../../domain/errors/DomainError';

/**
 * Hook for requesting a vacation using TanStack Query Mutation
 *
 * This hook is a UI adapter that:
 * - Calls the Use Case from the Composition Root
 * - Manages UI state (loading, error) via TanStack Query
 * - Invalidates vacation queries on success
 * - Does NOT contain business logic
 * - Does NOT instantiate repositories or Use Cases
 */
export function useRequestVacation () {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (dto: RequestVacationDTO): Promise<void> => {
      const result = await requestVacationUseCase.execute(dto);

      if (result.isFailure) {
        // TanStack Query expects thrown errors for error state
        // We throw the DomainError so it can be accessed via mutation.error
        throw result.getError();
      }

      // Result<void> means no return value, so we return undefined
      return undefined;
    },
    onSuccess: () => {
      // Invalidate vacation-related queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['vacations'] });
      queryClient.invalidateQueries({ queryKey: ['vacationHistory'] });
      queryClient.invalidateQueries({ queryKey: ['managerDashboard'] });
    },
  });

  const requestVacation = async (dto: RequestVacationDTO): Promise<Result<void>> => {
    try {
      // Call mutation.mutateAsync - it will throw DomainError on failure
      // TanStack Query captures it and stores in mutation.error
      await mutation.mutateAsync(dto);
      
      // If we reach here, mutation succeeded
      return Result.ok();
    } catch (error) {
      // The error thrown is the DomainError from the UseCase (result.getError())
      // TanStack Query already stores it in mutation.error (exposed via hook's error property)
      // We return Result.fail with the original error (not wrapped)
      // This allows the screen to check result.isFailure if needed
      // The error message is also available via the hook's error property
      // 
      // Since mutationFn throws result.getError() which is a DomainError,
      // we can safely assert the error as DomainError
      return Result.fail(error as DomainError);
    }
  };

  return {
    requestVacation,
    isLoading: mutation.isPending,
    error:
      mutation.error && typeof mutation.error === 'object' && 'message' in mutation.error
        ? String(mutation.error.message)
        : null,
    reset: () => mutation.reset(),
  };
}
