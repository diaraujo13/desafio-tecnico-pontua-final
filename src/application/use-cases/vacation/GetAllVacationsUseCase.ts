import { IVacationRepository } from '../../../domain/repositories/IVacationRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { VacationRequest } from '../../../domain/entities/VacationRequest';
import { Result } from '../../../domain/shared/Result';
import { VacationStatus } from '../../../domain/enums/VacationStatus';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';

/**
 * Use Case for administrators to view all vacation requests across the company
 * Only admins can execute this use case
 */
export class GetAllVacationsUseCase {
  constructor(
    private readonly vacationRepository: IVacationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Executes the query to get all vacation requests
   * @param filters - Optional filters for the query
   * @returns Result containing an array of VacationRequest entities
   */
  async execute(filters?: {
    departmentId?: string;
    status?: VacationStatus;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Result<VacationRequest[]>> {
    try {
      // Fetch all vacation requests
      const result = await this.vacationRepository.findAll();

      if (result.isFailure) {
        return Result.fail(result.getError());
      }

      let vacationRequests = result.getValue();

      // Apply filters in memory (for MVP)
      // In a production system, these filters would be applied at the repository/database level
      if (filters?.departmentId) {
        // Get all users in the specified department
        const departmentUsersResult = await this.userRepository.findByDepartmentId(
          filters.departmentId,
        );

        if (departmentUsersResult.isFailure) {
          return Result.fail(departmentUsersResult.getError());
        }

        const departmentUserIds = new Set(departmentUsersResult.getValue().map((user) => user.id));

        // Filter requests to include only those from users in the department
        vacationRequests = vacationRequests.filter((req) => departmentUserIds.has(req.requesterId));
      }

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
