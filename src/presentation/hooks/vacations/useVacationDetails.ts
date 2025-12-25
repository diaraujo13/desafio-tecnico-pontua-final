import { useState, useEffect, useCallback } from 'react';
import { getVacationDetailsUseCase } from '../../../main/container';
import { VacationRequest } from '../../../domain/entities/VacationRequest';

/**
 * Hook for fetching vacation request details
 *
 * This hook is a UI adapter that:
 * - Calls the Use Case from the Composition Root
 * - Manages UI state (loading, error, data)
 * - Does NOT contain business logic
 */
export function useVacationDetails(requestId: string, requesterId: string) {
  const [data, setData] = useState<VacationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!requestId || !requesterId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getVacationDetailsUseCase.execute(requestId, requesterId);

      if (result.isSuccess) {
        setData(result.getValue());
      } else {
        setError(result.getError().message);
        setData(null);
      }
    } catch (err) {
      // This catch block should rarely be hit since Use Cases return Result
      // But we handle it defensively
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'An unexpected error occurred';
      setError(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [requestId, requesterId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDetails,
  };
}




