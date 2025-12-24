import { ValidationError } from './ValidationError';

/**
 * Thrown when the vacation request dates are syntactically invalid
 * (e.g. invalid date format in the incoming DTO).
 *
 * Note: semantic date-range validation (start >= end, etc.)
 * is handled by the DateRange value object and its own errors.
 */
export class InvalidVacationDateError extends ValidationError {
  constructor() {
    super('Invalid vacation date format', 'INVALID_VACATION_DATE');
  }
}
