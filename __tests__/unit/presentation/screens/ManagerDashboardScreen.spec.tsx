import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { ManagerDashboardScreen } from '../../../../src/presentation/screens/ManagerDashboardScreen';
import { useAuth } from '../../../../src/presentation/hooks/useAuth';
import { useManagerDashboard } from '../../../../src/presentation/hooks/vacations/useManagerDashboard';
import { ThemeProvider } from '../../../../src/presentation/theme/ThemeProvider';
import { VacationRequest } from '../../../../src/domain/entities/VacationRequest';
import { VacationStatus } from '../../../../src/domain/enums/VacationStatus';
import { UserRole } from '../../../../src/domain/enums/UserRole';

// Mock hooks
jest.mock('../../../../src/presentation/hooks/useAuth');
jest.mock('../../../../src/presentation/hooks/vacations/useManagerDashboard');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseManagerDashboard = useManagerDashboard as jest.MockedFunction<typeof useManagerDashboard>;

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NavigationContainer>{children}</NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('ManagerDashboardScreen', () => {
  const mockUser = {
    id: 'manager-1',
    name: 'Manager User',
    role: UserRole.MANAGER,
    departmentId: 'dept-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser as any,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthLoading: false,
    });
  });

  it('should render loading state', () => {
    mockUseManagerDashboard.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<ManagerDashboardScreen />, { wrapper: createTestWrapper() });

    expect(screen.getByText('Pendências de Aprovação')).toBeTruthy();
  });

  it('should render empty state when no pending requests', async () => {
    mockUseManagerDashboard.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<ManagerDashboardScreen />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Nenhuma solicitação pendente')).toBeTruthy();
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

    mockUseManagerDashboard.mockReturnValue({
      data: mockVacations,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<ManagerDashboardScreen />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Pendências de Aprovação')).toBeTruthy();
    });
  });

  it('should display error message when error occurs', async () => {
    mockUseManagerDashboard.mockReturnValue({
      data: [],
      isLoading: false,
      error: 'Failed to load pending requests',
      refetch: jest.fn(),
    });

    render(<ManagerDashboardScreen />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Failed to load pending requests')).toBeTruthy();
    });
  });
});

