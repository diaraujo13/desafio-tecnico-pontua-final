import { IVacationRepository } from '../../../domain/repositories/IVacationRepository';
import { VacationRequest } from '../../../domain/entities/VacationRequest';
import { Result } from '../../../domain/shared/Result';
import { InvalidInputError } from '../../../domain/errors/InvalidInputError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';

/**
 * Use Case for retrieving vacation request details
 *
 * Business Rules:
 * - Only the requester can view their own vacation request details
 * - The requestId and requesterId must be provided
 * - Returns the VacationRequest entity if found and authorized
 */
export class GetVacationDetailsUseCase {
  constructor(private readonly vacationRepository: IVacationRepository) {}

  /**
   * Executes the vacation details retrieval
   * @param requestId - Vacation request ID
   * @param requesterId - Authenticated user's ID (must match the request's requesterId)
   * @returns Result containing the VacationRequest entity
   */
  async execute(requestId: string, requesterId: string): Promise<Result<VacationRequest>> {
    try {
      if (!requestId || requestId.trim().length === 0) {
        return Result.fail(new InvalidInputError('requestId', 'Request ID is required'));
      }

      if (!requesterId || requesterId.trim().length === 0) {
        return Result.fail(new InvalidInputError('requesterId', 'Requester ID is required'));
      }

      const result = await this.vacationRepository.findById(requestId);

      if (result.isFailure) {
        return Result.fail(result.getError());
      }

      const vacationRequest = result.getValue();

      // Verify ownership: only the requester can view their own request
      if (vacationRequest.requesterId !== requesterId) {
        return Result.fail(new UnauthorizedError('You are not authorized to view this vacation request'));
      }

      return Result.ok(vacationRequest);
    } catch (error) {
      if (error instanceof DomainError) {
        return Result.fail(error);
      }

      return Result.fail(new UnexpectedDomainError());
    }
  }
}

