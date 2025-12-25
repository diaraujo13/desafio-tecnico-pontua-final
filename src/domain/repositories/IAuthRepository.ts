import { User } from '../entities/User';
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';
import { Result } from '../shared/Result';

/**
 * Repository interface for authentication operations
 * Defines the contract for authentication data access
 */
export interface IAuthRepository {
  /**
   * Authenticates a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns A Result containing the authenticated User or an error
   */
  login(email: Email, password: Password): Promise<Result<User>>;

  /**
   * Logs out the current user
   * @returns A Promise that resolves when logout is complete
   */
  logout(): Promise<void>;
}



