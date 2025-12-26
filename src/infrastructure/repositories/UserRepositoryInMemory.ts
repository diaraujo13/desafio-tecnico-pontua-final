import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Result } from '../../domain/shared/Result';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { InfrastructureFailureError } from '../../domain/errors/InfrastructureFailureError';
import { usersSeed } from '../database/in-memory-db';
import { simulateRequest } from '../utils/simulation';

/**
 * In-memory implementation of IUserRepository
 * Uses seed data to provide user data access
 */
export class UserRepositoryInMemory implements IUserRepository {
  /**
   * Finds a user by their ID
   * Returns a clone to ensure immutability
   */
  async findById(id: string): Promise<Result<User>> {
    try {
      const userSeed = usersSeed.find((u) => u.id === id);

      if (!userSeed) {
        return await simulateRequest(Result.fail(new NotFoundError('User', id)), 800);
      }

      const user = User.create({
        id: userSeed.id,
        registrationNumber: userSeed.registrationNumber,
        name: userSeed.name,
        email: userSeed.email,
        role: userSeed.role,
        status: userSeed.status,
        departmentId: userSeed.departmentId,
        managerId: userSeed.managerId,
        createdAt: userSeed.createdAt,
        updatedAt: userSeed.updatedAt,
      });

      return await simulateRequest(Result.ok(user), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch user',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  /**
   * Finds a user by their email address
   */
  async findByEmail(email: string): Promise<Result<User>> {
    try {
      const userSeed = usersSeed.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!userSeed) {
        return await simulateRequest(Result.fail(new NotFoundError('User', email)), 800);
      }

      const user = User.create({
        id: userSeed.id,
        registrationNumber: userSeed.registrationNumber,
        name: userSeed.name,
        email: userSeed.email,
        role: userSeed.role,
        status: userSeed.status,
        departmentId: userSeed.departmentId,
        managerId: userSeed.managerId,
        createdAt: userSeed.createdAt,
        updatedAt: userSeed.updatedAt,
      });

      return await simulateRequest(Result.ok(user), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch user',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  /**
   * Saves a user (create or update)
   * Note: In-memory implementation is volatile - changes are lost on app restart
   */
  async save(_user: User): Promise<Result<void>> {
    try {
      // In a real implementation, this would persist to a database
      // For in-memory, we just simulate the operation
      await simulateRequest(undefined, 800);
      return Result.ok();
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to save user',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  /**
   * Finds all users in a department
   * Returns clones to ensure immutability
   */
  async findByDepartmentId(departmentId: string): Promise<Result<User[]>> {
    try {
      const departmentUsers = usersSeed
        .filter((u) => u.departmentId === departmentId)
        .map((userSeed) =>
          User.create({
            id: userSeed.id,
            registrationNumber: userSeed.registrationNumber,
            name: userSeed.name,
            email: userSeed.email,
            role: userSeed.role,
            status: userSeed.status,
            departmentId: userSeed.departmentId,
            managerId: userSeed.managerId,
            createdAt: userSeed.createdAt,
            updatedAt: userSeed.updatedAt,
          }),
        );

      return await simulateRequest(Result.ok(departmentUsers), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch users',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  /**
   * Finds all users managed by a specific manager
   * Returns clones to ensure immutability
   */
  async findByManagerId(managerId: string): Promise<Result<User[]>> {
    try {
      const managedUsers = usersSeed
        .filter((u) => u.managerId === managerId)
        .map((userSeed) =>
          User.create({
            id: userSeed.id,
            registrationNumber: userSeed.registrationNumber,
            name: userSeed.name,
            email: userSeed.email,
            role: userSeed.role,
            status: userSeed.status,
            departmentId: userSeed.departmentId,
            managerId: userSeed.managerId,
            createdAt: userSeed.createdAt,
            updatedAt: userSeed.updatedAt,
          }),
        );

      return await simulateRequest(Result.ok(managedUsers), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch users',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }
}
