import { DomainError } from './DomainError';

/**
 * Thrown when an inactive user attempts to request vacation.
 */
export class InactiveUserCannotRequestVacationError extends DomainError {
  constructor() {
    super(
      'Usuário não está ativo e não pode solicitar férias',
      'INACTIVE_USER_CANNOT_REQUEST_VACATION',
    );
  }
}
