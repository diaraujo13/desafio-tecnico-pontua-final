import { Password } from '../../../../src/domain/value-objects/Password';
import { WeakPasswordError } from '../../../../src/domain/errors/WeakPasswordError';

describe('Password', () => {
  describe('create', () => {
    it('should create a valid password', () => {
      const password = Password.create('ValidPass123!');

      expect(password.value).toBe('ValidPass123!');
    });

    it('should throw WeakPasswordError for empty string', () => {
      expect(() => {
        Password.create('');
      }).toThrow(WeakPasswordError);
    });

    it('should throw WeakPasswordError for null', () => {
      expect(() => {
        Password.create(null as unknown as string);
      }).toThrow(WeakPasswordError);
    });

    it('should throw WeakPasswordError for password shorter than 8 characters', () => {
      expect(() => {
        Password.create('Short1!');
      }).toThrow(WeakPasswordError);
    });

    it('should throw WeakPasswordError for password without uppercase', () => {
      expect(() => {
        Password.create('validpass123!');
      }).toThrow(WeakPasswordError);
    });

    it('should throw WeakPasswordError for password without lowercase', () => {
      expect(() => {
        Password.create('VALIDPASS123!');
      }).toThrow(WeakPasswordError);
    });

    it('should throw WeakPasswordError for password without number', () => {
      expect(() => {
        Password.create('ValidPass!');
      }).toThrow(WeakPasswordError);
    });

    it('should throw WeakPasswordError for password without special character', () => {
      expect(() => {
        Password.create('ValidPass123');
      }).toThrow(WeakPasswordError);
    });

    it('should accept valid passwords with all requirements', () => {
      const validPasswords = ['ValidPass123!', 'Another1@Pass', 'Test#123Pass', 'My$Pass2024'];

      validPasswords.forEach(validPassword => {
        expect(() => {
          Password.create(validPassword);
        }).not.toThrow();
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal passwords', () => {
      const password1 = Password.create('ValidPass123!');
      const password2 = Password.create('ValidPass123!');

      expect(password1.equals(password2)).toBe(true);
    });

    it('should return false for different passwords', () => {
      const password1 = Password.create('ValidPass123!');
      const password2 = Password.create('AnotherPass123!');

      expect(password1.equals(password2)).toBe(false);
    });
  });
});
