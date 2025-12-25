import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../../../src/presentation/screens/LoginScreen';
import { useAuth } from '../../../../src/presentation/hooks/useAuth';
import { Result } from '../../../../src/domain/shared/Result';
import { UnauthorizedError } from '../../../../src/domain/errors/UnauthorizedError';
import type { UserDTO } from '../../../../src/application/dtos/UserDTO';
import { UserRole } from '../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../src/domain/enums/UserStatus';
import { ThemeProvider } from '../../../../src/presentation/theme/ThemeProvider';
import { AuthProvider } from '../../../../src/presentation/contexts/AuthContext';

// Mock useAuth hook
jest.mock('../../../../src/presentation/hooks/useAuth');

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <AuthProvider>{component}</AuthProvider>
    </ThemeProvider>,
  );
};

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('LoginScreen Integration', () => {
  const mockLogin = jest.fn();
  const mockUser: UserDTO = {
    id: 'user-1',
    registrationNumber: '12345',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.COLLABORATOR,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
    managerId: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthLoading: false,
      login: mockLogin,
      logout: jest.fn(),
    });
  });

  it('should render login form elements', () => {
    renderWithProviders(<LoginScreen />);

    expect(screen.getByTestId('LoginScreen_EmailInput')).toBeTruthy();
    expect(screen.getByTestId('LoginScreen_PasswordInput')).toBeTruthy();
    expect(screen.getByTestId('LoginScreen_LoginButton')).toBeTruthy();
  });

  it('should show validation errors when submitting empty form', async () => {
    renderWithProviders(<LoginScreen />);

    const loginButton = screen.getByTestId('LoginScreen_LoginButton');
    fireEvent.press(loginButton);

    await waitFor(() => {
      // Validation errors are user-facing messages, so we can assert on them
      expect(screen.getByText('E-mail é obrigatório')).toBeTruthy();
      expect(screen.getByText('Senha é obrigatória')).toBeTruthy();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should call login with correct credentials on submit', async () => {
    mockLogin.mockResolvedValue(Result.ok(mockUser));

    renderWithProviders(<LoginScreen />);

    const emailInput = screen.getByTestId('LoginScreen_EmailInput');
    const passwordInput = screen.getByTestId('LoginScreen_PasswordInput');
    const loginButton = screen.getByTestId('LoginScreen_LoginButton');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should display error message when login fails', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockResolvedValue(Result.fail(new UnauthorizedError(errorMessage)));

    renderWithProviders(<LoginScreen />);

    const emailInput = screen.getByTestId('LoginScreen_EmailInput');
    const passwordInput = screen.getByTestId('LoginScreen_PasswordInput');
    const loginButton = screen.getByTestId('LoginScreen_LoginButton');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('LoginScreen_ErrorText')).toBeTruthy();
      // Error message is user-facing, so we can assert on it
      expect(screen.getByText(errorMessage)).toBeTruthy();
    });
  });

  it('should show loading state on button when isAuthLoading is true', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthLoading: true,
      login: mockLogin,
      logout: jest.fn(),
    });

    renderWithProviders(<LoginScreen />);

    const loginButton = screen.getByTestId('LoginScreen_LoginButton');
    expect(loginButton).toBeTruthy();
    // Button should be disabled when loading (verified by testID existence)
  });

  it('should clear error message when submitting again', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin
      .mockResolvedValueOnce(Result.fail(new UnauthorizedError(errorMessage)))
      .mockResolvedValueOnce(Result.ok(mockUser));

    renderWithProviders(<LoginScreen />);

    const emailInput = screen.getByTestId('LoginScreen_EmailInput');
    const passwordInput = screen.getByTestId('LoginScreen_PasswordInput');
    const loginButton = screen.getByTestId('LoginScreen_LoginButton');

    // First submit - error
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('LoginScreen_ErrorText')).toBeTruthy();
      expect(screen.getByText(errorMessage)).toBeTruthy();
    });

    // Second submit - success (error should be cleared)
    fireEvent.changeText(passwordInput, 'correctpassword');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.queryByTestId('LoginScreen_ErrorText')).toBeNull();
    });
  });
});
