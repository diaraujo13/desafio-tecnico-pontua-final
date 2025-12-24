import { DomainError } from '../errors/DomainError';

/**
 * Result type for Railway Oriented Programming (ROP)
 * Represents a computation that can either succeed (Ok) or fail (Fail)
 *
 * DomainError is the ONLY error contract.
 * All Use Cases MUST return Result<T, DomainError>.
 * Errors are created once and propagated unchanged.
 *
 * @template T - The type of the success value
 */
export class Result<T> {
  private readonly _value?: T;
  private readonly _error?: DomainError;
  private readonly _isSuccess: boolean;

  private constructor (isSuccess: boolean, value?: T, error?: DomainError) {
    this._isSuccess = isSuccess;
    this._value = value;
    this._error = error;
  }

  /**
   * Creates a successful Result with an optional value
   * @param value - The success value (optional)
   * @returns A Result representing success
   */
  static ok<U> (value?: U): Result<U> {
    return new Result<U>(true, value);
  }

  /**
   * Creates a failed Result with a DomainError
   *
   * The caller MUST provide a DomainError instance.
   * No conversion, normalization, or guessing is performed.
   * The error contract is enforced strictly at the call site.
   *
   * @param error - A DomainError instance
   * @returns A Result representing failure
   */
  static fail (error: DomainError): Result<never> {
    return new Result<never>(false, undefined as never, error);
  }

  /**
   * Checks if the Result represents a success
   * @returns true if successful, false otherwise
   */
  get isSuccess (): boolean {
    return this._isSuccess;
  }

  /**
   * Checks if the Result represents a failure
   * @returns true if failed, false otherwise
   */
  get isFailure (): boolean {
    return !this._isSuccess;
  }

  /**
   * Gets the success value
   * @returns The success value
   * @throws Error if the Result represents a failure
   */
  getValue (): T {
    if (this.isFailure) {
      throw new Error('Cannot get value from a failed Result');
    }
    return this._value as T;
  }

  /**
   * Gets the error value (always DomainError)
   * @returns The DomainError instance
   * @throws Error if the Result represents a success
   */
  getError (): DomainError {
    if (this.isSuccess) {
      throw new Error('Cannot get error from a successful Result');
    }
    return this._error as DomainError;
  }
}
