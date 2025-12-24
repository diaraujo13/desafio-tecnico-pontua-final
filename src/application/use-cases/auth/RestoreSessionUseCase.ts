import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { Result } from '../../../domain/shared/Result';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';
import type { UserDTO } from '../../dtos/UserDTO';

/**
 * RestoreSessionUseCase
 *
 * Restores user session by checking if there's a valid stored token.
 * For MVP: Returns null (no session restoration yet).
 *
 * Future implementation:
 * - Check if token exists in secure storage
 * - Validate token with API endpoint (e.g., /auth/me)
 * - Return UserDTO if valid, null if invalid/expired
 */
export class RestoreSessionUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<Result<UserDTO | null>> {
    try {
      // For MVP: No session restoration implemented yet
      // This will be implemented when we add getCurrentUser to IAuthRepository
      // and create the /auth/me API endpoint

      return Result.ok(null);
    } catch (error) {
      if (error instanceof DomainError) {
        return Result.fail(error);
      }

      return Result.fail(
        new UnexpectedDomainError(
          error instanceof Error ? error.message : 'Failed to restore session',
        ),
      );
    }
  }
}
