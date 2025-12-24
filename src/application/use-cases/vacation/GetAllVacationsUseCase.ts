import { IVacationRepository } from '../../../domain/repositories/IVacationRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { VacationRequest } from '../../../domain/entities/VacationRequest';
import { Result } from '../../../domain/shared/Result';
import { VacationStatus } from '../../../domain/enums/VacationStatus';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { InvalidInputError } from '../../../domain/errors/InvalidInputError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';

/**
 * Use Case for administrators to view all vacation requests across the company
 * Enforces RBAC: only admins can execute this use case
 */
export class GetAllVacationsUseCase {
  constructor (
    private readonly vacationRepository: IVacationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Executes the query to get all vacation requests
   * @param callerId - ID of the user making the request (must be admin)
   * @param filters - Optional filters for the query
   * @returns Result containing an array of VacationRequest entities
   */
  async execute (
    callerId: string,
    filters?: {
      departmentId?: string;
      status?: VacationStatus;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<Result<VacationRequest[]>> {
    try {
      // Validate callerId
      if (!callerId || callerId.trim().length === 0) {
        return Result.fail(new InvalidInputError('callerId', 'Caller ID is required'));
      }

      // Fetch the caller to verify admin role
      const callerResult = await this.userRepository.findById(callerId);
      if (callerResult.isFailure) {
        return Result.fail(new NotFoundError('User', callerId));
      }

      const caller = callerResult.getValue();

      // Enforce RBAC: only admins can view all vacation requests
      if (!caller.isAdmin()) {
        return Result.fail(
          new UnauthorizedError('Only administrators can view all vacation requests'),
        );
      }

      // Fetch all vacation requests
      const result = await this.vacationRepository.findAll();

      if (result.isFailure) {
        return Result.fail(result.getError());
      }

      let vacationRequests = result.getValue();

      // Apply filters in memory (for MVP)
      // In a production system, these filters would be applied at the repository/database level
      if (filters?.status) {
        vacationRequests = vacationRequests.filter((req) => req.status === filters.status);
      }

      if (filters?.startDate) {
        vacationRequests = vacationRequests.filter((req) => {
          return req.startDate >= filters.startDate!;
        });
      }

      if (filters?.endDate) {
        vacationRequests = vacationRequests.filter((req) => {
          return req.endDate <= filters.endDate!;
        });
      }

      // Sort by creation date (most recent first)
      vacationRequests.sort((a, b) => {
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
