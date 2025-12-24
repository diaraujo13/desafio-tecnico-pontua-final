import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllVacationsUseCase } from '../../../main/container';
import { VacationRequest } from '../../../domain/entities/VacationRequest';
import { VacationStatus } from '../../../domain/enums/VacationStatus';

interface VacationFilters {
  departmentId?: string;
  status?: VacationStatus;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Hook for fetching all vacations (admin only)
 *
 * This hook is a UI adapter that:
 * - Calls the Use Case from the Composition Root
 * - Manages UI state (loading, error, data)
 * - Does NOT contain business logic
 * - Requires callerId to be passed (typically from useAuth)
 */
export function useAllVacations (callerId: string, filters?: VacationFilters) {
  const [data, setData] = useState<VacationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract filter values to ensure referential stability
  // This prevents infinite loops when consumers pass inline objects
  const departmentId = filters?.departmentId;
  const status = filters?.status;
  const startDate = filters?.startDate;
  const endDate = filters?.endDate;
  // Use timestamps for Date comparison to ensure referential stability
  const startDateTime = startDate?.getTime();
  const endDateTime = endDate?.getTime();

  // Memoize filters object to prevent infinite loops when consumers pass inline objects
  // Compare by primitive values (strings, enums, timestamps) to ensure referential stability
  const stableFilters = useMemo(() => {
    if (!filters) {
      return undefined;
    }

    return {
      departmentId,
      status,
      startDate,
      endDate,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId, status, startDateTime, endDateTime]);

  const fetchAllVacations = useCallback(async () => {
    if (!callerId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getAllVacationsUseCase.execute(callerId, stableFilters);

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
  }, [callerId, stableFilters]);

  useEffect(() => {
    fetchAllVacations();
  }, [fetchAllVacations]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchAllVacations,
  };
}
