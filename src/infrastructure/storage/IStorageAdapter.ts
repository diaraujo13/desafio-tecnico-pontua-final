/**
 * Interface for storage adapters
 * Defines the contract for key-value storage operations
 */
export interface IStorageAdapter {
  /**
   * Retrieves a value from storage by key
   * @param key - The storage key
   * @returns A Promise that resolves to the stored value or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Stores a value in storage with the given key
   * @param key - The storage key
   * @param value - The value to store (will be serialized)
   * @returns A Promise that resolves when the value is stored
   */
  set<T>(key: string, value: T): Promise<void>;

  /**
   * Removes a value from storage by key
   * @param key - The storage key
   * @returns A Promise that resolves when the value is removed
   */
  remove(key: string): Promise<void>;

  /**
   * Removes all values from storage
   * @returns A Promise that resolves when all values are removed
   */
  clear(): Promise<void>;

  /**
   * Gets all keys stored in storage
   * @returns A Promise that resolves to an array of all keys
   */
  getAllKeys(): Promise<string[]>;
}



