import { DomainError } from './DomainError';

/**
 * NotFoundError
 *
 * Represents a resource that was not found.
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND');
  }
}
