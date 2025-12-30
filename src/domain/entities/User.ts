import { Entity } from '../shared/Entity';
import { Email } from '../value-objects/Email';
import { UserRole } from '../enums/UserRole';
import { UserStatus } from '../enums/UserStatus';
import { InvalidStatusTransitionError } from '../errors/InvalidStatusTransitionError';

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

  canAccessUserVacationHistory(userId: string): boolean {
    return this.isManager() || (this.isAdmin() && this.isActive() && this.id === userId);
  }

  /**
   * Checks if the user can access the system
   * @returns true if user is active and approved, false otherwise
   */
  canAccessSystem(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  /**
   * Checks if the user can request vacations
   * Business Rule: Only COLLABORATOR (EMPLOYEE) can request their own vacations
   * @returns true if user is a collaborator and active, false otherwise
   */
  canRequestVacation(): boolean {
    return this.isCollaborator() && this.isActive();
  }

  /**
   * Checks if the user can approve vacation requests
   * Business Rule: Only MANAGER and ADMIN can approve vacations
   * @returns true if user is a manager or admin and active, false otherwise
   */
  canApproveVacations(): boolean {
    return (this.isManager() || this.isAdmin()) && this.isActive();
  }

  /**
   * Checks if the user can register/create new users
   * Business Rule: Only MANAGER or ADMIN can register new users
   * @returns true if user is manager or admin and active, false otherwise
   */
  canRegisterUser(): boolean {
    return (this.isManager() || this.isAdmin()) && this.isActive();
  }

  /**
   * Alias for canRegisterUser - kept for backward compatibility
   * @deprecated Use canRegisterUser() instead
   */
  canCreateUser(): boolean {
    return this.canRegisterUser();
  }

  /**
   * Checks if the user can view pending user registrations
   * Business Rule: Only ADMIN can view pending registrations
   * @returns true if user is admin and active, false otherwise
   */
  canViewPendingRegistrations(): boolean {
    return this.isAdmin() && this.isActive();
  }

  /**
   * @deprecated Use canViewPendingRegistrations() instead
   */
  canViewPendingApproval(): boolean {
    return this.canViewPendingRegistrations();
  }

  canViewVacationHistory(): boolean {
    return this.isManager() || (this.isAdmin() && this.isActive());
  }

  /**
   * Checks if the user can approve user registrations
   * Business Rule: Only ADMIN can approve newly registered users
   * @returns true if user is an admin and active, false otherwise
   */
  canApproveUserRegistration(): boolean {
    return this.isAdmin() && this.isActive();
  }

  /**
   * Checks if the user can reject user registrations
   * Business Rule: Only ADMIN can reject newly registered users
   * @returns true if user is an admin and active, false otherwise
   */
  canRejectUserRegistration(): boolean {
    return this.isAdmin() && this.isActive();
  }

  /**
   * Validates if a status transition is allowed
   * Business Rules:
   * - PENDING_APPROVAL → ACTIVE (approval)
   * - PENDING_APPROVAL → INACTIVE (rejection)
   * - ACTIVE → INACTIVE (deactivation)
   * - INACTIVE → ACTIVE (reactivation)
   * @param targetStatus - The target status for the transition
   * @returns true if transition is valid, false otherwise
   */
  canTransitionTo(targetStatus: UserStatus): boolean {
    const currentStatus = this._status;

    // PENDING_APPROVAL can only transition to ACTIVE or INACTIVE
    if (currentStatus === UserStatus.PENDING_APPROVAL) {
      return targetStatus === UserStatus.ACTIVE || targetStatus === UserStatus.INACTIVE;
    }

    // ACTIVE can transition to INACTIVE
    if (currentStatus === UserStatus.ACTIVE) {
      return targetStatus === UserStatus.INACTIVE;
    }

    // INACTIVE can transition to ACTIVE
    if (currentStatus === UserStatus.INACTIVE) {
      return targetStatus === UserStatus.ACTIVE;
    }

    return false;
  }

  /**
   * Creates a new User instance with updated status
   * Used for status transitions (approve, reject, activate, deactivate)
   * @param targetStatus - The new status
   * @returns A new User instance with the updated status
   * @throws InvalidStatusTransitionError if transition is not allowed
   */
  transitionTo(targetStatus: UserStatus): User {
    if (!this.canTransitionTo(targetStatus)) {
      throw new InvalidStatusTransitionError(
        this._status,
        targetStatus,
        `Cannot transition from ${this._status} to ${targetStatus}`,
      );
    }

    return User.create({
      id: this.id,
      registrationNumber: this._registrationNumber,
      name: this._name,
      email: this._email,
      role: this._role,
      status: targetStatus,
      departmentId: this._departmentId,
      managerId: this._managerId,
      createdAt: this._createdAt,
      updatedAt: new Date(), // Update timestamp on status change
    });
  }
}
