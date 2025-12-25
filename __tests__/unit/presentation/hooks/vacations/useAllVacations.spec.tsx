import { renderHook, waitFor } from '@testing-library/react-native';
import { useAllVacations } from '../../../../../src/presentation/hooks/vacations/useAllVacations';
import { getAllVacationsUseCase } from '../../../../../src/main/container';
import { VacationStatus } from '../../../../../src/domain/enums/VacationStatus';
import { Result } from '../../../../../src/domain/shared/Result';
import { VacationRequest } from '../../../../../src/domain/entities/VacationRequest';
import { InfrastructureFailureError } from '../../../../../src/domain/errors/InfrastructureFailureError';

// Mock the use case
jest.mock('../../../../../src/main/container', () => ({
  getAllVacationsUseCase: {
    execute: jest.fn(),
  },
}));

describe('useAllVacations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch vacations on mount', async () => {
    const mockVacations: VacationRequest[] = [];
    const callerId = 'admin-user-1';
    (getAllVacationsUseCase.execute as jest.Mock).mockResolvedValue(Result.ok(mockVacations));

    const { result } = renderHook(() => useAllVacations(callerId));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getAllVacationsUseCase.execute).toHaveBeenCalledWith(callerId, undefined);
    expect(result.current.data).toEqual(mockVacations);
  });

  it('should not cause infinite loop when filters object reference changes', async () => {
    const mockVacations: VacationRequest[] = [];
    const callerId = 'admin-user-1';
    (getAllVacationsUseCase.execute as jest.Mock).mockResolvedValue(Result.ok(mockVacations));

    const { result, rerender } = renderHook(
      (props: { filters: { status: VacationStatus } }) => useAllVacations(callerId, props.filters),
      {
        initialProps: {
          filters: { status: VacationStatus.PENDING_APPROVAL },
        },
      },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCallCount = (getAllVacationsUseCase.execute as jest.Mock).mock.calls.length;

    // Rerender with same filter values but new object reference
    rerender({ filters: { status: VacationStatus.PENDING_APPROVAL } });

    await waitFor(() => {
      // Should not cause additional calls if values are the same
      expect(getAllVacationsUseCase.execute).toHaveBeenCalledTimes(initialCallCount);
    });
  });

  it('should refetch when filter values actually change', async () => {
    const mockVacations: VacationRequest[] = [];
    const callerId = 'admin-user-1';
    (getAllVacationsUseCase.execute as jest.Mock).mockResolvedValue(Result.ok(mockVacations));

    const { result, rerender } = renderHook(
      (props: { filters: { status: VacationStatus } }) => useAllVacations(callerId, props.filters),
      {
        initialProps: {
          filters: { status: VacationStatus.PENDING_APPROVAL },
        },
      },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCallCount = (getAllVacationsUseCase.execute as jest.Mock).mock.calls.length;

    // Change filter value
    rerender({ filters: { status: VacationStatus.APPROVED } });

    await waitFor(() => {
      // Should trigger a new call when values change
      expect(getAllVacationsUseCase.execute).toHaveBeenCalledTimes(initialCallCount + 1);
    });
  });

  it('should handle errors correctly', async () => {
    const errorMessage = 'Failed to fetch vacations';
    const callerId = 'admin-user-1';
    (getAllVacationsUseCase.execute as jest.Mock).mockResolvedValue(
      Result.fail(new InfrastructureFailureError(errorMessage)),
    );

    const { result } = renderHook(() => useAllVacations(callerId));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toEqual([]);
  });

  it('should provide refetch function', async () => {
    const mockVacations: VacationRequest[] = [];
    const callerId = 'admin-user-1';
    (getAllVacationsUseCase.execute as jest.Mock).mockResolvedValue(Result.ok(mockVacations));

    const { result } = renderHook(() => useAllVacations(callerId));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCallCount = (getAllVacationsUseCase.execute as jest.Mock).mock.calls.length;

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(getAllVacationsUseCase.execute).toHaveBeenCalledTimes(initialCallCount + 1);
    });
  });
});
