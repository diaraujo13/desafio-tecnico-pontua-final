import { VacationRequest } from '../../domain/entities/VacationRequest';
import { RequestVacationDTO, VacationRequestDTO } from '../dtos/VacationRequestDTO';

/**
 * Mapper for converting between VacationRequest entities and DTOs
 * Handles date string/Date object conversions
 */
export class VacationRequestMapper {
  /**
   * Converts a VacationRequest entity to a DTO
   * @param entity - VacationRequest entity
   * @returns VacationRequestDTO with dates as ISO 8601 strings
   */
  static toDTO(entity: VacationRequest): VacationRequestDTO {
    return {
      id: entity.id,
      requesterId: entity.requesterId,
      reviewerId: entity.reviewerId,
      startDate: entity.startDate.toISOString(),
      endDate: entity.endDate.toISOString(),
      observation: entity.observation,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      reviewedAt: entity.reviewedAt?.toISOString() || null,
      rejectionReason: entity.rejectionReason,
    };
  }

  /**
   * Converts a DTO to a VacationRequest entity
   * Used when creating a new vacation request from UI input
   * @param dto - RequestVacationDTO with dates as ISO 8601 strings
   * @param id - Vacation request ID
   * @param createdAt - Creation date (optional, defaults to now)
   * @param updatedAt - Update date (optional, defaults to now)
   * @returns VacationRequest entity
   */
  static toDomain(
    dto: RequestVacationDTO,
    id: string,
    createdAt?: Date,
    updatedAt?: Date
  ): VacationRequest {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format in DTO');
    }

    return VacationRequest.create({
      id,
      requesterId: dto.requesterId,
      startDate,
      endDate,
      observation: dto.observation || null,
      createdAt,
      updatedAt,
    });
  }

  /**
   * Converts raw API data (JSON) to a VacationRequest entity
   * Used by Infrastructure layer when fetching data from API
   * @param data - Raw data from API with dates as ISO 8601 strings
   * @returns VacationRequest entity
   */
  static fromAPI(data: {
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
  }): VacationRequest {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const createdAt = new Date(data.createdAt);
    const updatedAt = new Date(data.updatedAt);
    const reviewedAt = data.reviewedAt ? new Date(data.reviewedAt) : null;

    if (
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime()) ||
      isNaN(createdAt.getTime()) ||
      isNaN(updatedAt.getTime()) ||
      (reviewedAt && isNaN(reviewedAt.getTime()))
    ) {
      throw new Error('Invalid date format in API data');
    }

    return VacationRequest.reconstruct({
      id: data.id,
      requesterId: data.requesterId,
      startDate,
      endDate,
      observation: data.observation || null,
      status: data.status as any,
      createdAt,
      updatedAt,
      reviewerId: data.reviewerId || null,
      reviewedAt,
      rejectionReason: data.rejectionReason || null,
    });
  }
}
