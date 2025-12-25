/**
 * Base class for all domain entities
 * Provides common functionality like ID management
 */
export abstract class Entity<T> {
  protected readonly _id: string;

  constructor(id: string) {
    if (!id || id.trim().length === 0) {
      throw new Error('Entity ID cannot be empty');
    }
    this._id = id;
  }

  /**
   * Gets the entity ID
   * @returns The entity ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Compares two entities for equality based on their ID
   * @param other - The other entity to compare
   * @returns true if entities have the same ID, false otherwise
   */
  equals(other: Entity<T>): boolean {
    if (!other) {
      return false;
    }
    return this._id === other._id;
  }
}



