/**
 * Output DTO for user permissions
 * Represents what actions a user is allowed to perform
 * Permissions are computed in Domain and returned as data
 */
export interface UserPermissionsDTO {
  canRequestVacation: boolean;
  canApproveVacations: boolean;
  canApproveUserRegistration: boolean;
  canCreateUser: boolean;
  canRegisterUser: boolean;
  canViewPendingRegistrations: boolean;
  canRejectUserRegistration: boolean;
}
