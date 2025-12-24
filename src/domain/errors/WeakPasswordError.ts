import { DomainError } from './DomainError';

/**
 * Error thrown when a password does not meet minimum requirements
 */
export class WeakPasswordError extends DomainError {
  constructor(requirements?: string) {
    const message = requirements
      ? `Password does not meet requirements: ${requirements}`
      : 'Password does not meet minimum requirements';
    super(message);
  }
}
