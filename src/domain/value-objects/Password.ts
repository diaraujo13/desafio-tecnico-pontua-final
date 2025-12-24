import { WeakPasswordError } from '../errors/WeakPasswordError';

/**
 * Password Value Object
 * Encapsulates password validation logic and ensures password meets minimum requirements
 */
export class Password {
  private readonly _value: string;

  private static readonly MIN_LENGTH = 8;
  private static readonly REQUIRES_UPPERCASE = true;
  private static readonly REQUIRES_LOWERCASE = true;
  private static readonly REQUIRES_NUMBER = true;
  private static readonly REQUIRES_SPECIAL_CHAR = true;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a new Password instance
   * @param value - The password string to validate
   * @returns A new Password instance
   * @throws WeakPasswordError if the password does not meet requirements
   */
  static create(value: string): Password {
    if (!value || typeof value !== 'string') {
      throw new WeakPasswordError('Password is required');
    }

    const errors: string[] = [];

    if (value.length < Password.MIN_LENGTH) {
      errors.push(`at least ${Password.MIN_LENGTH} characters`);
    }

    if (Password.REQUIRES_UPPERCASE && !/[A-Z]/.test(value)) {
      errors.push('one uppercase letter');
    }

    if (Password.REQUIRES_LOWERCASE && !/[a-z]/.test(value)) {
      errors.push('one lowercase letter');
    }

    if (Password.REQUIRES_NUMBER && !/[0-9]/.test(value)) {
      errors.push('one number');
    }

    if (Password.REQUIRES_SPECIAL_CHAR && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
      errors.push('one special character');
    }

    if (errors.length > 0) {
      const requirements = `Password must contain: ${errors.join(', ')}`;
      throw new WeakPasswordError(requirements);
    }

    return new Password(value);
  }

  /**
   * Gets the password value as a string
   * @returns The password string
   */
  get value(): string {
    return this._value;
  }

  /**
   * Compares two Password instances for equality
   * @param other - The other Password instance to compare
   * @returns true if passwords are equal, false otherwise
   */
  equals(other: Password): boolean {
    return this._value === other._value;
  }
}
