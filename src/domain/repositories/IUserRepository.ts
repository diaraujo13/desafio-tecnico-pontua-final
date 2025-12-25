import { User } from '../entities/User';
import { Result } from '../shared/Result';

/**
 * Repository interface for user operations
 * Defines the contract for user data access
 */
export interface IUserRepository {
  /**
   * Finds a user by their ID
   * @param id - User ID
   * @returns A Result containing the User or an error if not found
   */
  findById(id: string): Promise<Result<User>>;

  /**
   * Finds a user by their email address
   * @param email - User's email address (as string)
   * @returns A Result containing the User or an error if not found
   */
  findByEmail(email: string): Promise<Result<User>>;

  /**
   * Saves a user (create or update)
   * @param user - User entity to save
   * @returns A Result indicating success or failure
   */
  save(user: User): Promise<Result<void>>;

  /**
   * Finds all users in a department
   * @param departmentId - Department ID
   * @returns A Result containing an array of Users or an error
   */
  findByDepartmentId(departmentId: string): Promise<Result<User[]>>;

  /**
   * Finds all users managed by a specific manager
   * @param managerId - Manager's user ID
   * @returns A Result containing an array of Users or an error
   */
  findByManagerId(managerId: string): Promise<Result<User[]>>;
}



