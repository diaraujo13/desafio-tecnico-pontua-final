import { ValidationError } from './ValidationError';

/**
 * Error thrown when an email format is invalid
 */
export class InvalidEmailFormatError extends ValidationError {
  constructor(email?: string) {
    const message = email ? `Invalid email format: ${email}` : 'Invalid email format';
    super(message);
  }
}
