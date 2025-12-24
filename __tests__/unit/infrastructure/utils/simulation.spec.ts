import { simulateRequest, simulateError } from '../../../../src/infrastructure/utils/simulation';

describe('Simulation Utils', () => {
  describe('simulateRequest', () => {
    it('should return data after delay', async () => {
      const start = Date.now();
      const data = { test: 'value' };
      const result = await simulateRequest(data, 100);

      const elapsed = Date.now() - start;

      expect(result).toEqual(data);
      expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some margin
      expect(elapsed).toBeLessThan(200);
    });

    it('should use default delay of 800ms', async () => {
      const start = Date.now();
      await simulateRequest('test');

      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(750);
      expect(elapsed).toBeLessThan(900);
    });

    it('should reject when shouldFail is true', async () => {
      await expect(simulateRequest('test', 50, true)).rejects.toThrow('Simulated network error');
    });

    it('should resolve when shouldFail is false', async () => {
      const result = await simulateRequest('test', 50, false);
      expect(result).toBe('test');
    });
  });

  describe('simulateError', () => {
    it('should reject with error message after delay', async () => {
      const start = Date.now();

      await expect(simulateError('Custom error', 100)).rejects.toThrow('Custom error');

      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(90);
      expect(elapsed).toBeLessThan(200);
    });

    it('should use default error message', async () => {
      await expect(simulateError()).rejects.toThrow('Network error');
    });

    it('should use default delay of 800ms', async () => {
      const start = Date.now();

      await expect(simulateError('Test')).rejects.toThrow();

      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(750);
      expect(elapsed).toBeLessThan(900);
    });
  });
});


