import { DomainError } from './DomainError';

/**
 * Thrown when attempting to create a Department without a valid name.
 */
export class DepartmentNameRequiredError extends DomainError {
  constructor() {
    super('O nome do departamento não pode estar vazio', 'DEPARTMENT_NAME_REQUIRED');
  }
}
