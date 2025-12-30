import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserDTO } from '../../dtos/UserDTO';
import { UserMapper } from '../../mappers/UserMapper';
import { Result } from '../../../domain/shared/Result';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';

/**
 * Use Case for retrieving pending user registrations
 * Orchestrates permission checks and data retrieval
 *
 * Business Rules:
 * - Only ADMIN can view pending registrations
 * - Returns list of users with PENDING_APPROVAL status
 */
export class GetPendingUserRegistrationsUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Executes the retrieval of pending user registrations
   * @param callerId - ID of the user requesting the list
   * @returns Result containing array of UserDTOs or an error
   */
  async execute(callerId: string): Promise<Result<UserDTO[]>> {
    try {
      // Validate caller exists and has permission
      const callerResult = await this.userRepository.findById(callerId);
      if (callerResult.isFailure) {
        return Result.fail(new NotFoundError('User', callerId));
      }

      const caller = callerResult.getValue();

      // Check permission: only ADMIN can view pending registrations
      if (!caller.canViewPendingRegistrations()) {
        return Result.fail(
          new UnauthorizedError(
            'Apenas administradores podem visualizar registros de usuários pendentes',
          ),
        );
      }

      // Retrieve pending users
      const pendingUsersResult = await this.userRepository.findPendingUsers();
      if (pendingUsersResult.isFailure) {
        return Result.fail(pendingUsersResult.getError());
      }

      const pendingUsers = pendingUsersResult.getValue();

      // Convert Domain entities to DTOs
      const userDTOs = pendingUsers.map((user) => UserMapper.toDTO(user));

      return Result.ok(userDTOs);
    } catch (error) {
      if (error instanceof DomainError) {
        return Result.fail(error);
      }

      return Result.fail(new UnexpectedDomainError());
    }
  }
}
