import { DomainError } from './DomainError';

/**
 * UnexpectedDomainError
 *
 * Generic error used when an exception that is NOT a DomainError
 * escapes into the Application layer (Use Cases).
 *
 * IMPORTANT:
 * - DomainErrors thrown by entities/value objects MUST NOT be wrapped in this.
 * - Only truly unexpected, non-domain exceptions should be converted here.
 */
export class UnexpectedDomainError extends DomainError {
  constructor(message: string = 'Ocorreu um erro inesperado') {
    super(message, 'UNEXPECTED_DOMAIN_ERROR');
  }
}
