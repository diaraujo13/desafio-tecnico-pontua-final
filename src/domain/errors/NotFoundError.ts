import { DomainError } from './DomainError';

/**
 * NotFoundError
 *
 * Represents a resource that was not found.
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} com identificador '${identifier}' não encontrado`
      : `${resource} não encontrado`;
    super(message, 'NOT_FOUND');
  }
}
