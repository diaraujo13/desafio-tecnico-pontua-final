import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestVacationUseCase } from '../../../main/container';
import { RequestVacationDTO } from '../../../application/dtos/VacationRequestDTO';
import { Result } from '../../../domain/shared/Result';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';

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
      await mutation.mutateAsync(dto);
      // Success - return Result.ok() for void
      return Result.ok();
    } catch (error) {
      // Hooks MUST NOT use instanceof or interpret errors
      // Extract error message without type checking
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : 'An unexpected error occurred';

      // Wrap all errors as UnexpectedDomainError
      // Note: This should never happen if Use Cases are correct and throw DomainErrors
      // But we handle it defensively without using instanceof
      return Result.fail(new UnexpectedDomainError(errorMessage));
    }
  };

  return {
    requestVacation,
    isLoading: mutation.isPending,
    error:
      mutation.error && typeof mutation.error === 'object' && 'message' in mutation.error
        ? String(mutation.error.message)
        : null,
  };
}
