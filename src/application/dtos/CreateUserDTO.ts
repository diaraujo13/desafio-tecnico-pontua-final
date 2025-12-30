import { UserRole } from '../../domain/enums/UserRole';

/**
 * Input DTO for creating a new user
 * Used by managers and admins to register new users
 */
export interface CreateUserDTO {
  registrationNumber: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  departmentId: string;
  managerId?: string | null;
  createdBy: string; // ID of the user creating this account (manager/admin)
}
