import { Entity } from '../shared/Entity';
import { DepartmentNameRequiredError } from '../errors/DepartmentNameRequiredError';

/**
 * Department Entity
 * Represents a department in the organization
 */
export class Department extends Entity<Department> {
  private readonly _name: string;
  private readonly _managerId: string | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor (
    id: string,
    name: string,
    managerId: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id);
    this._name = name;
    this._managerId = managerId;
    this._createdAt = new Date(createdAt);
    this._updatedAt = new Date(updatedAt);
  }

  /**
   * Factory method to create a new Department
   * @param props - Department properties
   * @returns A new Department instance
   * @throws DepartmentNameRequiredError if name is empty
   */
  static create (props: {
    id: string;
    name: string;
    managerId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Department {
    if (!props.name || props.name.trim().length === 0) {
      throw new DepartmentNameRequiredError();
    }

    const now = new Date();
    const createdAt = props.createdAt || now;
    const updatedAt = props.updatedAt || now;

    return new Department(
      props.id,
      props.name.trim(),
      props.managerId || null,
      createdAt,
      updatedAt,
    );
  }

  get name (): string {
    return this._name;
  }

  get managerId (): string | null {
    return this._managerId;
  }

  get createdAt (): Date {
    return new Date(this._createdAt);
  }

  get updatedAt (): Date {
    return new Date(this._updatedAt);
  }
}
