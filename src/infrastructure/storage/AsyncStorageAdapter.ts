import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorageAdapter } from './IStorageAdapter';

/**
 * Adapter for AsyncStorage
 * Used for storing non-sensitive data (preferences, cache, etc.)
 * Implements IStorageAdapter interface
 */
export class AsyncStorageAdapter implements IStorageAdapter {
  /**
   * Retrieves a value from AsyncStorage by key
   * @param key - The storage key
   * @returns A Promise that resolves to the stored value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch {
      // If parsing fails, return null (key might not exist or value is corrupted)
      return null;
    }
  }

  /**
   * Stores a value in AsyncStorage with the given key
   * @param key - The storage key
   * @param value - The value to store (will be serialized to JSON)
   * @returns A Promise that resolves when the value is stored
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
    } catch (error) {
      throw new Error(
        `Failed to store value for key "${key}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Removes a value from AsyncStorage by key
   * @param key - The storage key
   * @returns A Promise that resolves when the value is removed
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw new Error(
        `Failed to remove value for key "${key}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Removes all values from AsyncStorage
   * @returns A Promise that resolves when all values are removed
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      throw new Error(
        `Failed to clear storage: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Gets all keys stored in AsyncStorage
   * @returns A Promise that resolves to an array of all keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // Convert readonly array to mutable array
      return [...keys];
    } catch (error) {
      throw new Error(
        `Failed to get all keys: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
