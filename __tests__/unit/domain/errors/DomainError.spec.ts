import { DomainError } from '../../../../src/domain/errors/DomainError';
import { InvalidInputError } from '../../../../src/domain/errors/InvalidInputError';

describe('DomainError', () => {
  it('should create a DomainError with a message', () => {
    const error = new DomainError('Test error message');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.message).toBe('Test error message');
    expect(error.name).toBe('DomainError');
  });

  it('should have a stack trace', () => {
    const error = new DomainError('Test error');

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });
});

describe('Concrete DomainError subclasses', () => {
  it('should extend DomainError', () => {
    const error = new InvalidInputError('field', 'Validation failed');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.message).toBe('Invalid field: Validation failed');
    expect(error.code).toBe('INVALID_INPUT');
  });
});
