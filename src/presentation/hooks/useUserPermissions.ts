import { useQuery } from '@tanstack/react-query';
import { getUserPermissionsUseCase } from '../../main/container';
import type { UserPermissionsDTO } from '../../application/dtos/UserPermissionsDTO';

/**
 * Hook for retrieving user permissions
 *
 * This hook is a UI adapter that:
 * - Calls GetUserPermissionsUseCase from the Composition Root
 * - Manages UI state (loading, error) via TanStack Query
 * - Caches permissions data
 * - Does NOT contain business logic
 * - Does NOT instantiate repositories or Use Cases
 *
 * Permissions are returned as data from Domain, not computed in UI
 */
export function useUserPermissions(userId: string | null) {
  const query = useQuery({
    queryKey: ['userPermissions', userId],
    queryFn: async (): Promise<UserPermissionsDTO> => {
      if (!userId) {
        // Return default permissions when no user
        return {
          canRequestVacation: false,
          canApproveVacations: false,
          canApproveUserRegistration: false,
          canCreateUser: false,
          canRegisterUser: false,
          canViewPendingRegistrations: false,
          canRejectUserRegistration: false,
        };
      }

      const result = await getUserPermissionsUseCase.execute(userId);

      if (result.isFailure) {
        // TanStack Query expects thrown errors for error state
        throw result.getError();
      }

      return result.getValue();
    },
    enabled: !!userId, // Only fetch when userId is available
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (permissions don't change often)
  });

  return {
    permissions: query.data || {
      canRequestVacation: false,
      canApproveVacations: false,
      canApproveUserRegistration: false,
      canCreateUser: false,
      canRegisterUser: false,
      canViewPendingRegistrations: false,
      canRejectUserRegistration: false,
    },
    isLoading: query.isLoading,
    error: query.error,
  };
}
