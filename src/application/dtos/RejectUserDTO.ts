/**
 * Input DTO for rejecting a user registration
 */
export interface RejectUserDTO {
  userId: string;
  rejectedBy: string; // ID of the admin rejecting the registration
  reason: string; // Mandatory reason for rejection
}
