import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ApproveUserDTO } from '../../dtos/ApproveUserDTO';
import { Result } from '../../../domain/shared/Result';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { InvalidStatusTransitionError } from '../../../domain/errors/InvalidStatusTransitionError';
import { InvalidUserStateError } from '../../../domain/errors/InvalidUserStateError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';
import { UserStatus } from '../../../domain/enums/UserStatus';

/**
 * Use Case for approving a user registration
 * Orchestrates validation, permission checks, and status transition
 *
 * Business Rules:
 * - Only ADMIN can approve user registrations
 * - User must be in PENDING_APPROVAL status
 * - Status transition must be validated in Domain
 */
export class ApproveUserRegistrationUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Executes the user registration approval
   * @param dto - Approve user DTO
   * @returns Result containing void on success or an error
   */
  async execute(dto: ApproveUserDTO): Promise<Result<void>> {
    try {
      // Validate approver exists and has permission
      const approverResult = await this.userRepository.findById(dto.approvedBy);
      if (approverResult.isFailure) {
        return Result.fail(new NotFoundError('User', dto.approvedBy));
      }

      const approver = approverResult.getValue();

      // Check permission: only ADMIN can approve registrations
      if (!approver.canApproveUserRegistration()) {
        return Result.fail(
          new UnauthorizedError('Apenas administradores podem aprovar registros de usuários'),
        );
      }

      // Validate user to be approved exists
      const userResult = await this.userRepository.findById(dto.userId);
      if (userResult.isFailure) {
        return Result.fail(new NotFoundError('User', dto.userId));
      }

      const user = userResult.getValue();

      // Validate user is in PENDING_APPROVAL status
      if (user.status !== UserStatus.PENDING_APPROVAL) {
        return Result.fail(
          new InvalidUserStateError(
            `Usuário não está com status PENDING_APPROVAL. Status atual: ${user.status}`,
          ),
        );
      }

      // Transition user to ACTIVE status
      // Domain entity validates the transition
      const approvedUser = user.transitionTo(UserStatus.ACTIVE);

      // Persist the updated user
      const saveResult = await this.userRepository.save(approvedUser);
      if (saveResult.isFailure) {
        return Result.fail(saveResult.getError());
      }

      return Result.ok();
    } catch (error) {
      if (error instanceof InvalidStatusTransitionError) {
        return Result.fail(error);
      }

      if (error instanceof DomainError) {
        return Result.fail(error);
      }

      return Result.fail(new UnexpectedDomainError());
    }
  }
}
