import { DomainError } from './DomainError';

/**
 * Base class for validation errors.
 *
 * IMPORTANT:
 * - This class is ABSTRACT and MUST NOT be instantiated directly.
 * - Every concrete validation rule MUST have its own subclass.
 * - Names of subclasses MUST describe the specific violated rule.
 */
export abstract class ValidationError extends DomainError {
  protected constructor(message: string, code?: string) {
    super(message, code);
  }
}
