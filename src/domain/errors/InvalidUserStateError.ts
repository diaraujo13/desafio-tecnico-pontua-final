import { DomainError } from './DomainError';

/**
 * InvalidUserStateError
 *
 * Thrown when a user operation is attempted on a user in an invalid state.
 * For example: trying to approve a user that is not in PENDING_APPROVAL status.
 */
export class InvalidUserStateError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_USER_STATE');
  }
}
