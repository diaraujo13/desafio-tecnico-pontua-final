import { useState, useEffect, useCallback } from 'react';
import { getManagerDashboardUseCase } from '../../../main/container';
import { VacationRequest } from '../../../domain/entities/VacationRequest';

/**
 * Hook for fetching manager dashboard data
 *
 * This hook is a UI adapter that:
 * - Calls the Use Case from the Composition Root
 * - Manages UI state (loading, error, data)
 * - Does NOT contain business logic
 */
export function useManagerDashboard(managerId: string, departmentId: string) {
  const [data, setData] = useState<VacationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!managerId || !departmentId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getManagerDashboardUseCase.execute(managerId, departmentId);

      if (result.isSuccess) {
        setData(result.getValue());
      } else {
        setError(result.getError().message);
        setData([]);
      }
    } catch (err) {
      // This catch block should rarely be hit since Use Cases return Result
      // But we handle it defensively
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'An unexpected error occurred';
      setError(errorMessage);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [managerId, departmentId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}
