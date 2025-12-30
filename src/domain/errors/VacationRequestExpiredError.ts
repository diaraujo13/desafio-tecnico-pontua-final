import { DomainError } from './DomainError';

/**
 * Error thrown when a vacation request has expired and cannot be edited or cancelled
 * A vacation request expires if today > start date or if it's after the end date
 */
export class VacationRequestExpiredError extends DomainError {
  constructor(message?: string) {
    super(message || 'A solicitação de férias expirou e não pode ser editada ou cancelada');
  }
}
