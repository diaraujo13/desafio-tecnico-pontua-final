import { InvalidDateRangeError } from '../errors/InvalidDateRangeError';

/**
 * DateRange Value Object
 * Encapsulates date range validation logic and ensures start date is before end date
 */
export class DateRange {
  private readonly _startDate: Date;
  private readonly _endDate: Date;

  private constructor(startDate: Date, endDate: Date) {
    // Normalize dates to start of day for comparison
    this._startDate = new Date(startDate);
    this._startDate.setHours(0, 0, 0, 0);

    this._endDate = new Date(endDate);
    this._endDate.setHours(0, 0, 0, 0);
  }

  /**
   * Creates a new DateRange instance
   * @param startDate - The start date of the range
   * @param endDate - The end date of the range
   * @returns A new DateRange instance
   * @throws InvalidDateRangeError if start date is not before end date
   */
  static create(startDate: Date, endDate: Date): DateRange {
    if (!startDate || !endDate) {
      throw new InvalidDateRangeError(startDate, endDate);
    }

    // Validate that dates are valid (not Invalid Date)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new InvalidDateRangeError(startDate, endDate);
    }

    const normalizedStart = new Date(startDate);
    normalizedStart.setHours(0, 0, 0, 0);

    const normalizedEnd = new Date(endDate);
    normalizedEnd.setHours(0, 0, 0, 0);

    if (normalizedStart >= normalizedEnd) {
      throw new InvalidDateRangeError(startDate, endDate);
    }

    return new DateRange(startDate, endDate);
  }

  /**
   * Gets the start date
   * @returns The start date
   */
  get startDate(): Date {
    return new Date(this._startDate);
  }

  /**
   * Gets the end date
   * @returns The end date
   */
  get endDate(): Date {
    return new Date(this._endDate);
  }

  /**
   * Calculates the duration of the date range in days
   * Uses calendar day differences to avoid DST (Daylight Saving Time) issues
   * @returns The number of days in the range (inclusive)
   */
  getDays(): number {
    // Use UTC to calculate calendar day differences, avoiding DST issues
    const startUTC = Date.UTC(
      this._startDate.getFullYear(),
      this._startDate.getMonth(),
      this._startDate.getDate(),
    );
    const endUTC = Date.UTC(
      this._endDate.getFullYear(),
      this._endDate.getMonth(),
      this._endDate.getDate(),
    );

    // Calculate difference in milliseconds and convert to days
    const diffTime = endUTC - startUTC;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Add 1 to include both start and end dates (inclusive)
    return diffDays + 1;
  }

  /**
   * Checks if a date is within this range (inclusive)
   * @param date - The date to check
   * @returns true if the date is within the range, false otherwise
   */
  contains(date: Date): boolean {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    return normalizedDate >= this._startDate && normalizedDate <= this._endDate;
  }

  /**
   * Compares two DateRange instances for equality
   * @param other - The other DateRange instance to compare
   * @returns true if date ranges are equal, false otherwise
   */
  equals(other: DateRange): boolean {
    return (
      this._startDate.getTime() === other._startDate.getTime() &&
      this._endDate.getTime() === other._endDate.getTime()
    );
  }
}
