import { VacationRequest } from '../entities/VacationRequest';
import { Result } from '../shared/Result';
import { VacationStatus } from '../enums/VacationStatus';

/**
 * Repository interface for vacation request operations
 * Defines the contract for vacation request data access
 */
export interface IVacationRepository {
  /**
   * Saves a vacation request (create or update)
   * @param vacationRequest - VacationRequest entity to save
   * @returns A Result indicating success or failure
   */
  save(vacationRequest: VacationRequest): Promise<Result<void>>;

  /**
   * Finds a vacation request by its ID
   * @param id - Vacation request ID
   * @returns A Result containing the VacationRequest or an error if not found
   */
  findById(id: string): Promise<Result<VacationRequest>>;

  /**
   * Finds all vacation requests for a specific user
   * @param userId - User ID (requester)
   * @returns A Result containing an array of VacationRequests or an error
   */
  findByRequesterId(userId: string): Promise<Result<VacationRequest[]>>;

  /**
   * Finds all pending vacation requests for a manager's department
   * @param managerId - Manager's user ID
   * @returns A Result containing an array of pending VacationRequests or an error
   */
  findPendingByManagerId(managerId: string): Promise<Result<VacationRequest[]>>;

  /**
   * Finds vacation requests by status for a specific user
   * @param userId - User ID (requester)
   * @param status - Vacation status to filter by
   * @returns A Result containing an array of VacationRequests or an error
   */
  findByRequesterIdAndStatus(
    userId: string,
    status: VacationStatus,
  ): Promise<Result<VacationRequest[]>>;

  /**
   * Finds all vacation requests (admin only)
   * @returns A Result containing an array of all VacationRequests or an error
   */
  findAll(): Promise<Result<VacationRequest[]>>;
}
