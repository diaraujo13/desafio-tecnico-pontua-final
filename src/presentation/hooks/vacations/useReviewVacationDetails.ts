import { useQuery } from '@tanstack/react-query';
import { repositories } from '../../../main/container';
import { VacationRequest } from '../../../domain/entities/VacationRequest';

/**
 * Hook for fetching vacation request details for review (managers/admins)
 *
 * This hook is a UI adapter that:
 * - Uses TanStack Query for caching and state management
 * - Calls the Repository directly (no ownership check - managers can review any request)
 * - Manages UI state (loading, error, data)
 * - Does NOT contain business logic
 */
export function useReviewVacationDetails(requestId: string) {
  const {
    data = null,
    isLoading,
    error,
    refetch,
  } = useQuery<VacationRequest | null, string>({
    queryKey: ['reviewVacationDetails', requestId],
    queryFn: async () => {
      if (!requestId) {
        return null;
      }

      const result = await repositories.vacation.findById(requestId);

      if (result.isFailure) {
        throw new Error(result.getError().message);
      }

      return result.getValue();
    },
    enabled: !!requestId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    data,
    isLoading,
    error: error ? error : null,
    refetch,
  };
}

