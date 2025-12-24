import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageAdapter } from '../../../../src/infrastructure/storage/AsyncStorageAdapter';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

describe('AsyncStorageAdapter', () => {
  let adapter: AsyncStorageAdapter;

  beforeEach(() => {
    adapter = new AsyncStorageAdapter();
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return null when key does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await adapter.get('non-existent-key');

      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('non-existent-key');
    });

    it('should return parsed JSON value when key exists', async () => {
      const storedValue = { id: '123', name: 'Test' };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedValue));

      const result = await adapter.get<typeof storedValue>('test-key');

      expect(result).toEqual(storedValue);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should return null when JSON parsing fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-json');

      const result = await adapter.get('invalid-key');

      expect(result).toBeNull();
    });

    it('should return null when getItem throws an error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await adapter.get('error-key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should store a value as JSON string', async () => {
      const value = { id: '123', name: 'Test' };
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await adapter.set('test-key', value);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(value));
    });

    it('should store primitive values', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await adapter.set('string-key', 'test-string');
      await adapter.set('number-key', 42);
      await adapter.set('boolean-key', true);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'string-key',
        JSON.stringify('test-string')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('number-key', JSON.stringify(42));
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('boolean-key', JSON.stringify(true));
    });

    it('should throw error when setItem fails', async () => {
      const error = new Error('Storage write error');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(error);

      await expect(adapter.set('test-key', 'value')).rejects.toThrow(
        'Failed to store value for key "test-key"'
      );
    });
  });

  describe('remove', () => {
    it('should remove a value by key', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await adapter.remove('test-key');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should throw error when removeItem fails', async () => {
      const error = new Error('Storage remove error');
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(error);

      await expect(adapter.remove('test-key')).rejects.toThrow(
        'Failed to remove value for key "test-key"'
      );
    });
  });

  describe('clear', () => {
    it('should clear all storage', async () => {
      (AsyncStorage.clear as jest.Mock).mockResolvedValue(undefined);

      await adapter.clear();

      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    it('should throw error when clear fails', async () => {
      const error = new Error('Storage clear error');
      (AsyncStorage.clear as jest.Mock).mockRejectedValue(error);

      await expect(adapter.clear()).rejects.toThrow('Failed to clear storage');
    });
  });

  describe('getAllKeys', () => {
    it('should return all keys from storage', async () => {
      const keys = ['key1', 'key2', 'key3'];
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(keys);

      const result = await adapter.getAllKeys();

      expect(result).toEqual(keys);
      expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
    });

    it('should throw error when getAllKeys fails', async () => {
      const error = new Error('Storage get keys error');
      (AsyncStorage.getAllKeys as jest.Mock).mockRejectedValue(error);

      await expect(adapter.getAllKeys()).rejects.toThrow('Failed to get all keys');
    });
  });
});


