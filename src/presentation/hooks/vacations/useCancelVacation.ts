import { useState, useCallback } from 'react';
import { cancelVacationUseCase } from '../../../main/container';
import { CancelVacationDTO } from '../../../application/dtos/VacationRequestDTO';
import { Result } from '../../../domain/shared/Result';

/**
 * Hook for canceling a vacation request
 *
 * This hook is a UI adapter that:
 * - Calls the Use Case from the Composition Root
 * - Manages UI state (loading, error)
 * - Does NOT contain business logic
 */
export function useCancelVacation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelVacation = useCallback(async (dto: CancelVacationDTO): Promise<Result<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await cancelVacationUseCase.execute(dto);

      if (result.isFailure) {
        setError(result.getError().message);
      }

      return result;
    } catch (err) {
      // Use Cases should never throw - if this happens, it's a bug
      // Hooks do NOT create DomainErrors - they only consume error.message
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'An unexpected error occurred';
      setError(errorMessage);
      // Cannot return a valid Result here - this indicates a Use Case bug
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cancelVacation,
    isLoading,
    error,
  };
}
