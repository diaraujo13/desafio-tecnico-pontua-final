import { DomainError } from './DomainError';

/**
 * Error thrown when attempting an invalid status transition
 */
export class InvalidStatusTransitionError extends DomainError {
  constructor(currentStatus: string, targetStatus: string, reason?: string) {
    const message = reason
      ? `Invalid status transition from ${currentStatus} to ${targetStatus}: ${reason}`
      : `Invalid status transition from ${currentStatus} to ${targetStatus}`;
    super(message);
  }
}
