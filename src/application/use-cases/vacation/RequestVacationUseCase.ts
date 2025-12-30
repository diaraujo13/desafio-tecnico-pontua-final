import { VacationRequest } from '../../../domain/entities/VacationRequest';
import { IVacationRepository } from '../../../domain/repositories/IVacationRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { RequestVacationDTO } from '../../dtos/VacationRequestDTO';
import { Result } from '../../../domain/shared/Result';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { InactiveUserCannotRequestVacationError } from '../../../domain/errors/InactiveUserCannotRequestVacationError';
import { InvalidVacationDateError } from '../../../domain/errors/InvalidVacationDateError';
import { InvalidDateRangeError } from '../../../domain/errors/InvalidDateRangeError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';
import { generateId } from '../../../domain/shared/idGenerator';

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

      // Check permission: only COLLABORATOR can request vacations
      // Use Case delegates authorization decision to Domain entity
      if (!user.canRequestVacation()) {
        return Result.fail(new UnauthorizedError('Apenas funcionários podem solicitar férias'));
      }

      // Validate dates are valid
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return Result.fail(new InvalidVacationDateError());
      }

      // Create vacation request entity
      // The entity's factory method will validate dates via DateRange
      // This may throw InvalidDateRangeError which is a DomainError
      let vacationRequest: VacationRequest;
      try {
        vacationRequest = VacationRequest.create({
          id: generateId(),
          requesterId: dto.requesterId,
          startDate,
          endDate,
          observation: dto.observation || null,
        });
      } catch (error) {
        // DateRange.create() throws InvalidDateRangeError which is a DomainError
        // Catch it explicitly to ensure proper error propagation
        if (error instanceof InvalidDateRangeError) {
          return Result.fail(error);
        }
        if (error instanceof DomainError) {
          return Result.fail(error);
        }
        // If it's not a DomainError, wrap it with the original error message if available
        const errorMessage = error instanceof Error ? error.message : String(error);
        return Result.fail(new UnexpectedDomainError(errorMessage || 'Ocorreu um erro inesperado'));
      }

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
