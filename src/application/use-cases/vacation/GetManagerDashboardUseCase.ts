import { IVacationRepository } from '../../../domain/repositories/IVacationRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { VacationRequest } from '../../../domain/entities/VacationRequest';
import { Result } from '../../../domain/shared/Result';
import { VacationStatus } from '../../../domain/enums/VacationStatus';
import { InvalidInputError } from '../../../domain/errors/InvalidInputError';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';

/**
 * Use Case for managers to view their team's vacation requests
 * Implements Smart Query: filters requests by department and excludes manager's own requests
 */
export class GetManagerDashboardUseCase {
  constructor(
    private readonly vacationRepository: IVacationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Executes the manager dashboard query
   * @param managerId - Manager's user ID
   * @param departmentId - Manager's department ID
   * @returns Result containing filtered VacationRequest entities (only subordinates, prioritizing pending)
   */
  async execute(managerId: string, departmentId: string): Promise<Result<VacationRequest[]>> {
    try {
      if (!managerId || managerId.trim().length === 0) {
        return Result.fail(new InvalidInputError('managerId', 'Manager ID is required'));
      }

      if (!departmentId || departmentId.trim().length === 0) {
        return Result.fail(new InvalidInputError('departmentId', 'Department ID is required'));
      }

      // Fetch all pending requests (repository may filter by status)
      const pendingResult = await this.vacationRepository.findPendingByManagerId(managerId);

      if (pendingResult.isFailure) {
        return Result.fail(pendingResult.getError());
      }

      // Get all users in the manager's department
      const departmentUsersResult = await this.userRepository.findByDepartmentId(departmentId);

      if (departmentUsersResult.isFailure) {
        return Result.fail(departmentUsersResult.getError());
      }

      const departmentUserIds = new Set(departmentUsersResult.getValue().map((user) => user.id));

      // Filter requests:
      // 1. Only from users in the same department
      // 2. Exclude manager's own requests
      // 3. Prioritize pending requests
      const filteredRequests = pendingResult
        .getValue()
        .filter((request) => {
          // Must be from a user in the same department
          if (!departmentUserIds.has(request.requesterId)) {
            return false;
          }

          // Exclude manager's own requests
          if (request.requesterId === managerId) {
            return false;
          }

          return true;
        })
        .sort((a, b) => {
          // Prioritize pending requests first
          if (
            a.status === VacationStatus.PENDING_APPROVAL &&
            b.status !== VacationStatus.PENDING_APPROVAL
          ) {
            return -1;
          }
          if (
            a.status !== VacationStatus.PENDING_APPROVAL &&
            b.status === VacationStatus.PENDING_APPROVAL
          ) {
            return 1;
          }

          // Then sort by creation date (most recent first)
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

      return Result.ok(filteredRequests);
    } catch (error) {
      if (error instanceof DomainError) {
        return Result.fail(error);
      }

      return Result.fail(new UnexpectedDomainError());
    }
  }
}
