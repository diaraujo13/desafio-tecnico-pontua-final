import { DomainError } from './DomainError';

/**
 * Error thrown when an email format is invalid
 */
export class InvalidEmailFormatError extends DomainError {
  constructor(email?: string) {
    const message = email ? `Invalid email format: ${email}` : 'Invalid email format';
    super(message);
  }
}
