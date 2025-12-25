import { DomainError } from './DomainError';

/**
 * UnauthorizedError
 *
 * Represents an authorization failure.
 */
export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED');
  }
}



