import { IDepartmentRepository } from '../../domain/repositories/IDepartmentRepository';
import { Department } from '../../domain/entities/Department';
import { Result } from '../../domain/shared/Result';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { InfrastructureFailureError } from '../../domain/errors/InfrastructureFailureError';
import { departmentsSeed } from '../seed/seedData';
import { simulateRequest } from '../utils/simulation';

/**
 * In-memory implementation of IDepartmentRepository
 * Uses seed data to provide department data access
 */
export class DepartmentRepositoryInMemory implements IDepartmentRepository {
  /**
   * Finds a department by its ID
   * Returns a clone to ensure immutability
   */
  async findById(id: string): Promise<Result<Department>> {
    try {
      const departmentSeed = departmentsSeed.find(d => d.id === id);

      if (!departmentSeed) {
        return await simulateRequest(Result.fail(new NotFoundError('Department', id)), 800);
      }

      const department = Department.create({
        id: departmentSeed.id,
        name: departmentSeed.name,
        managerId: departmentSeed.managerId,
        createdAt: departmentSeed.createdAt,
        updatedAt: departmentSeed.updatedAt,
      });

      return await simulateRequest(Result.ok(department), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch department',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  /**
   * Lists all departments
   * Returns clones to ensure immutability
   */
  async listAll(): Promise<Result<Department[]>> {
    try {
      const departments = departmentsSeed.map(departmentSeed =>
        Department.create({
          id: departmentSeed.id,
          name: departmentSeed.name,
          managerId: departmentSeed.managerId,
          createdAt: departmentSeed.createdAt,
          updatedAt: departmentSeed.updatedAt,
        })
      );

      return await simulateRequest(Result.ok(departments), 800);
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to fetch departments',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  /**
   * Saves a department (create or update)
   * Note: In-memory implementation is volatile - changes are lost on app restart
   */
  async save(_department: Department): Promise<Result<void>> {
    try {
      // In a real implementation, this would persist to a database
      // For in-memory, we just simulate the operation
      await simulateRequest(undefined, 800);
      return Result.ok();
    } catch (error) {
      return Result.fail(
        new InfrastructureFailureError(
          'Failed to save department',
          error instanceof Error ? error : undefined
        )
      );
    }
  }
}
