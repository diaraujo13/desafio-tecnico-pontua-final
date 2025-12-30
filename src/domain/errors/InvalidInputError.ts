import { DomainError } from './DomainError';

/**
 * InvalidInputError
 *
 * Represents invalid input provided to a use case.
 */
export class InvalidInputError extends DomainError {
  constructor(field: string, reason?: string) {
    const message = reason ? `${field} inválido: ${reason}` : `${field} inválido`;
    super(message, 'INVALID_INPUT');
  }
}
