import { DomainError } from './DomainError';

/**
 * UnauthorizedError
 *
 * Represents an authorization failure.
 */
export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Acesso não autorizado') {
    super(message, 'UNAUTHORIZED');
  }
}
