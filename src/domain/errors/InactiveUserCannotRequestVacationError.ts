import { ValidationError } from './ValidationError';

/**
 * Thrown when an inactive user attempts to request vacation.
 */
export class InactiveUserCannotRequestVacationError extends ValidationError {
  constructor() {
    super(
      'User is not active and cannot request vacation',
      'INACTIVE_USER_CANNOT_REQUEST_VACATION',
    );
  }
}
