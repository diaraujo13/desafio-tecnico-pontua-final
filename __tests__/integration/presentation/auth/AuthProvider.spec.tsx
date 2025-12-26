import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuthContext } from '../../../../src/presentation/contexts/AuthContext';
import { Result } from '../../../../src/domain/shared/Result';
import type { UserDTO } from '../../../../src/application/dtos/UserDTO';
import { UserRole } from '../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../src/domain/enums/UserStatus';

// Mock container - ONLY allowed in AuthProvider tests
// This is the ONLY place where container mocking is acceptable
jest.mock('../../../../src/main/container', () => ({
  ...jest.requireActual('../../../../src/main/container'),
  restoreSessionUseCase: {
    execute: jest.fn(),
  },
  loginUseCase: {
    execute: jest.fn(),
  },
  logoutUseCase: {
    execute: jest.fn(),
  },
}));

import { restoreSessionUseCase, loginUseCase, logoutUseCase } from '../../../../src/main/container';

const mockRestoreSessionUseCase = restoreSessionUseCase as jest.Mocked<
  typeof restoreSessionUseCase
>;
const mockLoginUseCase = loginUseCase as jest.Mocked<typeof loginUseCase>;
const mockLogoutUseCase = logoutUseCase as jest.Mocked<typeof logoutUseCase>;

// Test component that uses AuthContext
function TestComponent() {
  const auth = useAuthContext();

  return (
    <View>
      <View testID="user-display">
        <Text>{auth.user ? `User: ${auth.user.name}` : 'No user'}</Text>
      </View>
      <View testID="loading-display">
        <Text>{auth.isAuthLoading ? 'Loading...' : 'Not loading'}</Text>
      </View>
      <Pressable
        testID="login-button"
        onPress={() => {
          auth.login({
            email: 'test@example.com',
            password: 'password123',
          });
        }}
      >
        <Text>Login</Text>
      </Pressable>
      <Pressable testID="logout-button" onPress={() => auth.logout()}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}

describe('AuthProvider Integration', () => {
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

  it('should render children immediately when skipBootstrap is true', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider skipBootstrap>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>,
    );

    // Should render immediately without waiting for bootstrap
    expect(screen.getByTestId('user-display')).toBeTruthy();
    expect(screen.getByText('No user')).toBeTruthy();

    // restoreSessionUseCase should NOT be called
    expect(mockRestoreSessionUseCase.execute).not.toHaveBeenCalled();
  });

  it('should call restoreSessionUseCase on mount when skipBootstrap is false', async () => {
    const mockUser: UserDTO = {
      id: 'user-1',
      registrationNumber: 'EMP001',
      name: 'Test User',
      email: 'test@example.com',
      role: UserRole.COLLABORATOR,
      status: UserStatus.ACTIVE,
      departmentId: 'dept-1',
      managerId: null,
    };

    mockRestoreSessionUseCase.execute.mockResolvedValue(Result.ok(mockUser));

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider skipBootstrap={false}>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>,
    );

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockRestoreSessionUseCase.execute).toHaveBeenCalledTimes(1);
    });

    // User should be restored
    await waitFor(() => {
      expect(screen.getByText('User: Test User')).toBeTruthy();
    });
  });

  it('should return null until bootstrap completes when skipBootstrap is false', async () => {
    // Delay the restoreSession response
    mockRestoreSessionUseCase.execute.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(Result.ok(null));
          }, 100);
        }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider skipBootstrap={false}>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>,
    );

    // Initially, AuthProvider returns null (children not rendered)
    // Verify that children are NOT present before bootstrap completes
    expect(screen.queryByTestId('user-display')).toBeNull();
    expect(screen.queryByTestId('login-button')).toBeNull();

    // After bootstrap completes, children should appear
    await waitFor(
      () => {
        expect(screen.getByTestId('user-display')).toBeTruthy();
        expect(screen.getByTestId('login-button')).toBeTruthy();
      },
      { timeout: 200 },
    );
  });

  it('should handle login flow', async () => {
    const mockUser: UserDTO = {
      id: 'user-1',
      registrationNumber: 'EMP001',
      name: 'Test User',
      email: 'test@example.com',
      role: UserRole.COLLABORATOR,
      status: UserStatus.ACTIVE,
      departmentId: 'dept-1',
      managerId: null,
    };

    mockRestoreSessionUseCase.execute.mockResolvedValue(Result.ok(null));
    mockLoginUseCase.execute.mockResolvedValue(Result.ok(mockUser));

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider skipBootstrap>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>,
    );

    const loginButton = screen.getByTestId('login-button');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('User: Test User')).toBeTruthy();
    });
  });

  it('should handle logout flow', async () => {
    const mockUser: UserDTO = {
      id: 'user-1',
      registrationNumber: 'EMP001',
      name: 'Test User',
      email: 'test@example.com',
      role: UserRole.COLLABORATOR,
      status: UserStatus.ACTIVE,
      departmentId: 'dept-1',
      managerId: null,
    };

    mockRestoreSessionUseCase.execute.mockResolvedValue(Result.ok(mockUser));
    mockLogoutUseCase.execute.mockResolvedValue(Result.ok());

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider skipBootstrap={false}>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>,
    );

    // Wait for bootstrap
    await waitFor(() => {
      expect(screen.getByText('User: Test User')).toBeTruthy();
    });

    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(mockLogoutUseCase.execute).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeTruthy();
    });
  });

  it('should set isAuthLoading during login', async () => {
    mockRestoreSessionUseCase.execute.mockResolvedValue(Result.ok(null));
    mockLoginUseCase.execute.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(Result.ok(null));
          }, 100);
        }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider skipBootstrap>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>,
    );

    const loginButton = screen.getByTestId('login-button');
    fireEvent.press(loginButton);

    // During login, loading should be true
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    // After login completes, loading should be false
    await waitFor(
      () => {
        expect(screen.getByText('Not loading')).toBeTruthy();
      },
      { timeout: 200 },
    );
  });
});
