import { AuthRepositoryImpl } from '../../../../src/infrastructure/repositories/AuthRepositoryImpl';
import { ApiClient } from '../../../../src/infrastructure/api/client';
import { IStorageAdapter } from '../../../../src/infrastructure/storage/IStorageAdapter';
import { Email } from '../../../../src/domain/value-objects/Email';
import { Password } from '../../../../src/domain/value-objects/Password';
import { UserRole } from '../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../src/domain/enums/UserStatus';

describe('AuthRepositoryImpl', () => {
  let apiClient: jest.Mocked<ApiClient>;
  let secureStorage: jest.Mocked<IStorageAdapter>;
  let authRepository: AuthRepositoryImpl;

  beforeEach(() => {
    // Mock ApiClient
    apiClient = {
      post: jest.fn(),
      setAuthToken: jest.fn(),
      clearAuthToken: jest.fn(),
    } as unknown as jest.Mocked<ApiClient>;

    // Mock SecureStorageAdapter
    secureStorage = {
      set: jest.fn(),
      remove: jest.fn(),
      get: jest.fn(),
      clear: jest.fn(),
      getAllKeys: jest.fn(),
    } as jest.Mocked<IStorageAdapter>;

    authRepository = new AuthRepositoryImpl(apiClient, secureStorage);
  });

  describe('login', () => {
    const email = Email.create('test@example.com');
    const password = Password.create('Test123!@#');

    it('should successfully login and save token', async () => {
      const mockResponse = {
        user: {
          id: 'user-1',
          registrationNumber: '12345',
          name: 'Test User',
          email: 'test@example.com',
          role: UserRole.COLLABORATOR,
          status: UserStatus.ACTIVE,
          departmentId: 'dept-1',
          managerId: null,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        token: 'mock-jwt-token',
      };

      apiClient.post = jest.fn().mockResolvedValue(mockResponse);
      secureStorage.set = jest.fn().mockResolvedValue(undefined);

      const result = await authRepository.login(email, password);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().email.value).toBe('test@example.com');
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: password.value,
      });
      expect(secureStorage.set).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
      expect(apiClient.setAuthToken).toHaveBeenCalledWith('mock-jwt-token');
    });

    it('should return error on invalid credentials (401)', async () => {
      const error = new Error('HTTP error! status: 401');
      apiClient.post = jest.fn().mockRejectedValue(error);

      const result = await authRepository.login(email, password);

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toBe('Invalid credentials');
      expect(secureStorage.set).not.toHaveBeenCalled();
      expect(apiClient.setAuthToken).not.toHaveBeenCalled();
    });

    it('should return error on other API errors', async () => {
      const error = new Error('HTTP error! status: 500');
      apiClient.post = jest.fn().mockRejectedValue(error);

      const result = await authRepository.login(email, password);

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toBe('HTTP error! status: 500');
      expect(secureStorage.set).not.toHaveBeenCalled();
      expect(apiClient.setAuthToken).not.toHaveBeenCalled();
    });

    it('should handle non-Error exceptions', async () => {
      apiClient.post = jest.fn().mockRejectedValue('Unknown error');

      const result = await authRepository.login(email, password);

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toBe('Authentication failed');
    });
  });

  describe('logout', () => {
    let originalConsoleError: typeof console.error;

    beforeEach(() => {
      // Save original console.error
      originalConsoleError = console.error;
    });

    afterEach(() => {
      // Restore original console.error after each test
      console.error = originalConsoleError;
    });

    it('should successfully logout and clear token', async () => {
      apiClient.post = jest.fn().mockResolvedValue(undefined);
      secureStorage.remove = jest.fn().mockResolvedValue(undefined);
      // Silence console.error for this test (no error expected, but mock prevents any accidental logs)
      console.error = jest.fn();

      await authRepository.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout', {});
      expect(secureStorage.remove).toHaveBeenCalledWith('auth_token');
      expect(apiClient.clearAuthToken).toHaveBeenCalled();
    });

    it('should clear token even if logout endpoint fails', async () => {
      const error = new Error('HTTP error! status: 500');
      apiClient.post = jest.fn().mockRejectedValue(error);
      secureStorage.remove = jest.fn().mockResolvedValue(undefined);
      // Silence console.error - error is expected and logged by design
      console.error = jest.fn();

      // Should not throw
      await expect(authRepository.logout()).resolves.not.toThrow();

      expect(secureStorage.remove).toHaveBeenCalledWith('auth_token');
      expect(apiClient.clearAuthToken).toHaveBeenCalled();
      // Verify that console.error was called with the expected error
      expect(console.error).toHaveBeenCalledWith('Error calling logout endpoint:', error);
    });
  });
});
