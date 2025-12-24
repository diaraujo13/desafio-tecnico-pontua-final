import { IVacationRepository } from '../../domain/repositories/IVacationRepository';
import { VacationRequest } from '../../domain/entities/VacationRequest';
import { Result } from '../../domain/shared/Result';
import { VacationStatus } from '../../domain/enums/VacationStatus';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { InfrastructureFailureError } from '../../domain/errors/InfrastructureFailureError';
import { VacationRequestMapper } from '../../application/mappers/VacationRequestMapper';
import { ApiClient } from '../api/client';

/**
 * Concrete implementation of IVacationRepository
 * Uses the API client to fetch data from the backend
 */
export class VacationRepositoryImpl implements IVacationRepository {
  constructor(private readonly apiClient: ApiClient) {}

  /**
   * Saves a vacation request (create or update)
   */
  async save(vacationRequest: VacationRequest): Promise<Result<void>> {
    try {
      const dto = VacationRequestMapper.toDTO(vacationRequest);

      if (vacationRequest.id) {
        // Check if exists (update) or create new
        try {
          await this.apiClient.get(`/vacation-requests/${vacationRequest.id}`);
          // Exists, update it
          await this.apiClient.put(`/vacation-requests/${vacationRequest.id}`, dto);
        } catch (error) {
          // Only create if the error is specifically a 404 (not found)
          // Other errors (500, 401, timeout, etc.) should be propagated
          if (error instanceof Error && error.message.includes('404')) {
            // Doesn't exist, create it
            await this.apiClient.post('/vacation-requests', dto);
          } else {
            // Re-throw non-404 errors to be handled by outer catch
            throw error;
          }
        }
      } else {
        // Create new
        await this.apiClient.post('/vacation-requests', dto);
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to save vacation request',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  /**
   * Finds a vacation request by its ID
   */
  async findById(id: string): Promise<Result<VacationRequest>> {
    try {
      const data = await this.apiClient.get<{
        id: string;
        requesterId: string;
        reviewerId?: string | null;
        startDate: string;
        endDate: string;
        observation?: string | null;
        status: string;
        createdAt: string;
        updatedAt: string;
        reviewedAt?: string | null;
        rejectionReason?: string | null;
      }>(`/vacation-requests/${id}`);

      const vacationRequest = VacationRequestMapper.fromAPI(data);
      return Result.ok(vacationRequest);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return Result.fail(new NotFoundError('Vacation request', id));
      }
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch vacation request',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  /**
   * Finds all vacation requests for a specific user
   */
  async findByRequesterId(userId: string): Promise<Result<VacationRequest[]>> {
    try {
      const data = await this.apiClient.get<
        Array<{
          id: string;
          requesterId: string;
          reviewerId?: string | null;
          startDate: string;
          endDate: string;
          observation?: string | null;
          status: string;
          createdAt: string;
          updatedAt: string;
          reviewedAt?: string | null;
          rejectionReason?: string | null;
        }>
      >(`/vacation-requests?requesterId=${userId}`);

      const vacationRequests = data.map(item => VacationRequestMapper.fromAPI(item));
      return Result.ok(vacationRequests);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch vacation requests',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  /**
   * Finds all pending vacation requests for a manager's department
   * Note: This assumes the backend can filter by managerId and status
   * If not, we may need to fetch all and filter in memory
   * The managerId parameter is kept for interface compatibility but filtering is done in the Use Case
   */
  async findPendingByManagerId(_managerId: string): Promise<Result<VacationRequest[]>> {
    try {
      // Try to fetch with query params if backend supports it
      const data = await this.apiClient.get<
        Array<{
          id: string;
          requesterId: string;
          reviewerId?: string | null;
          startDate: string;
          endDate: string;
          observation?: string | null;
          status: string;
          createdAt: string;
          updatedAt: string;
          reviewedAt?: string | null;
          rejectionReason?: string | null;
        }>
      >(`/vacation-requests?status=${VacationStatus.PENDING_APPROVAL}`);

      // Filter by manager's department (this logic might need to be enhanced
      // based on how the backend structures the data)
      // For now, we'll return all pending requests and let the Use Case filter
      const vacationRequests = data.map(item => VacationRequestMapper.fromAPI(item));
      return Result.ok(vacationRequests);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch pending vacation requests',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  /**
   * Finds vacation requests by status for a specific user
   */
  async findByRequesterIdAndStatus(
    userId: string,
    status: VacationStatus
  ): Promise<Result<VacationRequest[]>> {
    try {
      const data = await this.apiClient.get<
        Array<{
          id: string;
          requesterId: string;
          reviewerId?: string | null;
          startDate: string;
          endDate: string;
          observation?: string | null;
          status: string;
          createdAt: string;
          updatedAt: string;
          reviewedAt?: string | null;
          rejectionReason?: string | null;
        }>
      >(`/vacation-requests?requesterId=${userId}&status=${status}`);

      const vacationRequests = data.map(item => VacationRequestMapper.fromAPI(item));
      return Result.ok(vacationRequests);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch vacation requests',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  /**
   * Finds all vacation requests (admin only)
   */
  async findAll(): Promise<Result<VacationRequest[]>> {
    try {
      const data = await this.apiClient.get<
        Array<{
          id: string;
          requesterId: string;
          reviewerId?: string | null;
          startDate: string;
          endDate: string;
          observation?: string | null;
          status: string;
          createdAt: string;
          updatedAt: string;
          reviewedAt?: string | null;
          rejectionReason?: string | null;
        }>
      >('/vacation-requests');

      const vacationRequests = data.map(item => VacationRequestMapper.fromAPI(item));
      return Result.ok(vacationRequests);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch all vacation requests',
          error instanceof Error ? error : undefined
        )
      );
    }
  }
}
