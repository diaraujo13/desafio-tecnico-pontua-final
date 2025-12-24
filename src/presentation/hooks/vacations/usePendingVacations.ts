import { useQuery } from '@tanstack/react-query';
import { getManagerDashboardUseCase } from '../../../main/container';
import { VacationRequest } from '../../../domain/entities/VacationRequest';
import { DomainError } from '../../../domain/errors';

/**
 * Hook for fetching pending vacation requests for managers
 *
 * This hook is a UI adapter that:
 * - Uses TanStack Query for caching and state management
 * - Calls the Use Case from the Composition Root
 * - Manages UI state (loading, error, data)
 * - Does NOT contain business logic
 */
export function usePendingVacations(managerId: string, departmentId: string) {
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery<VacationRequest[], DomainError>({
    queryKey: ['pendingVacations', managerId, departmentId],
    queryFn: async () => {
      if (!managerId || !departmentId) {
        return [];
      }

      const result = await getManagerDashboardUseCase.execute(managerId, departmentId);

      if (result.isFailure) {
        // O erro já é um DomainError
        throw result.getError();
      }

      return result.getValue();
    },
    enabled: !!managerId && !!departmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data,
    isLoading,
    error: error ? error.message : null,
    refetch,
  };
}
