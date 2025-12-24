import { ValidationError } from './ValidationError';

/**
 * Error thrown when a date range is invalid (start date >= end date)
 */
export class InvalidDateRangeError extends ValidationError {
  constructor(startDate?: Date, endDate?: Date) {
    let message = 'Invalid date range: start date must be before end date';

    if (startDate && endDate) {
      const startStr = isNaN(startDate.getTime()) ? 'Invalid Date' : startDate.toISOString();
      const endStr = isNaN(endDate.getTime()) ? 'Invalid Date' : endDate.toISOString();
      message = `Invalid date range: start date (${startStr}) must be before end date (${endStr})`;
    } else if (startDate && isNaN(startDate.getTime())) {
      message = 'Invalid date range: start date is invalid';
    } else if (endDate && isNaN(endDate.getTime())) {
      message = 'Invalid date range: end date is invalid';
    }

    super(message);
  }
}
