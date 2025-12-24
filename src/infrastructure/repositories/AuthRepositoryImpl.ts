import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { Result } from '../../domain/shared/Result';
import { UnauthorizedError } from '../../domain/errors/UnauthorizedError';
import { InfrastructureFailureError } from '../../domain/errors/InfrastructureFailureError';
import { ApiClient } from '../api/client';
import { IStorageAdapter } from '../storage/IStorageAdapter';
import { UserMapper } from '../../application/mappers/UserMapper';

/**
 * Concrete implementation of IAuthRepository
 * Uses the API client to authenticate users and SecureStorageAdapter to persist tokens
 */
export class AuthRepositoryImpl implements IAuthRepository {
  private readonly TOKEN_STORAGE_KEY = 'auth_token';

  constructor(
    private readonly apiClient: ApiClient,
    private readonly secureStorage: IStorageAdapter
  ) {}

  /**
   * Authenticates a user with email and password
   * On success, saves the authentication token to secure storage
   */
  async login(email: Email, password: Password): Promise<Result<User>> {
    try {
      // Make login request to API
      const response = await this.apiClient.post<{
        user: {
          id: string;
          registrationNumber: string;
          name: string;
          email: string;
          role: string;
          status: string;
          departmentId: string;
          managerId?: string | null;
          createdAt: string;
          updatedAt: string;
        };
        token: string;
      }>('/auth/login', {
        email: email.value,
        password: password.value,
      });

      // Convert API response to User entity
      const user = UserMapper.fromAPI(response.user);

      // Save token to secure storage
      await this.secureStorage.set(this.TOKEN_STORAGE_KEY, response.token);

      // Set token in API client for subsequent requests
      this.apiClient.setAuthToken(response.token);

      return Result.ok(user);
    } catch (error) {
      // Handle 401 Unauthorized specifically
      if (error instanceof Error && error.message.includes('401')) {
        return Result.fail(new UnauthorizedError('Invalid credentials'));
      }

      // Handle other infrastructure errors - preserve original error message
      if (error instanceof Error) {
        return Result.fail(
          new InfrastructureFailureError(
            error.message
          )
        );
      }

      return Result.fail(
        new InfrastructureFailureError(
          'Authentication failed'
        )
      );
    }
  }

  /**
   * Logs out the current user
   * Removes the token from secure storage and clears it from the API client
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (if backend requires it)
      await this.apiClient.post('/auth/logout', {});
    } catch (error) {
      // Log error but don't throw - we still want to clear local storage
      console.error('Error calling logout endpoint:', error);
    } finally {
      // Always clear local storage and API client token
      await this.secureStorage.remove(this.TOKEN_STORAGE_KEY);
      this.apiClient.clearAuthToken();
    }
  }
}
