/**
 * Input DTO for approving a user registration
 */
export interface ApproveUserDTO {
  userId: string;
  approvedBy: string; // ID of the admin approving the registration
}
