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
export function useRequestVacation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (dto: RequestVacationDTO): Promise<void> => {
      const result = await requestVacationUseCase.execute(dto);

      if (result.isFailure) {
        const error = result.getError();
        // TanStack Query expects thrown errors for error state
        // We throw the DomainError so it can be accessed via mutation.error
        // DomainError always has a message property, so we can safely throw it
        throw error;
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

  // Extract error message safely
  // DomainError always has a message property
  // TanStack Query may serialize errors, so we need robust extraction
  const getErrorMessage = (): string | null => {
    if (!mutation.error) {
      return null;
    }

    // If error is a string, return it directly
    if (typeof mutation.error === 'string') {
      return mutation.error;
    }

    // If error is an object, try to get message property
    if (typeof mutation.error === 'object') {
      // Check for message property (most common case)
      if ('message' in mutation.error) {
        const msg = mutation.error.message;
        if (typeof msg === 'string' && msg.length > 0) {
          return msg;
        }
      }

      // Check for toString method
      if (typeof mutation.error.toString === 'function') {
        const str = mutation.error.toString();
        // If toString returns something meaningful (not just "[object Object]")
        if (str && str !== '[object Object]' && str.length > 0) {
          return str;
        }
      }
    }

    // Final fallback: convert to string
    return String(mutation.error);
  };

  return {
    requestVacation,
    isLoading: mutation.isPending,
    error: getErrorMessage(),
    reset: () => mutation.reset(),
  };
}
