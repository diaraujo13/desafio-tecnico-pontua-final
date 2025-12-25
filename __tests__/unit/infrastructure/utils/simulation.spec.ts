import { simulateRequest, simulateError } from '../../../../src/infrastructure/utils/simulation';

describe('Simulation Utils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('simulateRequest', () => {
    it('should return data after delay', async () => {
      const promise = simulateRequest({ test: 'value' }, 100);

      jest.advanceTimersByTime(100);

      await expect(promise).resolves.toEqual({ test: 'value' });
    });

    it('should use default delay of 800ms', async () => {
      const promise = simulateRequest('test');

      jest.advanceTimersByTime(800);

      await expect(promise).resolves.toBe('test');
    });

    it('should reject when shouldFail is true', async () => {
      const promise = simulateRequest('test', 50, true);

      jest.advanceTimersByTime(50);

      await expect(promise).rejects.toThrow('Simulated network error');
    });

    it('should resolve when shouldFail is false', async () => {
      const promise = simulateRequest('test', 50, false);

      jest.advanceTimersByTime(50);

      await expect(promise).resolves.toBe('test');
    });
  });

  describe('simulateError', () => {
    it('should reject with error message after delay', async () => {
      const promise = simulateError('Custom error', 100);

      jest.advanceTimersByTime(100);

      await expect(promise).rejects.toThrow('Custom error');
    });

    it('should use default error message', async () => {
      const promise = simulateError();

      jest.advanceTimersByTime(800);

      await expect(promise).rejects.toThrow('Network error');
    });

    it('should use default delay of 800ms', async () => {
      const promise = simulateError('Test');

      jest.advanceTimersByTime(800);

      await expect(promise).rejects.toThrow();
    });
  });
});
