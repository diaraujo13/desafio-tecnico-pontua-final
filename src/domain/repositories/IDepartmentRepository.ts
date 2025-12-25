import { Department } from '../entities/Department';
import { Result } from '../shared/Result';

/**
 * Repository interface for department operations
 * Defines the contract for department data access
 */
export interface IDepartmentRepository {
  /**
   * Finds a department by its ID
   * @param id - Department ID
   * @returns A Result containing the Department or an error if not found
   */
  findById(id: string): Promise<Result<Department>>;

  /**
   * Lists all departments
   * @returns A Result containing an array of Departments or an error
   */
  listAll(): Promise<Result<Department[]>>;

  /**
   * Saves a department (create or update)
   * @param department - Department entity to save
   * @returns A Result indicating success or failure
   */
  save(department: Department): Promise<Result<void>>;
}
