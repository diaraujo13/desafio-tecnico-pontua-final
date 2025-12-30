import { DomainError } from './DomainError';

/**
 * Error thrown when an email format is invalid
 */
export class InvalidEmailFormatError extends DomainError {
  constructor(email?: string) {
    const message = email ? `Formato de e-mail inválido: ${email}` : 'Formato de e-mail inválido';
    super(message);
  }
}
