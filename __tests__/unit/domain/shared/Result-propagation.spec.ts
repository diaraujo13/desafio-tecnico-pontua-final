import { Result } from '../../../../src/domain/shared/Result';
import { InvalidInputError } from '../../../../src/domain/errors/InvalidInputError';
import { UnexpectedError } from '../../../../src/domain/errors/UnexpectedError';

/**
 * Tests for error propagation in Result chain
 * Verifies that DomainErrors can be propagated correctly through Result.fail(result.getError())
 * WITHOUT mutation or shape changes
 */
describe('Result Error Propagation', () => {
  it('should propagate DomainError through Result.fail(result.getError()) without mutation', () => {
    const error = new InvalidInputError('field', 'First error');
    const firstResult = Result.fail(error);

    // Propagate the error
    const secondResult = Result.fail(firstResult.getError());

    expect(secondResult.isFailure).toBe(true);
    const propagatedError = secondResult.getError();
    expect(propagatedError.message).toBe('Invalid field: First error');
    expect(propagatedError.code).toBe('INVALID_INPUT');
    // CRITICAL: The same instance should be preserved (reference equality)
    expect(propagatedError).toBe(error);
  });

  it('should propagate DomainError through Result.fail(result.getError())', () => {
    const domainError = new InvalidInputError('field', 'Validation failed');
    const firstResult = Result.fail(domainError);

    // Propagate the error
    const secondResult = Result.fail(firstResult.getError());

    expect(secondResult.isFailure).toBe(true);
    const propagatedError = secondResult.getError();
    expect(propagatedError.message).toBe('Invalid field: Validation failed');
    expect(propagatedError.code).toBe('INVALID_INPUT');
    // CRITICAL: Reference equality - same instance
    expect(propagatedError).toBe(domainError);
  });

  it('should allow chaining multiple Result.fail() calls', () => {
    const error = new UnexpectedError('Error 1');
    const error1 = Result.fail(error);
    const error2 = Result.fail(error1.getError());
    const error3 = Result.fail(error2.getError());

    expect(error3.isFailure).toBe(true);
    expect(error3.getError().message).toBe('Error 1');
    expect(error3.getError().code).toBe('UNEXPECTED_ERROR');
    // All should reference the same DomainError instance
    expect(error3.getError()).toBe(error);
    expect(error2.getError()).toBe(error);
    expect(error1.getError()).toBe(error);
  });

  it('should preserve error code when propagating', () => {
    const error = new InvalidInputError('field', 'Test error');
    const firstResult = Result.fail(error);

    const secondResult = Result.fail(firstResult.getError());

    expect(secondResult.getError().code).toBe('INVALID_INPUT');
    expect(secondResult.getError().message).toBe('Invalid field: Test error');
    // Reference equality
    expect(secondResult.getError()).toBe(error);
  });

  it('propagates DomainError without mutation', () => {
    const error = new InvalidInputError('field', 'x');
    const r1 = Result.fail(error);
    const r2 = Result.fail(r1.getError());

    expect(r2.getError()).toBe(error);
    expect(r2.getError().message).toBe('Invalid field: x');
    expect(r2.getError().code).toBe('INVALID_INPUT');
  });
});
