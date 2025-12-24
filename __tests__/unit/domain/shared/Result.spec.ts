import { Result } from '../../../../src/domain/shared/Result';
import { DomainError } from '../../../../src/domain/errors/DomainError';
import { InvalidInputError } from '../../../../src/domain/errors/InvalidInputError';
import { UnexpectedError } from '../../../../src/domain/errors/UnexpectedError';

describe('Result', () => {
  describe('ok', () => {
    it('should create a successful Result with a value', () => {
      const result = Result.ok('test value');

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.getValue()).toBe('test value');
    });

    it('should create a successful Result without a value', () => {
      const result = Result.ok();

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.getValue()).toBeUndefined();
    });

    it('should create a successful Result with null value', () => {
      const result = Result.ok(null);

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.getValue()).toBeNull();
    });

    it('should create a successful Result with object value', () => {
      const value = { id: 1, name: 'test' };
      const result = Result.ok(value);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(value);
    });
  });

  describe('fail', () => {
    it('should create a failed Result with DomainError', () => {
      const error = new InvalidInputError('field', 'Something went wrong');
      const result = Result.fail(error);

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      const domainError = result.getError();
      expect(domainError).toBe(error);
      expect(domainError.message).toBe('Invalid field: Something went wrong');
      expect(domainError.code).toBe('INVALID_INPUT');
    });

    it('should create a failed Result with DomainError and custom code', () => {
      const error = new DomainError('Custom error', 'ERROR_001');
      const result = Result.fail(error);

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe(error);
      expect(result.getError().code).toBe('ERROR_001');
    });

    it('should create a failed Result with UnexpectedError', () => {
      const error = new UnexpectedError('Test error');
      const result = Result.fail(error);

      expect(result.isSuccess).toBe(false);
      const domainError = result.getError();
      expect(domainError).toBe(error);
      expect(domainError.message).toBe('Test error');
      expect(domainError.code).toBe('UNEXPECTED_ERROR');
    });

    it('should create a failed Result with error code', () => {
      const error = new InvalidInputError('field', 'Something went wrong');
      const result = Result.fail(error);

      expect(result.isSuccess).toBe(false);
      const domainError = result.getError();
      expect(domainError.code).toBe('INVALID_INPUT');
      expect(domainError.message).toBe('Invalid field: Something went wrong');
    });
  });

  describe('getValue', () => {
    it('should return the value for a successful Result', () => {
      const value = 'success value';
      const result = Result.ok(value);

      expect(result.getValue()).toBe(value);
    });

    it('should throw an error when trying to get value from a failed Result', () => {
      const result = Result.fail(new InvalidInputError('field', 'error'));

      expect(() => {
        result.getValue();
      }).toThrow('Cannot get value from a failed Result');
    });
  });

  describe('getError', () => {
    it('should return DomainError for a failed Result', () => {
      const error = new InvalidInputError('field', 'test error');
      const result = Result.fail(error);
      const domainError = result.getError();

      expect(domainError).toBe(error);
      expect(domainError.message).toBe('Invalid field: test error');
      expect(typeof domainError.message).toBe('string');
    });

    it('should return DomainError with message property accessible', () => {
      const error = new InvalidInputError('field', 'test error');
      const result = Result.fail(error);
      const domainError = result.getError();

      // Verify that message is directly accessible without type casting
      expect(domainError.message).toBe('Invalid field: test error');
    });

    it('should throw an error when trying to get error from a successful Result', () => {
      const result = Result.ok('value');

      expect(() => {
        result.getError();
      }).toThrow('Cannot get error from a successful Result');
    });
  });

  describe('isSuccess and isFailure', () => {
    it('should return correct boolean values for successful Result', () => {
      const result = Result.ok('value');

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
    });

    it('should return correct boolean values for failed Result', () => {
      const result = Result.fail(new InvalidInputError('field', 'error'));

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
    });
  });

  describe('type safety', () => {
    it('should maintain type safety for success values', () => {
      const result = Result.ok<number>(42);
      const value: number = result.getValue();

      expect(typeof value).toBe('number');
      expect(value).toBe(42);
    });

    it('should always return DomainError from getError', () => {
      const error = new InvalidInputError('field', 'test error');
      const result = Result.fail(error);
      const domainError: DomainError = result.getError();

      // Verify DomainError contract
      expect(domainError).toBe(error);
      expect(domainError).toHaveProperty('message');
      expect(typeof domainError.message).toBe('string');
      expect(domainError.message).toBe('Invalid field: test error');
    });

    it('should accept DomainError instances directly', () => {
      const domainError = new InvalidInputError('field', 'Domain validation failed');
      const result = Result.fail(domainError);
      const received = result.getError();

      expect(received).toBe(domainError);
      expect(received.message).toBe('Invalid field: Domain validation failed');
      expect(received.code).toBe('INVALID_INPUT');
    });
  });
});
