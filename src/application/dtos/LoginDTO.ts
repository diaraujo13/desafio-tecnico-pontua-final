/**
 * DTO for login credentials
 * Uses primitive types to keep Application layer decoupled from Domain VOs
 */
export interface LoginDTO {
  email: string;
  password: string;
}
