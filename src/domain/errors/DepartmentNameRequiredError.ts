import { DomainError } from './DomainError';

/**
 * Thrown when attempting to create a Department without a valid name.
 */
export class DepartmentNameRequiredError extends DomainError {
  constructor() {
    super('Department name cannot be empty', 'DEPARTMENT_NAME_REQUIRED');
  }
}
