import * as Keychain from 'react-native-keychain';
import { IStorageAdapter } from './IStorageAdapter';

/**
 * Adapter for secure storage using react-native-keychain
 * Used for storing sensitive data (tokens, passwords, etc.)
 * Implements IStorageAdapter interface
 *
 * Note: react-native-keychain stores values as strings, so we serialize/deserialize JSON
 */
export class SecureStorageAdapter implements IStorageAdapter {
  /**
   * Retrieves a value from secure storage by key
   * @param key - The storage key
   * @returns A Promise that resolves to the stored value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      if (!credentials || !credentials.password) {
        return null;
      }
      return JSON.parse(credentials.password) as T;
    } catch {
      // If parsing fails or key doesn't exist, return null
      return null;
    }
  }

  /**
   * Stores a value in secure storage with the given key
   * @param key - The storage key (used as service identifier)
   * @param value - The value to store (will be serialized to JSON)
   * @returns A Promise that resolves when the value is stored
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await Keychain.setGenericPassword(key, serialized, { service: key });
    } catch (error) {
      throw new Error(
        `Failed to store secure value for key "${key}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Removes a value from secure storage by key
   * @param key - The storage key
   * @returns A Promise that resolves when the value is removed
   */
  async remove(key: string): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
      throw new Error(
        `Failed to remove secure value for key "${key}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Removes all values from secure storage
   * Note: react-native-keychain doesn't have a clearAll method,
   * so we need to track keys manually or reset the entire keychain
   * For now, this will reset the entire keychain (use with caution)
   * @returns A Promise that resolves when all values are removed
   */
  async clear(): Promise<void> {
    try {
      // Reset the entire keychain (this removes all stored credentials)
      await Keychain.resetGenericPassword();
    } catch (error) {
      throw new Error(
        `Failed to clear secure storage: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Gets all keys stored in secure storage
   * Note: react-native-keychain doesn't provide a way to list all keys
   * This method returns an empty array as a placeholder
   * In a real implementation, you might want to maintain a separate list of keys
   * @returns A Promise that resolves to an empty array (limitation of react-native-keychain)
   */
  async getAllKeys(): Promise<string[]> {
    // react-native-keychain doesn't support listing all keys
    // This is a limitation of the underlying keychain APIs
    // In a production app, you might maintain a separate list of keys in AsyncStorage
    return [];
  }
}
