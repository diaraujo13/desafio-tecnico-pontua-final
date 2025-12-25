/**
 * DTO for user data exposed by Application layer
 * Uses primitives to avoid leaking Domain internals (like Value Objects)
 */
export interface UserDTO {
  id: string;
  registrationNumber: string;
  name: string;
  email: string;
  role: string;
  status: string;
  departmentId: string;
  managerId: string | null;
}



