import { DomainError } from './DomainError';

/**
 * InfrastructureFailureError
 *
 * Represents failures in infrastructure layer (network, storage, etc.)
 * that cannot be mapped to specific domain errors.
 */
export class InfrastructureFailureError extends DomainError {
  constructor(message: string, originalError?: Error) {
    const fullMessage = originalError ? `${message}: ${originalError.message}` : message;
    super(fullMessage, 'INFRASTRUCTURE_FAILURE');
  }
}


