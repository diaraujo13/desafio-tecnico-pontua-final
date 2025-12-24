import { DateRange } from '../../../../src/domain/value-objects/DateRange';
import { InvalidDateRangeError } from '../../../../src/domain/errors/InvalidDateRangeError';

describe('DateRange', () => {
  describe('create', () => {
    it('should create a valid date range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-10');
      const dateRange = DateRange.create(startDate, endDate);

      // Compare normalized dates (start of day)
      const expectedStart = new Date(startDate);
      expectedStart.setHours(0, 0, 0, 0);
      const expectedEnd = new Date(endDate);
      expectedEnd.setHours(0, 0, 0, 0);

      expect(dateRange.startDate.getTime()).toBe(expectedStart.getTime());
      expect(dateRange.endDate.getTime()).toBe(expectedEnd.getTime());
    });

    it('should throw InvalidDateRangeError when start date equals end date', () => {
      const date = new Date('2024-01-01');

      expect(() => {
        DateRange.create(date, date);
      }).toThrow(InvalidDateRangeError);
    });

    it('should throw InvalidDateRangeError when start date is after end date', () => {
      const startDate = new Date('2024-01-10');
      const endDate = new Date('2024-01-01');

      expect(() => {
        DateRange.create(startDate, endDate);
      }).toThrow(InvalidDateRangeError);
    });

    it('should throw InvalidDateRangeError for null dates', () => {
      expect(() => {
        DateRange.create(null as unknown as Date, new Date());
      }).toThrow(InvalidDateRangeError);

      expect(() => {
        DateRange.create(new Date(), null as unknown as Date);
      }).toThrow(InvalidDateRangeError);
    });

    it('should throw InvalidDateRangeError for invalid Date objects', () => {
      const invalidDate = new Date('invalid');
      const validDate = new Date('2024-01-01');

      expect(() => {
        DateRange.create(invalidDate, validDate);
      }).toThrow(InvalidDateRangeError);

      expect(() => {
        DateRange.create(validDate, invalidDate);
      }).toThrow(InvalidDateRangeError);

      expect(() => {
        DateRange.create(invalidDate, invalidDate);
      }).toThrow(InvalidDateRangeError);
    });

    it('should normalize dates to start of day', () => {
      const startDate = new Date('2024-01-01T14:30:00');
      const endDate = new Date('2024-01-10T09:15:00');
      const dateRange = DateRange.create(startDate, endDate);

      const normalizedStart = new Date(dateRange.startDate);
      normalizedStart.setHours(0, 0, 0, 0);

      const normalizedEnd = new Date(dateRange.endDate);
      normalizedEnd.setHours(0, 0, 0, 0);

      expect(dateRange.startDate.getTime()).toBe(normalizedStart.getTime());
      expect(dateRange.endDate.getTime()).toBe(normalizedEnd.getTime());
    });
  });

  describe('getDays', () => {
    it('should calculate the correct number of days (inclusive)', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-10');
      const dateRange = DateRange.create(startDate, endDate);

      expect(dateRange.getDays()).toBe(10);
    });

    it('should return 1 day for consecutive dates', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-02');
      const dateRange = DateRange.create(startDate, endDate);

      expect(dateRange.getDays()).toBe(2);
    });

    it('should calculate days correctly across DST transition (fall back)', () => {
      // DST fall back in US typically occurs in early November
      // Using 2024-11-02 to 2024-11-04 (spans DST transition on Nov 3)
      const startDate = new Date('2024-11-02');
      const endDate = new Date('2024-11-04');
      const dateRange = DateRange.create(startDate, endDate);

      // Should return 3 days (Nov 2, 3, 4) regardless of DST
      expect(dateRange.getDays()).toBe(3);
    });

    it('should calculate days correctly across DST transition (spring forward)', () => {
      // DST spring forward in US typically occurs in early March
      // Using 2024-03-09 to 2024-03-11 (spans DST transition on Mar 10)
      const startDate = new Date('2024-03-09');
      const endDate = new Date('2024-03-11');
      const dateRange = DateRange.create(startDate, endDate);

      // Should return 3 days (Mar 9, 10, 11) regardless of DST
      expect(dateRange.getDays()).toBe(3);
    });

    it('should calculate days correctly for a full month range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const dateRange = DateRange.create(startDate, endDate);

      // Should return 31 days (all days of January)
      expect(dateRange.getDays()).toBe(31);
    });
  });

  describe('contains', () => {
    it('should return true for a date within the range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-10');
      const dateRange = DateRange.create(startDate, endDate);

      const dateInRange = new Date('2024-01-05');

      expect(dateRange.contains(dateInRange)).toBe(true);
    });

    it('should return true for the start date', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-10');
      const dateRange = DateRange.create(startDate, endDate);

      expect(dateRange.contains(startDate)).toBe(true);
    });

    it('should return true for the end date', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-10');
      const dateRange = DateRange.create(startDate, endDate);

      expect(dateRange.contains(endDate)).toBe(true);
    });

    it('should return false for a date before the range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-10');
      const dateRange = DateRange.create(startDate, endDate);

      const dateBefore = new Date('2023-12-31');

      expect(dateRange.contains(dateBefore)).toBe(false);
    });

    it('should return false for a date after the range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-10');
      const dateRange = DateRange.create(startDate, endDate);

      const dateAfter = new Date('2024-01-11');

      expect(dateRange.contains(dateAfter)).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for equal date ranges', () => {
      const startDate1 = new Date('2024-01-01');
      const endDate1 = new Date('2024-01-10');
      const dateRange1 = DateRange.create(startDate1, endDate1);

      const startDate2 = new Date('2024-01-01');
      const endDate2 = new Date('2024-01-10');
      const dateRange2 = DateRange.create(startDate2, endDate2);

      expect(dateRange1.equals(dateRange2)).toBe(true);
    });

    it('should return false for different date ranges', () => {
      const startDate1 = new Date('2024-01-01');
      const endDate1 = new Date('2024-01-10');
      const dateRange1 = DateRange.create(startDate1, endDate1);

      const startDate2 = new Date('2024-01-02');
      const endDate2 = new Date('2024-01-10');
      const dateRange2 = DateRange.create(startDate2, endDate2);

      expect(dateRange1.equals(dateRange2)).toBe(false);
    });
  });
});
