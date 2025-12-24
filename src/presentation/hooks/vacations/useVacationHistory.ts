import { useState, useEffect, useCallback } from 'react';
import { getVacationHistoryUseCase } from '../../../main/container';
import { VacationRequest } from '../../../domain/entities/VacationRequest';

/**
 * Hook for fetching vacation history
 *
 * This hook is a UI adapter that:
 * - Calls the Use Case from the Composition Root
 * - Manages UI state (loading, error, data)
 * - Does NOT contain business logic
 */
export function useVacationHistory(userId: string) {
  const [data, setData] = useState<VacationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getVacationHistoryUseCase.execute(userId);

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
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [userId, fetchHistory]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}
