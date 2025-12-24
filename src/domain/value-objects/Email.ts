import { InvalidEmailFormatError } from '../errors/InvalidEmailFormatError';

/**
 * Email Value Object
 * Encapsulates email validation logic and ensures email format is always valid
 */
export class Email {
  private readonly _value: string;

  private static readonly EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  private constructor(value: string) {
    this._value = value.toLowerCase().trim();
  }

  /**
   * Creates a new Email instance
   * @param value - The email string to validate
   * @returns A new Email instance
   * @throws InvalidEmailFormatError if the email format is invalid
   */
  static create(value: string): Email {
    if (!value || typeof value !== 'string') {
      throw new InvalidEmailFormatError(value);
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      throw new InvalidEmailFormatError(value);
    }

    if (!Email.EMAIL_REGEX.test(trimmedValue)) {
      throw new InvalidEmailFormatError(value);
    }

    return new Email(trimmedValue);
  }

  /**
   * Gets the email value as a string
   * @returns The email string
   */
  get value(): string {
    return this._value;
  }

  /**
   * Compares two Email instances for equality
   * @param other - The other Email instance to compare
   * @returns true if emails are equal, false otherwise
   */
  equals(other: Email): boolean {
    return this._value === other._value;
  }

  /**
   * Returns the email as a string
   * @returns The email string
   */
  toString(): string {
    return this._value;
  }
}
