import { IVacationRepository } from '../../../domain/repositories/IVacationRepository';
import { CancelVacationDTO } from '../../dtos/VacationRequestDTO';
import { Result } from '../../../domain/shared/Result';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';

/**
 * Use Case for cancelling a vacation request
 * Enforces ownership: only the requester can cancel their own request
 */
export class CancelVacationUseCase {
  constructor(private readonly vacationRepository: IVacationRepository) {}

  /**
   * Executes the vacation request cancellation
   * @param dto - Cancel vacation DTO
   * @returns Result containing void on success or an error
   */
  async execute(dto: CancelVacationDTO): Promise<Result<void>> {
    try {
      // Fetch the vacation request
      const requestResult = await this.vacationRepository.findById(dto.requestId);
      if (requestResult.isFailure) {
        return Result.fail(new NotFoundError('Vacation request', dto.requestId));
      }

      const vacationRequest = requestResult.getValue();

      // Verify ownership
      if (vacationRequest.requesterId !== dto.requesterId) {
        return Result.fail(
          new UnauthorizedError('Only the requester can cancel their own vacation request'),
        );
      }

      // Cancel the request (entity validates state transition)
      vacationRequest.cancel();

      // Persist the updated request
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
