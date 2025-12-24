import { VacationRequest } from '../../../domain/entities/VacationRequest';
import { IVacationRepository } from '../../../domain/repositories/IVacationRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { RequestVacationDTO } from '../../dtos/VacationRequestDTO';
import { Result } from '../../../domain/shared/Result';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { InactiveUserCannotRequestVacationError } from '../../../domain/errors/InactiveUserCannotRequestVacationError';
import { InvalidVacationDateError } from '../../../domain/errors/InvalidVacationDateError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';
import { v4 as uuidv4 } from 'uuid';

/**
 * Use Case for creating a new vacation request
 * Orchestrates validation, entity creation, and persistence
 */
export class RequestVacationUseCase {
  constructor(
    private readonly vacationRepository: IVacationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Executes the vacation request creation
   * @param dto - Request vacation DTO
   * @returns Result containing void on success or an error
   */
  async execute(dto: RequestVacationDTO): Promise<Result<void>> {
    try {
      // Validate user exists and is active
      const userResult = await this.userRepository.findById(dto.requesterId);
      if (userResult.isFailure) {
        return Result.fail(new NotFoundError('User', dto.requesterId));
      }

      const user = userResult.getValue();
      if (!user.isActive()) {
        return Result.fail(new InactiveUserCannotRequestVacationError());
      }

      // Validate dates are valid
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return Result.fail(new InvalidVacationDateError());
      }

      // Create vacation request entity
      // The entity's factory method will validate dates via DateRange
      const vacationRequest = VacationRequest.create({
        id: uuidv4(),
        requesterId: dto.requesterId,
        startDate,
        endDate,
        observation: dto.observation || null,
      });

      // Persist the request
      const saveResult = await this.vacationRepository.save(vacationRequest);
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
