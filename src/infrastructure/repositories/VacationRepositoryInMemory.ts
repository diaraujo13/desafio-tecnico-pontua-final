import { IVacationRepository } from '../../domain/repositories/IVacationRepository';
import { VacationRequest } from '../../domain/entities/VacationRequest';
import { Result } from '../../domain/shared/Result';
import { VacationStatus } from '../../domain/enums/VacationStatus';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { InfrastructureFailureError } from '../../domain/errors/InfrastructureFailureError';
import { vacationsSeed } from '../database/in-memory-db';
import { simulateRequest } from '../utils/simulation';

/**
 * In-memory implementation of IVacationRepository
 * Supports read and write operations (volatile - data persists only during session)
 */
export class VacationRepositoryInMemory implements IVacationRepository {
  // In-memory storage (initialized from seed, can be modified during session)
  private vacations: Array<{
    id: string;
    requesterId: string;
    reviewerId: string | null;
    startDate: Date;
    endDate: Date;
    observation: string | null;
    status: VacationStatus;
    createdAt: Date;
    updatedAt: Date;
    reviewedAt: Date | null;
    rejectionReason: string | null;
  }>;

  constructor() {
    // Initialize from seed data (deep clone to allow mutations)
    this.vacations = vacationsSeed.map((v) => ({
      id: v.id,
      requesterId: v.requesterId,
      reviewerId: v.reviewerId,
      startDate: new Date(v.startDate),
      endDate: new Date(v.endDate),
      observation: v.observation,
      status: v.status,
      createdAt: new Date(v.createdAt),
      updatedAt: new Date(v.updatedAt),
      reviewedAt: v.reviewedAt ? new Date(v.reviewedAt) : null,
      rejectionReason: v.rejectionReason,
    }));
  }

  /**
   * Saves a vacation request (create or update)
   * Updates existing item or adds new one to the in-memory array
   */
  async save(vacationRequest: VacationRequest): Promise<Result<void>> {
    try {
      const existingIndex = this.vacations.findIndex((v) => v.id === vacationRequest.id);

      const vacationData = {
        id: vacationRequest.id,
        requesterId: vacationRequest.requesterId,
        reviewerId: vacationRequest.reviewerId,
        startDate: vacationRequest.startDate,
        endDate: vacationRequest.endDate,
        observation: vacationRequest.observation,
        status: vacationRequest.status,
        createdAt: vacationRequest.createdAt,
        updatedAt: vacationRequest.updatedAt,
        reviewedAt: vacationRequest.reviewedAt,
        rejectionReason: vacationRequest.rejectionReason,
      };

      if (existingIndex >= 0) {
        // Update existing
        this.vacations[existingIndex] = vacationData;
      } else {
        // Create new
        this.vacations.push(vacationData);
      }

      await simulateRequest(undefined, 800);
      return Result.ok();
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to save vacation request',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  /**
   * Finds a vacation request by its ID
   * Returns a clone to ensure immutability
   */
  async findById(id: string): Promise<Result<VacationRequest>> {
    try {
      const vacationData = this.vacations.find((v) => v.id === id);

      if (!vacationData) {
        return await simulateRequest(Result.fail(new NotFoundError('Vacation request', id)), 800);
      }

      const vacationRequest = VacationRequest.reconstruct({
        id: vacationData.id,
        requesterId: vacationData.requesterId,
        startDate: vacationData.startDate,
        endDate: vacationData.endDate,
        observation: vacationData.observation,
        status: vacationData.status,
        createdAt: vacationData.createdAt,
        updatedAt: vacationData.updatedAt,
        reviewerId: vacationData.reviewerId,
        reviewedAt: vacationData.reviewedAt,
        rejectionReason: vacationData.rejectionReason,
      });

      return await simulateRequest(Result.ok(vacationRequest), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch vacation request',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  /**
   * Finds all vacation requests for a specific user
   * Returns clones to ensure immutability
   */
  async findByRequesterId(userId: string): Promise<Result<VacationRequest[]>> {
    try {
      const userVacations = this.vacations
        .filter((v) => v.requesterId === userId)
        .map((vacationData) =>
          VacationRequest.reconstruct({
            id: vacationData.id,
            requesterId: vacationData.requesterId,
            startDate: vacationData.startDate,
            endDate: vacationData.endDate,
            observation: vacationData.observation,
            status: vacationData.status,
            createdAt: vacationData.createdAt,
            updatedAt: vacationData.updatedAt,
            reviewerId: vacationData.reviewerId,
            reviewedAt: vacationData.reviewedAt,
            rejectionReason: vacationData.rejectionReason,
          }),
        );

      return await simulateRequest(Result.ok(userVacations), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch vacation requests',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  /**
   * Finds all pending vacation requests for a manager's department
   * Note: Department filtering is done in the Use Case layer
   */
  async findPendingByManagerId(_managerId: string): Promise<Result<VacationRequest[]>> {
    try {
      const pendingVacations = this.vacations
        .filter((v) => v.status === VacationStatus.PENDING_APPROVAL)
        .map((vacationData) =>
          VacationRequest.reconstruct({
            id: vacationData.id,
            requesterId: vacationData.requesterId,
            startDate: vacationData.startDate,
            endDate: vacationData.endDate,
            observation: vacationData.observation,
            status: vacationData.status,
            createdAt: vacationData.createdAt,
            updatedAt: vacationData.updatedAt,
            reviewerId: vacationData.reviewerId,
            reviewedAt: vacationData.reviewedAt,
            rejectionReason: vacationData.rejectionReason,
          }),
        );

      return await simulateRequest(Result.ok(pendingVacations), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch pending vacation requests',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  /**
   * Finds vacation requests by status for a specific user
   */
  async findByRequesterIdAndStatus(
    userId: string,
    status: VacationStatus,
  ): Promise<Result<VacationRequest[]>> {
    try {
      const filteredVacations = this.vacations
        .filter((v) => v.requesterId === userId && v.status === status)
        .map((vacationData) =>
          VacationRequest.reconstruct({
            id: vacationData.id,
            requesterId: vacationData.requesterId,
            startDate: vacationData.startDate,
            endDate: vacationData.endDate,
            observation: vacationData.observation,
            status: vacationData.status,
            createdAt: vacationData.createdAt,
            updatedAt: vacationData.updatedAt,
            reviewerId: vacationData.reviewerId,
            reviewedAt: vacationData.reviewedAt,
            rejectionReason: vacationData.rejectionReason,
          }),
        );

      return await simulateRequest(Result.ok(filteredVacations), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch vacation requests',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  /**
   * Finds all vacation requests (admin only)
   */
  async findAll(): Promise<Result<VacationRequest[]>> {
    try {
      const allVacations = this.vacations.map((vacationData) =>
        VacationRequest.reconstruct({
          id: vacationData.id,
          requesterId: vacationData.requesterId,
          startDate: vacationData.startDate,
          endDate: vacationData.endDate,
          observation: vacationData.observation,
          status: vacationData.status,
          createdAt: vacationData.createdAt,
          updatedAt: vacationData.updatedAt,
          reviewerId: vacationData.reviewerId,
          reviewedAt: vacationData.reviewedAt,
          rejectionReason: vacationData.rejectionReason,
        }),
      );

      return await simulateRequest(Result.ok(allVacations), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch all vacation requests',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }
}
