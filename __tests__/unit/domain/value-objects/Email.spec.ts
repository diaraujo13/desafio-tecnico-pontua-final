import { Email } from '../../../../src/domain/value-objects/Email';
import { InvalidEmailFormatError } from '../../../../src/domain/errors/InvalidEmailFormatError';

describe('Email', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      const email = Email.create('test@example.com');

      expect(email.value).toBe('test@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = Email.create('TEST@EXAMPLE.COM');

      expect(email.value).toBe('test@example.com');
    });

    it('should trim whitespace from email', () => {
      const email = Email.create('  test@example.com  ');

      expect(email.value).toBe('test@example.com');
    });

    it('should throw InvalidEmailFormatError for empty string', () => {
      expect(() => {
        Email.create('');
      }).toThrow(InvalidEmailFormatError);
    });

    it('should throw InvalidEmailFormatError for null', () => {
      expect(() => {
        Email.create(null as unknown as string);
      }).toThrow(InvalidEmailFormatError);
    });

    it('should throw InvalidEmailFormatError for invalid email format', () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@invalid.com',
        'invalid@.com',
        'invalid.com',
        'invalid@com',
        'invalid @example.com',
        'invalid@example .com',
        'invalid@example',
      ];

      invalidEmails.forEach(invalidEmail => {
        expect(() => {
          Email.create(invalidEmail);
        }).toThrow(InvalidEmailFormatError);
      });
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example.co.uk',
        'test_email@example-domain.com',
      ];

      validEmails.forEach(validEmail => {
        expect(() => {
          Email.create(validEmail);
        }).not.toThrow();
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');

      expect(email1.equals(email2)).toBe(false);
    });

    it('should be case-insensitive', () => {
      const email1 = Email.create('TEST@EXAMPLE.COM');
      const email2 = Email.create('test@example.com');

      expect(email1.equals(email2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the email as a string', () => {
      const email = Email.create('test@example.com');

      expect(email.toString()).toBe('test@example.com');
    });
  });
});
