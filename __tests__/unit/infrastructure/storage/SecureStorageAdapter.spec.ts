import * as Keychain from 'react-native-keychain';
import { SecureStorageAdapter } from '../../../../src/infrastructure/storage/SecureStorageAdapter';

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(),
  setGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

describe('SecureStorageAdapter', () => {
  let adapter: SecureStorageAdapter;

  beforeEach(() => {
    adapter = new SecureStorageAdapter();
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return null when key does not exist', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

      const result = await adapter.get('non-existent-key');

      expect(result).toBeNull();
      expect(Keychain.getGenericPassword).toHaveBeenCalledWith({ service: 'non-existent-key' });
    });

    it('should return null when credentials exist but password is empty', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'key',
        password: '',
      });

      const result = await adapter.get('test-key');

      expect(result).toBeNull();
    });

    it('should return parsed JSON value when key exists', async () => {
      const storedValue = { token: 'abc123', userId: 'user1' };
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'test-key',
        password: JSON.stringify(storedValue),
      });

      const result = await adapter.get<typeof storedValue>('test-key');

      expect(result).toEqual(storedValue);
      expect(Keychain.getGenericPassword).toHaveBeenCalledWith({ service: 'test-key' });
    });

    it('should return null when JSON parsing fails', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'test-key',
        password: 'invalid-json',
      });

      const result = await adapter.get('test-key');

      expect(result).toBeNull();
    });

    it('should return null when getGenericPassword throws an error', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(new Error('Keychain error'));

      const result = await adapter.get('error-key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should store a value as JSON string', async () => {
      const value = { token: 'abc123', userId: 'user1' };
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await adapter.set('test-key', value);

      expect(Keychain.setGenericPassword).toHaveBeenCalledWith('test-key', JSON.stringify(value), {
        service: 'test-key',
      });
    });

    it('should store primitive values', async () => {
      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await adapter.set('string-key', 'test-string');
      await adapter.set('number-key', 42);

      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        'string-key',
        JSON.stringify('test-string'),
        {
          service: 'string-key',
        },
      );
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith('number-key', JSON.stringify(42), {
        service: 'number-key',
      });
    });

    it('should throw error when setGenericPassword fails', async () => {
      const error = new Error('Keychain write error');
      (Keychain.setGenericPassword as jest.Mock).mockRejectedValue(error);

      await expect(adapter.set('test-key', 'value')).rejects.toThrow(
        'Failed to store secure value for key "test-key"',
      );
    });
  });

  describe('remove', () => {
    it('should remove a value by key', async () => {
      (Keychain.resetGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await adapter.remove('test-key');

      expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({ service: 'test-key' });
    });

    it('should throw error when resetGenericPassword fails', async () => {
      const error = new Error('Keychain remove error');
      (Keychain.resetGenericPassword as jest.Mock).mockRejectedValue(error);

      await expect(adapter.remove('test-key')).rejects.toThrow(
        'Failed to remove secure value for key "test-key"',
      );
    });
  });

  describe('clear', () => {
    it('should clear all storage', async () => {
      (Keychain.resetGenericPassword as jest.Mock).mockResolvedValue(undefined);

      await adapter.clear();

      expect(Keychain.resetGenericPassword).toHaveBeenCalledWith();
    });

    it('should throw error when resetGenericPassword fails', async () => {
      const error = new Error('Keychain clear error');
      (Keychain.resetGenericPassword as jest.Mock).mockRejectedValue(error);

      await expect(adapter.clear()).rejects.toThrow('Failed to clear secure storage');
    });
  });

  describe('getAllKeys', () => {
    it('should return empty array (limitation of react-native-keychain)', async () => {
      const result = await adapter.getAllKeys();

      expect(result).toEqual([]);
      // Note: react-native-keychain doesn't support listing all keys
    });
  });
});
