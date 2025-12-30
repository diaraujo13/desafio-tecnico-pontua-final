import { useQuery } from '@tanstack/react-query';
import { getPendingUserRegistrationsUseCase } from '../../main/container';
import { UserDTO } from '../../application/dtos/UserDTO';
import { DomainError } from '../../domain/errors/DomainError';

/**
 * Hook for fetching pending user registrations using TanStack Query
 *
 * This hook is a UI adapter that:
 * - Calls the Use Case from the Composition Root
 * - Manages UI state (loading, error, data) via TanStack Query
 * - Does NOT contain business logic
 * - Does NOT instantiate repositories or Use Cases
 */
export function usePendingUserRegistrations(callerId: string | null) {
  const {
    data = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<UserDTO[], DomainError>({
    queryKey: ['pendingUserRegistrations', callerId],
    queryFn: async () => {
      if (!callerId) {
        return [];
      }

      const result = await getPendingUserRegistrationsUseCase.execute(callerId);

      if (result.isFailure) {
        // TanStack Query expects thrown errors for error state
        throw result.getError();
      }

      return result.getValue();
    },
    enabled: !!callerId,
    staleTime: 2 * 60 * 1000, // 2 minutes - pending users can change frequently
  });

  return {
    pendingUsers: data,
    isLoading,
    isFetching,
    error: error ? error.message : null,
    refetch,
  };
}
