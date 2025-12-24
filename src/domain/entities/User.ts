import { Entity } from '../shared/Entity';
import { Email } from '../value-objects/Email';
import { UserRole } from '../enums/UserRole';
import { UserStatus } from '../enums/UserStatus';

/**
 * User Entity
 * Represents a user in the system (Collaborator, Manager, or Admin)
 */
export class User extends Entity<User> {
  private readonly _registrationNumber: string;
  private readonly _name: string;
  private readonly _email: Email;
  private readonly _role: UserRole;
  private readonly _status: UserStatus;
  private readonly _departmentId: string;
  private readonly _managerId: string | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(
    id: string,
    registrationNumber: string,
    name: string,
    email: Email,
    role: UserRole,
    status: UserStatus,
    departmentId: string,
    managerId: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id);
    this._registrationNumber = registrationNumber;
    this._name = name;
    this._email = email;
    this._role = role;
    this._status = status;
    this._departmentId = departmentId;
    this._managerId = managerId;
    this._createdAt = new Date(createdAt);
    this._updatedAt = new Date(updatedAt);
  }

  /**
   * Factory method to create a new User
   * @param props - User properties
   * @returns A new User instance
   */
  static create(props: {
    id: string;
    registrationNumber: string;
    name: string;
    email: Email | string;
    role: UserRole;
    status: UserStatus;
    departmentId: string;
    managerId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    const email = props.email instanceof Email ? props.email : Email.create(props.email);

    const now = new Date();
    const createdAt = props.createdAt || now;
    const updatedAt = props.updatedAt || now;

    return new User(
      props.id,
      props.registrationNumber,
      props.name,
      email,
      props.role,
      props.status,
      props.departmentId,
      props.managerId || null,
      createdAt,
      updatedAt,
    );
  }

  get registrationNumber(): string {
    return this._registrationNumber;
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get role(): UserRole {
    return this._role;
  }

  get status(): UserStatus {
    return this._status;
  }

  get departmentId(): string {
    return this._departmentId;
  }

  get managerId(): string | null {
    return this._managerId;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  /**
   * Checks if the user is an admin
   * @returns true if user is admin, false otherwise
   */
  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  /**
   * Checks if the user is a manager
   * @returns true if user is manager, false otherwise
   */
  isManager(): boolean {
    return this._role === UserRole.MANAGER;
  }

  /**
   * Checks if the user is a collaborator
   * @returns true if user is collaborator, false otherwise
   */
  isCollaborator(): boolean {
    return this._role === UserRole.COLLABORATOR;
  }

  /**
   * Checks if the user is active
   * @returns true if user status is ACTIVE, false otherwise
   */
  isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  /**
   * Checks if the user can access the system
   * @returns true if user is active and approved, false otherwise
   */
  canAccessSystem(): boolean {
    return this._status === UserStatus.ACTIVE;
  }
}
