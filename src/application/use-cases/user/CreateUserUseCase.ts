import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IDepartmentRepository } from '../../../domain/repositories/IDepartmentRepository';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';
import { Result } from '../../../domain/shared/Result';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';
import { UserStatus } from '../../../domain/enums/UserStatus';
import { generateId } from '../../../domain/shared/idGenerator';

/**
 * Use Case for creating a new user
 * Orchestrates validation, entity creation, and persistence
 *
 * Business Rules:
 * - Only MANAGER or ADMIN can create users
 * - New users are created with PENDING_APPROVAL status
 * - Department must exist
 * - Email must be unique
 */
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  /**
   * Executes the user creation
   * @param dto - Create user DTO
   * @returns Result containing void on success or an error
   */
  async execute(dto: CreateUserDTO): Promise<Result<void>> {
    try {
      // Validate creator exists and has permission
      const creatorResult = await this.userRepository.findById(dto.createdBy);
      if (creatorResult.isFailure) {
        return Result.fail(new NotFoundError('User', dto.createdBy));
      }

      const creator = creatorResult.getValue();

      // Check permission: only MANAGER or ADMIN can create users
      if (!creator.canCreateUser()) {
        return Result.fail(
          new UnauthorizedError('Apenas gestores ou administradores podem criar usuários'),
        );
      }

      // Validate department exists
      const departmentResult = await this.departmentRepository.findById(dto.departmentId);
      if (departmentResult.isFailure) {
        return Result.fail(new NotFoundError('Department', dto.departmentId));
      }

      // Check if email already exists
      const existingUserResult = await this.userRepository.findByEmail(dto.email);
      if (existingUserResult.isSuccess) {
        return Result.fail(new DomainError('E-mail já cadastrado', 'EMAIL_ALREADY_EXISTS'));
      }

      // Create user entity with PENDING_APPROVAL status
      // The entity's factory method will validate email format via Email VO
      const user = User.create({
        id: generateId(),
        registrationNumber: dto.registrationNumber,
        name: dto.name,
        email: dto.email,
        role: dto.role,
        status: UserStatus.PENDING_APPROVAL,
        departmentId: dto.departmentId,
        managerId: dto.managerId || null,
      });

      // Persist the user
      // Note: Password is handled separately in the auth layer
      // In a real implementation, password would be hashed and stored securely
      const saveResult = await this.userRepository.save(user);
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
