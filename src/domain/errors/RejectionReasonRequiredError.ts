import { ValidationError } from './ValidationError';

/**
 * Error thrown when rejecting a vacation request without providing a reason
 * Rejection reason is mandatory when status is REJECTED
 */
export class RejectionReasonRequiredError extends ValidationError {
  constructor() {
    super('Rejection reason is required when rejecting a vacation request');
  }
}
