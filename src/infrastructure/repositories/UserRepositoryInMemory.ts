import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Result } from '../../domain/shared/Result';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { InfrastructureFailureError } from '../../domain/errors/InfrastructureFailureError';
import { UserStatus } from '../../domain/enums/UserStatus';
import { UserRole } from '../../domain/enums/UserRole';
import { usersSeed } from '../database/in-memory-db';
import { simulateRequest } from '../utils/simulation';

/**
 * In-memory implementation of IUserRepository
 * Supports read and write operations (volatile - data persists only during session)
 */
export class UserRepositoryInMemory implements IUserRepository {
  // In-memory storage (initialized from seed, can be modified during session)
  private users: Array<{
    id: string;
    registrationNumber: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    departmentId: string;
    managerId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;

  constructor() {
    // Initialize from seed data (deep clone to allow mutations)
    this.users = usersSeed.map((u) => ({
      id: u.id,
      registrationNumber: u.registrationNumber,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      departmentId: u.departmentId,
      managerId: u.managerId,
      createdAt: new Date(u.createdAt),
      updatedAt: new Date(u.updatedAt),
    }));
  }
  /**
   * Finds a user by their ID
   * Returns a clone to ensure immutability
   */
  async findById(id: string): Promise<Result<User>> {
    try {
      const userData = this.users.find((u) => u.id === id);

      if (!userData) {
        return await simulateRequest(Result.fail(new NotFoundError('User', id)), 800);
      }

      const user = User.create({
        id: userData.id,
        registrationNumber: userData.registrationNumber,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        departmentId: userData.departmentId,
        managerId: userData.managerId,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
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
      const userData = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!userData) {
        return await simulateRequest(Result.fail(new NotFoundError('User', email)), 800);
      }

      const user = User.create({
        id: userData.id,
        registrationNumber: userData.registrationNumber,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        departmentId: userData.departmentId,
        managerId: userData.managerId,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
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
   * Updates existing item or adds new one to the in-memory array
   */
  async save(user: User): Promise<Result<void>> {
    try {
      const existingIndex = this.users.findIndex((u) => u.id === user.id);

      const userData = {
        id: user.id,
        registrationNumber: user.registrationNumber,
        name: user.name,
        email: user.email.value,
        role: user.role,
        status: user.status,
        departmentId: user.departmentId,
        managerId: user.managerId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      if (existingIndex >= 0) {
        // Update existing
        this.users[existingIndex] = userData;
      } else {
        // Create new
        this.users.push(userData);
      }

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
      const departmentUsers = this.users
        .filter((u) => u.departmentId === departmentId)
        .map((userData) =>
          User.create({
            id: userData.id,
            registrationNumber: userData.registrationNumber,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: userData.status,
            departmentId: userData.departmentId,
            managerId: userData.managerId,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
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
      const managedUsers = this.users
        .filter((u) => u.managerId === managerId)
        .map((userData) =>
          User.create({
            id: userData.id,
            registrationNumber: userData.registrationNumber,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: userData.status,
            departmentId: userData.departmentId,
            managerId: userData.managerId,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
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

  /**
   * Finds all users with PENDING_APPROVAL status
   * Returns clones to ensure immutability
   */
  async findPendingUsers(): Promise<Result<User[]>> {
    try {
      const pendingUsers = this.users
        .filter((u) => u.status === UserStatus.PENDING_APPROVAL)
        .map((userData) =>
          User.create({
            id: userData.id,
            registrationNumber: userData.registrationNumber,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: userData.status,
            departmentId: userData.departmentId,
            managerId: userData.managerId,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
          }),
        );

      return await simulateRequest(Result.ok(pendingUsers), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch pending users',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }
}
