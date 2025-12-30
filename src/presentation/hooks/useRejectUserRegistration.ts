import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectUserRegistrationUseCase } from '../../main/container';
import { RejectUserDTO } from '../../application/dtos/RejectUserDTO';
import { Result } from '../../domain/shared/Result';
import { DomainError } from '../../domain/errors/DomainError';

/**
 * Hook for rejecting a user registration using TanStack Query Mutation
 *
 * This hook is a UI adapter that:
 * - Calls the Use Case from the Composition Root
 * - Manages UI state (loading, error) via TanStack Query
 * - Invalidates pending users queries on success
 * - Does NOT contain business logic
 * - Does NOT instantiate repositories or Use Cases
 */
export function useRejectUserRegistration() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (dto: RejectUserDTO): Promise<void> => {
      const result = await rejectUserRegistrationUseCase.execute(dto);

      if (result.isFailure) {
        // TanStack Query expects thrown errors for error state
        throw result.getError();
      }

      return undefined;
    },
    onSuccess: () => {
      // Invalidate pending users queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['pendingUserRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const rejectUser = async (dto: RejectUserDTO): Promise<Result<void>> => {
    try {
      await mutation.mutateAsync(dto);
      return Result.ok();
    } catch (error) {
      return Result.fail(error as DomainError);
    }
  };

  return {
    rejectUser,
    isLoading: mutation.isPending,
    error:
      mutation.error && typeof mutation.error === 'object' && 'message' in mutation.error
        ? String(mutation.error.message)
        : null,
    reset: () => mutation.reset(),
  };
}
