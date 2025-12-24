import { User } from '../../domain/entities/User';
import { UserRole } from '../../domain/enums/UserRole';
import { UserStatus } from '../../domain/enums/UserStatus';
import type { UserDTO } from '../dtos/UserDTO';

/**
 * Mapper for converting between User Domain Entity and external representations
 * - fromAPI: raw API -> Domain
 * - toDTO: Domain -> UserDTO (Application output)
 */
export class UserMapper {
  /**
   * Converts API response data to a User entity
   * Used when receiving user data from the backend
   * @param data - Raw API response data
   * @returns User entity
   */
  static fromAPI(data: {
    id: string;
    registrationNumber: string;
    name: string;
    email: string;
    role: string;
    status: string;
    departmentId: string;
    managerId?: string | null;
    createdAt: string;
    updatedAt: string;
  }): User {
    return User.create({
      id: data.id,
      registrationNumber: data.registrationNumber,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      status: data.status as UserStatus,
      departmentId: data.departmentId,
      managerId: data.managerId,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  /**
   * Converts a User Domain Entity to a UserDTO
   * Used as Application output for Presentation layer
   */
  static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      registrationNumber: user.registrationNumber,
      name: user.name,
      email: user.email.value,
      role: user.role,
      status: user.status,
      departmentId: user.departmentId,
      managerId: user.managerId,
    };
  }
}
