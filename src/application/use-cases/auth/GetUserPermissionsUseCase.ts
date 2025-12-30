import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { Result } from '../../../domain/shared/Result';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';
import { UserPermissionsDTO } from '../../dtos/UserPermissionsDTO';

/**
 * Use Case for retrieving user permissions
 * Returns permissions as data, computed by Domain entity methods
 *
 * This Use Case exists to:
 * - Expose permissions to Presentation layer without leaking Domain entities
 * - Allow UI to conditionally render actions based on permissions
 * - Keep permission logic in Domain, not in Presentation
 */
export class GetUserPermissionsUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Executes the permission retrieval
   * @param userId - User ID to get permissions for
   * @returns Result containing UserPermissionsDTO or an error
   */
  async execute(userId: string): Promise<Result<UserPermissionsDTO>> {
    try {
      // Validate user exists
      const userResult = await this.userRepository.findById(userId);
      if (userResult.isFailure) {
        return Result.fail(new NotFoundError('User', userId));
      }

      const user = userResult.getValue();

      // Permissions are computed by Domain entity methods
      // Use Case delegates permission decisions to Domain
      const permissions: UserPermissionsDTO = {
        canRequestVacation: user.canRequestVacation(),
        canApproveVacations: user.canApproveVacations(),
        canApproveUserRegistration: user.canApproveUserRegistration(),
        canCreateUser: user.canRegisterUser(),
        canRegisterUser: user.canRegisterUser(),
        canViewPendingRegistrations: user.canViewPendingRegistrations(),
        canRejectUserRegistration: user.canRejectUserRegistration(),
      };

      return Result.ok(permissions);
    } catch (error) {
      if (error instanceof DomainError) {
        return Result.fail(error);
      }

      return Result.fail(new UnexpectedDomainError());
    }
  }
}
