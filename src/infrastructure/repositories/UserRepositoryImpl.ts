import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Result } from '../../domain/shared/Result';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { InfrastructureFailureError } from '../../domain/errors/InfrastructureFailureError';
import { ApiClient } from '../api/client';
import { UserMapper } from '../../application/mappers/UserMapper';

/**
 * HTTP implementation of IUserRepository
 * Uses the ApiClient to communicate with the backend
 */
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly apiClient: ApiClient) {}

  /**
   * Finds a user by their ID
   */
  async findById(id: string): Promise<Result<User>> {
    try {
      const data = await this.apiClient.get<{
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
      }>(`/users/${id}`);

      const user = UserMapper.fromAPI(data);
      return Result.ok(user);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return Result.fail(new NotFoundError('User'));
      }

      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch user',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  /**
   * Finds a user by their email address
   */
  async findByEmail(email: string): Promise<Result<User>> {
    try {
      const data = await this.apiClient.get<{
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
      }>(`/users?email=${encodeURIComponent(email)}`);

      const user = UserMapper.fromAPI(data);
      return Result.ok(user);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return Result.fail(new NotFoundError('User'));
      }

      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch user',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  /**
   * Saves a user (create or update)
   */
  async save(user: User): Promise<Result<void>> {
    try {
      const dto = {
        id: user.id,
        registrationNumber: user.registrationNumber,
        name: user.name,
        email: user.email.value,
        role: user.role,
        status: user.status,
        departmentId: user.departmentId,
        managerId: user.managerId,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };

      if (user.id) {
        try {
          await this.apiClient.get(`/users/${user.id}`);
          await this.apiClient.put(`/users/${user.id}`, dto);
        } catch (error) {
          if (error instanceof Error && error.message.includes('404')) {
            await this.apiClient.post('/users', dto);
          } else {
            throw error;
          }
        }
      } else {
        await this.apiClient.post('/users', dto);
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to save user',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  /**
   * Finds all users in a department
   */
  async findByDepartmentId(departmentId: string): Promise<Result<User[]>> {
    try {
      const data = await this.apiClient.get<
        Array<{
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
        }>
      >(`/users?departmentId=${encodeURIComponent(departmentId)}`);

      const users = data.map(item => UserMapper.fromAPI(item));
      return Result.ok(users);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch users',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  /**
   * Finds all users managed by a specific manager
   */
  async findByManagerId(managerId: string): Promise<Result<User[]>> {
    try {
      const data = await this.apiClient.get<
        Array<{
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
        }>
      >(`/users?managerId=${encodeURIComponent(managerId)}`);

      const users = data.map(item => UserMapper.fromAPI(item));
      return Result.ok(users);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch users',
          error instanceof Error ? error : undefined
        )
      );
    }
  }
}
