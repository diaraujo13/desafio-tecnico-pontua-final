import { IVacationRepository } from '../../../domain/repositories/IVacationRepository';
import { VacationRequest } from '../../../domain/entities/VacationRequest';
import { Result } from '../../../domain/shared/Result';
import { InvalidInputError } from '../../../domain/errors/InvalidInputError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';

/**
 * Use Case for retrieving a user's vacation request history
 * Returns all vacation requests for the authenticated user
 */
export class GetVacationHistoryUseCase {
  constructor(private readonly vacationRepository: IVacationRepository) {}

  /**
   * Executes the vacation history retrieval
   * @param userId - Authenticated user's ID
   * @returns Result containing an array of VacationRequest entities
   */
  async execute(userId: string): Promise<Result<VacationRequest[]>> {
    try {
      if (!userId || userId.trim().length === 0) {
        return Result.fail(new InvalidInputError('userId', 'User ID is required'));
      }

      const result = await this.vacationRepository.findByRequesterId(userId);

      if (result.isFailure) {
        return Result.fail(result.getError());
      }

      // Sort by creation date (most recent first)
      const vacationRequests = result.getValue().sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

      return Result.ok(vacationRequests);
    } catch (error) {
      if (error instanceof DomainError) {
        return Result.fail(error);
      }

      return Result.fail(new UnexpectedDomainError());
    }
  }
}
