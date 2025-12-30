import { useQuery } from '@tanstack/react-query';
import { repositories } from '../../main/container';
import { Department } from '../../domain/entities/Department';
import { DomainError } from '../../domain/errors/DomainError';

/**
 * Hook for fetching departments list
 *
 * This hook is a UI adapter that:
 * - Uses TanStack Query for caching and state management
 * - Calls the Repository from the Composition Root
 * - Manages UI state (loading, error, data)
 * - Does NOT contain business logic
 *
 * TODO: Create GetDepartmentsUseCase and use it instead of direct repository access
 */
export function useDepartments() {
  const {
    data = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<Department[], DomainError>({
    queryKey: ['departments'],
    queryFn: async () => {
      const result = await repositories.department.listAll();

      if (result.isFailure) {
        throw result.getError();
      }

      return result.getValue();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - departments don't change often
  });

  return {
    departments: data,
    isLoading,
    isFetching,
    error: error ? error.message : null,
    refetch,
  };
}
