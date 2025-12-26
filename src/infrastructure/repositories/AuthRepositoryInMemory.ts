import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { Result } from '../../domain/shared/Result';
import { UnauthorizedError } from '../../domain/errors/UnauthorizedError';
import { UnexpectedDomainError } from '../../domain/errors/UnexpectedDomainError';
import { usersSeed } from '../database/in-memory-db';
import { simulateRequest } from '../utils/simulation';

/**
 * In-memory implementation of IAuthRepository
 * Uses seed data to simulate authentication
 */
export class AuthRepositoryInMemory implements IAuthRepository {
  /**
   * Authenticates a user with email and password
   * Simulates network delay and validates against seed data
   */
  async login(email: Email, password: Password): Promise<Result<User>> {
    try {
      // Find user in seed data by email
      const userSeed = usersSeed.find((u) => u.email.toLowerCase() === email.value.toLowerCase());

      if (!userSeed) {
        return await simulateRequest(
          Result.fail(new UnauthorizedError('Invalid credentials')),
          800,
        );
      }

      // Simulate password validation (in real app, this would hash and compare)
      // For mock, we accept any password that matches the seed password
      // In a real implementation, we'd compare hashed passwords
      const isValidPassword = password.value === userSeed.password;

      if (!isValidPassword) {
        return await simulateRequest(
          Result.fail(new UnauthorizedError('Invalid credentials')),
          800,
        );
      }

      // Create User entity from seed data
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

      // Simulate network delay
      return await simulateRequest(Result.ok(user), 800);
    } catch (error) {
      return Result.fail(
        new UnexpectedDomainError(error instanceof Error ? error.message : 'Authentication failed'),
      );
    }
  }

  /**
   * Logs out the current user
   * In a real implementation, this would invalidate the session token
   */
  async logout(): Promise<void> {
    // Simulate network delay
    await simulateRequest(undefined, 300);
  }
}
