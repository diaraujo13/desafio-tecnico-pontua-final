import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { RejectUserDTO } from '../../dtos/RejectUserDTO';
import { Result } from '../../../domain/shared/Result';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { InvalidInputError } from '../../../domain/errors/InvalidInputError';
import { InvalidUserStateError } from '../../../domain/errors/InvalidUserStateError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';
import { UserStatus } from '../../../domain/enums/UserStatus';

/**
 * Use Case for rejecting a user registration
 * Orchestrates validation, permission checks, and status transition
 *
 * Business Rules:
 * - Only ADMIN can reject user registrations
 * - User must be in PENDING_APPROVAL status
 * - Rejection reason is mandatory
 * - Status transition must be validated in Domain
 */
export class RejectUserRegistrationUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Executes the user registration rejection
   * @param dto - Reject user DTO
   * @returns Result containing void on success or an error
   */
  async execute(dto: RejectUserDTO): Promise<Result<void>> {
    try {
      // Validate rejection reason
      if (!dto.reason || dto.reason.trim().length === 0) {
        return Result.fail(new InvalidInputError('reason', 'Motivo da rejeição é obrigatório'));
      }

      // Validate rejector exists and has permission
      const rejectorResult = await this.userRepository.findById(dto.rejectedBy);
      if (rejectorResult.isFailure) {
        return Result.fail(new NotFoundError('User', dto.rejectedBy));
      }

      const rejector = rejectorResult.getValue();

      // Check permission: only ADMIN can reject registrations
      if (!rejector.canRejectUserRegistration()) {
        return Result.fail(
          new UnauthorizedError('Apenas administradores podem rejeitar registros de usuários'),
        );
      }

      // Validate user to be rejected exists
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

      // Transition user to INACTIVE status (rejection)
      // Domain entity validates the transition
      const rejectedUser = user.transitionTo(UserStatus.INACTIVE);

      // Persist the updated user
      // Note: In a real implementation, the rejection reason would be stored
      // For now, we just update the status
      const saveResult = await this.userRepository.save(rejectedUser);
      if (saveResult.isFailure) {
        return Result.fail(saveResult.getError());
      }

      return Result.ok();
    } catch (error) {
      if (error instanceof DomainError) {
        return Result.fail(error);
      }

      return Result.fail(new UnexpectedDomainError());
    }
  }
}
