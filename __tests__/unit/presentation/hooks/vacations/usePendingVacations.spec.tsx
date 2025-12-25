import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePendingVacations } from '../../../../../src/presentation/hooks/vacations/usePendingVacations';
import { getManagerDashboardUseCase } from '../../../../../src/main/container';
import { VacationRequest } from '../../../../../src/domain/entities/VacationRequest';
import { VacationStatus } from '../../../../../src/domain/enums/VacationStatus';
import { Result } from '../../../../../src/domain/shared/Result';
import { NotFoundError } from '../../../../../src/domain/errors/NotFoundError';

jest.mock('../../../../../src/main/container', () => ({
  getManagerDashboardUseCase: {
    execute: jest.fn(),
  },
}));

const mockGetManagerDashboardUseCase = getManagerDashboardUseCase as jest.Mocked<
  typeof getManagerDashboardUseCase
>;

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = 'QueryClientWrapper';

  return Wrapper;
};

describe('usePendingVacations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array when managerId or departmentId is missing', async () => {
    const { result } = renderHook(() => usePendingVacations('', ''), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(mockGetManagerDashboardUseCase.execute).not.toHaveBeenCalled();
  });

  it('should fetch pending vacations successfully', async () => {
    const mockVacations: VacationRequest[] = [
      {
        id: 'vacation-1',
        requesterId: 'user-1',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-10'),
        status: VacationStatus.PENDING_APPROVAL,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      } as VacationRequest,
    ];

    mockGetManagerDashboardUseCase.execute.mockResolvedValue(Result.ok(mockVacations));

    const { result } = renderHook(() => usePendingVacations('manager-1', 'dept-1'), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockVacations);
    expect(result.current.error).toBeNull();
    expect(mockGetManagerDashboardUseCase.execute).toHaveBeenCalledWith('manager-1', 'dept-1');
  });

  it('should handle error from Use Case', async () => {
    const error = new NotFoundError('Vacation', 'vacation-1');
    mockGetManagerDashboardUseCase.execute.mockResolvedValue(Result.fail(error));

    const { result } = renderHook(() => usePendingVacations('manager-1', 'dept-1'), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(error.message);
    expect(result.current.data).toEqual([]);
  });

  it('should refetch data when refetch is called', async () => {
    const mockVacations: VacationRequest[] = [
      {
        id: 'vacation-1',
        requesterId: 'user-1',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-10'),
        status: VacationStatus.PENDING_APPROVAL,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      } as VacationRequest,
    ];

    mockGetManagerDashboardUseCase.execute.mockResolvedValue(Result.ok(mockVacations));

    const { result } = renderHook(() => usePendingVacations('manager-1', 'dept-1'), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetManagerDashboardUseCase.execute).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    await waitFor(() => {
      expect(mockGetManagerDashboardUseCase.execute).toHaveBeenCalledTimes(2);
    });
  });
});



