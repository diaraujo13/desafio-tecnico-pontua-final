/**
 * Base class for all domain errors
 * Extends the native Error class to provide consistent error handling
 *
 * DomainError is the ONLY error contract in the application.
 * All Use Cases MUST return Result<T, DomainError>.
 * Errors are created once and propagated unchanged.
 */
export class DomainError extends Error {
  /**
   * Error code for programmatic handling
   * Defaults to the class name (e.g., 'InvalidInputError', 'InvalidEmailFormatError')
   */
  public readonly code: string;

  constructor (message: string, code?: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code || this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    const ErrorConstructor = Error as typeof Error & {
      captureStackTrace?: (error: Error, constructorOpt?: Function) => void;
    };
    if (typeof ErrorConstructor.captureStackTrace === 'function') {
      ErrorConstructor.captureStackTrace(this, this.constructor);
    }
  }
}
