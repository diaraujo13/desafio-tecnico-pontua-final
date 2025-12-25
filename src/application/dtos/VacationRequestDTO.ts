import { VacationStatus } from '../../domain/enums/VacationStatus';

/**
 * Input DTO for creating a vacation request
 * Dates are represented as ISO 8601 strings
 */
export interface RequestVacationDTO {
  requesterId: string;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  observation?: string | null;
}

/**
 * Input DTO for approving a vacation request
 */
export interface ApproveVacationDTO {
  requestId: string;
  reviewerId: string;
}

/**
 * Input DTO for rejecting a vacation request
 */
export interface RejectVacationDTO {
  requestId: string;
  reviewerId: string;
  reason: string; // Mandatory for rejection
}

/**
 * Input DTO for cancelling a vacation request
 */
export interface CancelVacationDTO {
  requestId: string;
  requesterId: string; // To verify ownership
}

/**
 * Output DTO for vacation request
 * Used when returning vacation request data to the UI
 */
export interface VacationRequestDTO {
  id: string;
  requesterId: string;
  reviewerId: string | null;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  observation: string | null;
  status: VacationStatus;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  reviewedAt: string | null; // ISO 8601 format
  rejectionReason: string | null;
}



