import { DomainError } from './DomainError';

/**
 * Thrown when an inactive user attempts to request vacation.
 */
export class InactiveUserCannotRequestVacationError extends DomainError {
  constructor() {
    super(
      'User is not active and cannot request vacation',
      'INACTIVE_USER_CANNOT_REQUEST_VACATION',
    );
  }
}
