import { DomainError } from './DomainError';

/**
 * Error thrown when a password does not meet minimum requirements
 */
export class WeakPasswordError extends DomainError {
  constructor(requirements?: string) {
    const message = requirements
      ? `Senha não atende aos requisitos: ${requirements}`
      : 'Senha não atende aos requisitos mínimos';
    super(message);
  }
}
