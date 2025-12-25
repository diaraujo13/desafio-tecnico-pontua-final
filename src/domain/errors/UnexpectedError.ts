import { DomainError } from './DomainError';

/**
 * UnexpectedError
 *
 * Represents an unexpected error that occurred during execution.
 * Used when catching unexpected exceptions that cannot be mapped to specific domain errors.
 */
export class UnexpectedError extends DomainError {
  constructor(message: string = 'An unexpected error occurred') {
    super(message, 'UNEXPECTED_ERROR');
  }
}



