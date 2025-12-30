import { DomainError } from './DomainError';

/**
 * Error thrown when attempting an invalid status transition
 */
export class InvalidStatusTransitionError extends DomainError {
  constructor(currentStatus: string, targetStatus: string, reason?: string) {
    const message = reason
      ? `Transição de status inválida de ${currentStatus} para ${targetStatus}: ${reason}`
      : `Transição de status inválida de ${currentStatus} para ${targetStatus}`;
    super(message);
  }
}
