import { IVacationRepository } from '../../../domain/repositories/IVacationRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { RejectVacationDTO } from '../../dtos/VacationRequestDTO';
import { Result } from '../../../domain/shared/Result';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';

/**
 * Use Case for rejecting a vacation request
 * Enforces RBAC: only managers can reject requests
 */
export class RejectVacationUseCase {
  constructor(
    private readonly vacationRepository: IVacationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Executes the vacation request rejection
   * @param dto - Reject vacation DTO
   * @returns Result containing void on success or an error
   */
  async execute(dto: RejectVacationDTO): Promise<Result<void>> {
    try {
      // Fetch the vacation request
      const requestResult = await this.vacationRepository.findById(dto.requestId);
      if (requestResult.isFailure) {
        return Result.fail(new NotFoundError('Vacation request', dto.requestId));
      }

      const vacationRequest = requestResult.getValue();

      // Verify reviewer is a manager
      const reviewerResult = await this.userRepository.findById(dto.reviewerId);
      if (reviewerResult.isFailure) {
        return Result.fail(new NotFoundError('Reviewer', dto.reviewerId));
      }

      const reviewer = reviewerResult.getValue();
      if (!reviewer.isManager() && !reviewer.isAdmin()) {
        return Result.fail(
          new UnauthorizedError('Only managers or admins can reject vacation requests'),
        );
      }

      // Reject the request (entity validates state transition and reason)
      vacationRequest.reject(dto.reviewerId, dto.reason);

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
