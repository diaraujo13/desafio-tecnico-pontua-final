import { DomainError } from './DomainError';

/**
 * Error thrown when rejecting a vacation request without providing a reason
 * Rejection reason is mandatory when status is REJECTED
 */
export class RejectionReasonRequiredError extends DomainError {
  constructor() {
    super('Motivo da rejeição é obrigatório ao rejeitar uma solicitação de férias');
  }
}
