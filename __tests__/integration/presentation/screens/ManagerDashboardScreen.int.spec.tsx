import React from 'react';
import { screen, waitFor } from '@testing-library/react-native';
import { QueryClient } from '@tanstack/react-query';
import { ManagerDashboardScreen } from '../../../../src/presentation/screens/ManagerDashboardScreen';
import { useAuth } from '../../../../src/presentation/hooks/useAuth';
import { usePendingVacations } from '../../../../src/presentation/hooks/vacations/usePendingVacations';
import { VacationRequest } from '../../../../src/domain/entities/VacationRequest';
import { VacationStatus } from '../../../../src/domain/enums/VacationStatus';
import { UserRole } from '../../../../src/domain/enums/UserRole';
import { renderWithProviders } from '../../../../src/helpers/render/renderWithProviders';

// Mock hooks - authentication is a mocked UI input
jest.mock('../../../../src/presentation/hooks/useAuth');
jest.mock('../../../../src/presentation/hooks/vacations/usePendingVacations');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUsePendingVacations = usePendingVacations as jest.MockedFunction<
  typeof usePendingVacations
>;

describe('ManagerDashboardScreen Integration', () => {
  const mockUser = {
    id: 'manager-1',
    name: 'Manager User',
    role: UserRole.MANAGER,
    departmentId: 'dept-1',
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser as any,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthLoading: false,
    });
  });

  it('should render loading state', () => {
    mockUsePendingVacations.mockReturnValue({
      data: [],
      isLoading: true,
      isFetching: true,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<ManagerDashboardScreen />, { queryClient });

    expect(screen.getByTestId('ManagerDashboardScreen_Container')).toBeTruthy();
    expect(screen.getByTestId('ManagerDashboardScreen_Title')).toBeTruthy();
    expect(screen.getByTestId('ManagerDashboardScreen_LoadingSkeleton')).toBeTruthy();
  });

  it('should render empty state when no pending requests', async () => {
    mockUsePendingVacations.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<ManagerDashboardScreen />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('ManagerDashboardScreen_EmptyState')).toBeTruthy();
      expect(screen.getByTestId('ManagerDashboardScreen_EmptyStateComponent')).toBeTruthy();
    });
  });

  it('should render list of pending vacation requests', async () => {
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

    mockUsePendingVacations.mockReturnValue({
      data: mockVacations,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<ManagerDashboardScreen />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('ManagerDashboardScreen_Container')).toBeTruthy();
      expect(screen.getByTestId('ManagerDashboardScreen_Title')).toBeTruthy();
      expect(screen.getByTestId('ManagerDashboardScreen_VacationsList')).toBeTruthy();
      expect(screen.getByTestId('ManagerDashboardScreen_VacationItem_vacation-1')).toBeTruthy();
    });
  });

  it('should display error message when error occurs', async () => {
    const errorMessage = 'Failed to load pending requests';
    mockUsePendingVacations.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      error: errorMessage,
      refetch: jest.fn(),
    });

    renderWithProviders(<ManagerDashboardScreen />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('ManagerDashboardScreen_ErrorText')).toBeTruthy();
      expect(screen.getByText(errorMessage)).toBeTruthy();
    });
  });
});
