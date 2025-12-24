import { DomainError } from './DomainError';

/**
 * Error thrown when a vacation request has expired and cannot be edited or cancelled
 * A vacation request expires if today > start date or if it's after the end date
 */
export class VacationRequestExpiredError extends DomainError {
  constructor(message?: string) {
    super(message || 'Vacation request has expired and cannot be edited or cancelled');
  }
}
