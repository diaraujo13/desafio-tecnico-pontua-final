import React from 'react';
import { screen } from '@testing-library/react-native';
import { QueryClient } from '@tanstack/react-query';
import { DashboardScreen } from '../../../../src/presentation/screens/DashboardScreen';
import { useAuth } from '../../../../src/presentation/hooks/useAuth';
import { useUserPermissions } from '../../../../src/presentation/hooks/useUserPermissions';
import { UserRole } from '../../../../src/domain/enums/UserRole';
import { renderWithProviders } from '../../../helpers/render/renderWithProviders';

// Mock hooks - authentication and permissions are mocked UI inputs
jest.mock('../../../../src/presentation/hooks/useAuth');
jest.mock('../../../../src/presentation/hooks/useUserPermissions');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseUserPermissions = useUserPermissions as jest.MockedFunction<typeof useUserPermissions>;

describe('DashboardScreen Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    jest.clearAllMocks();
  });

  it('should show "Solicitar férias" button for COLLABORATOR', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        registrationNumber: '12345',
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.COLLABORATOR,
        status: 'ACTIVE',
        departmentId: 'dept-1',
        managerId: null,
      },
      isAuthLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUseUserPermissions.mockReturnValue({
      permissions: {
        canRequestVacation: true,
        canApproveVacations: false,
        canApproveUserRegistration: false,
      },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DashboardScreen />, { queryClient });

    expect(screen.getByTestId('DashboardScreen_RequestVacationButton')).toBeTruthy();
  });

  it('should NOT show "Solicitar férias" button for MANAGER', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'manager-1',
        registrationNumber: 'MGR001',
        name: 'Manager User',
        email: 'manager@example.com',
        role: UserRole.MANAGER,
        status: 'ACTIVE',
        departmentId: 'dept-1',
        managerId: null,
      },
      isAuthLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUseUserPermissions.mockReturnValue({
      permissions: {
        canRequestVacation: false,
        canApproveVacations: true,
        canApproveUserRegistration: false,
      },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DashboardScreen />, { queryClient });

    expect(screen.queryByTestId('DashboardScreen_RequestVacationButton')).toBeNull();
    expect(screen.getByTestId('DashboardScreen_ViewPendingButton')).toBeTruthy();
  });

  it('should NOT show "Solicitar férias" button for ADMIN', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'admin-1',
        registrationNumber: 'ADM001',
        name: 'Admin User',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        status: 'ACTIVE',
        departmentId: 'dept-1',
        managerId: null,
      },
      isAuthLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUseUserPermissions.mockReturnValue({
      permissions: {
        canRequestVacation: false,
        canApproveVacations: false,
        canApproveUserRegistration: true,
      },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DashboardScreen />, { queryClient });

    expect(screen.queryByTestId('DashboardScreen_RequestVacationButton')).toBeNull();
    expect(screen.queryByTestId('DashboardScreen_ViewPendingButton')).toBeNull();
  });

  it('should show "Ver pendências" button when canApproveVacations is true', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'manager-1',
        registrationNumber: 'MGR001',
        name: 'Manager User',
        email: 'manager@example.com',
        role: UserRole.MANAGER,
        status: 'ACTIVE',
        departmentId: 'dept-1',
        managerId: null,
      },
      isAuthLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUseUserPermissions.mockReturnValue({
      permissions: {
        canRequestVacation: false,
        canApproveVacations: true,
        canApproveUserRegistration: false,
      },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DashboardScreen />, { queryClient });

    expect(screen.getByTestId('DashboardScreen_ViewPendingButton')).toBeTruthy();
  });
});
