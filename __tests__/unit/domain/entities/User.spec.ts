import { User } from '../../../../src/domain/entities/User';
import { Email } from '../../../../src/domain/value-objects/Email';
import { UserRole } from '../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../src/domain/enums/UserStatus';
import { InvalidStatusTransitionError } from '../../../../src/domain/errors/InvalidStatusTransitionError';

describe('User', () => {
  const validProps = {
    id: 'user-1',
    registrationNumber: '12345',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.COLLABORATOR,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
  };

  describe('create', () => {
    it('should create a valid user', () => {
      const user = User.create(validProps);

      expect(user.id).toBe('user-1');
      expect(user.registrationNumber).toBe('12345');
      expect(user.name).toBe('John Doe');
      expect(user.email.value).toBe('john@example.com');
      expect(user.role).toBe(UserRole.COLLABORATOR);
      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(user.departmentId).toBe('dept-1');
    });

    it('should accept Email value object', () => {
      const email = Email.create('test@example.com');
      const user = User.create({ ...validProps, email });

      expect(user.email).toBeInstanceOf(Email);
      expect(user.email.value).toBe('test@example.com');
    });

    it('should accept string email and convert to Email value object', () => {
      const user = User.create({ ...validProps, email: 'test@example.com' });

      expect(user.email).toBeInstanceOf(Email);
      expect(user.email.value).toBe('test@example.com');
    });

    it('should set managerId when provided', () => {
      const user = User.create({ ...validProps, managerId: 'manager-1' });

      expect(user.managerId).toBe('manager-1');
    });

    it('should set managerId to null when not provided', () => {
      const user = User.create(validProps);

      expect(user.managerId).toBeNull();
    });

    it('should set createdAt and updatedAt to current date when not provided', () => {
      const beforeCreation = new Date();
      const user = User.create(validProps);
      const afterCreation = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(user.updatedAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });

    it('should clone Date objects to prevent mutation', () => {
      const createdAt = new Date(2024, 0, 1); // January 1, 2024
      const updatedAt = new Date(2024, 0, 2); // January 2, 2024
      const user = User.create({
        ...validProps,
        createdAt,
        updatedAt,
      });

      // Store original years
      const originalCreatedYear = user.createdAt.getFullYear();
      const originalUpdatedYear = user.updatedAt.getFullYear();

      // Mutate the original dates
      createdAt.setFullYear(2025);
      updatedAt.setFullYear(2025);

      // Entity dates should remain unchanged
      expect(user.createdAt.getFullYear()).toBe(originalCreatedYear);
      expect(user.updatedAt.getFullYear()).toBe(originalUpdatedYear);
      expect(user.createdAt.getFullYear()).not.toBe(2025);
      expect(user.updatedAt.getFullYear()).not.toBe(2025);
    });
  });

  describe('role checks', () => {
    it('should return true for isAdmin when role is ADMIN', () => {
      const user = User.create({ ...validProps, role: UserRole.ADMIN });

      expect(user.isAdmin()).toBe(true);
      expect(user.isManager()).toBe(false);
      expect(user.isCollaborator()).toBe(false);
    });

    it('should return true for isManager when role is MANAGER', () => {
      const user = User.create({ ...validProps, role: UserRole.MANAGER });

      expect(user.isManager()).toBe(true);
      expect(user.isAdmin()).toBe(false);
      expect(user.isCollaborator()).toBe(false);
    });

    it('should return true for isCollaborator when role is COLLABORATOR', () => {
      const user = User.create({ ...validProps, role: UserRole.COLLABORATOR });

      expect(user.isCollaborator()).toBe(true);
      expect(user.isAdmin()).toBe(false);
      expect(user.isManager()).toBe(false);
    });
  });

  describe('status checks', () => {
    it('should return true for isActive when status is ACTIVE', () => {
      const user = User.create({ ...validProps, status: UserStatus.ACTIVE });

      expect(user.isActive()).toBe(true);
      expect(user.canAccessSystem()).toBe(true);
    });

    it('should return false for isActive when status is INACTIVE', () => {
      const user = User.create({ ...validProps, status: UserStatus.INACTIVE });

      expect(user.isActive()).toBe(false);
      expect(user.canAccessSystem()).toBe(false);
    });

    it('should return false for canAccessSystem when status is PENDING_APPROVAL', () => {
      const user = User.create({
        ...validProps,
        status: UserStatus.PENDING_APPROVAL,
      });

      expect(user.isActive()).toBe(false);
      expect(user.canAccessSystem()).toBe(false);
    });
  });

  describe('permission checks', () => {
    describe('canRequestVacation', () => {
      it('should return true for COLLABORATOR with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.COLLABORATOR,
          status: UserStatus.ACTIVE,
        });

        expect(user.canRequestVacation()).toBe(true);
      });

      it('should return false for MANAGER even with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.MANAGER,
          status: UserStatus.ACTIVE,
        });

        expect(user.canRequestVacation()).toBe(false);
      });

      it('should return false for ADMIN even with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        });

        expect(user.canRequestVacation()).toBe(false);
      });

      it('should return false for COLLABORATOR with INACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.COLLABORATOR,
          status: UserStatus.INACTIVE,
        });

        expect(user.canRequestVacation()).toBe(false);
      });
    });

    describe('canApproveVacations', () => {
      it('should return true for MANAGER with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.MANAGER,
          status: UserStatus.ACTIVE,
        });

        expect(user.canApproveVacations()).toBe(true);
      });

      it('should return false for COLLABORATOR even with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.COLLABORATOR,
          status: UserStatus.ACTIVE,
        });

        expect(user.canApproveVacations()).toBe(false);
      });

      it('should return true for ADMIN with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        });

        expect(user.canApproveVacations()).toBe(true);
      });

      it('should return false for MANAGER with INACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.MANAGER,
          status: UserStatus.INACTIVE,
        });

        expect(user.canApproveVacations()).toBe(false);
      });
    });

    describe('canApproveUserRegistration', () => {
      it('should return true for ADMIN with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        });

        expect(user.canApproveUserRegistration()).toBe(true);
      });

      it('should return false for MANAGER even with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.MANAGER,
          status: UserStatus.ACTIVE,
        });

        expect(user.canApproveUserRegistration()).toBe(false);
      });

      it('should return false for COLLABORATOR even with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.COLLABORATOR,
          status: UserStatus.ACTIVE,
        });

        expect(user.canApproveUserRegistration()).toBe(false);
      });

      it('should return false for ADMIN with INACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.ADMIN,
          status: UserStatus.INACTIVE,
        });

        expect(user.canApproveUserRegistration()).toBe(false);
      });
    });

    describe('canRegisterUser', () => {
      it('should return true for MANAGER with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.MANAGER,
          status: UserStatus.ACTIVE,
        });

        expect(user.canRegisterUser()).toBe(true);
      });

      it('should return true for ADMIN with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        });

        expect(user.canRegisterUser()).toBe(true);
      });

      it('should return false for COLLABORATOR even with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.COLLABORATOR,
          status: UserStatus.ACTIVE,
        });

        expect(user.canRegisterUser()).toBe(false);
      });

      it('should return false for MANAGER with INACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.MANAGER,
          status: UserStatus.INACTIVE,
        });

        expect(user.canRegisterUser()).toBe(false);
      });
    });

    describe('canViewPendingRegistrations', () => {
      it('should return true for ADMIN with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        });

        expect(user.canViewPendingRegistrations()).toBe(true);
      });

      it('should return false for MANAGER even with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.MANAGER,
          status: UserStatus.ACTIVE,
        });

        expect(user.canViewPendingRegistrations()).toBe(false);
      });

      it('should return false for COLLABORATOR even with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.COLLABORATOR,
          status: UserStatus.ACTIVE,
        });

        expect(user.canViewPendingRegistrations()).toBe(false);
      });

      it('should return false for ADMIN with INACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.ADMIN,
          status: UserStatus.INACTIVE,
        });

        expect(user.canViewPendingRegistrations()).toBe(false);
      });
    });

    describe('canRejectUserRegistration', () => {
      it('should return true for ADMIN with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        });

        expect(user.canRejectUserRegistration()).toBe(true);
      });

      it('should return false for MANAGER even with ACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.MANAGER,
          status: UserStatus.ACTIVE,
        });

        expect(user.canRejectUserRegistration()).toBe(false);
      });

      it('should return false for ADMIN with INACTIVE status', () => {
        const user = User.create({
          ...validProps,
          role: UserRole.ADMIN,
          status: UserStatus.INACTIVE,
        });

        expect(user.canRejectUserRegistration()).toBe(false);
      });
    });
  });

  describe('status transitions', () => {
    describe('canTransitionTo', () => {
      it('should allow PENDING_APPROVAL to ACTIVE', () => {
        const user = User.create({
          ...validProps,
          status: UserStatus.PENDING_APPROVAL,
        });

        expect(user.canTransitionTo(UserStatus.ACTIVE)).toBe(true);
      });

      it('should allow PENDING_APPROVAL to INACTIVE', () => {
        const user = User.create({
          ...validProps,
          status: UserStatus.PENDING_APPROVAL,
        });

        expect(user.canTransitionTo(UserStatus.INACTIVE)).toBe(true);
      });

      it('should not allow PENDING_APPROVAL to PENDING_APPROVAL', () => {
        const user = User.create({
          ...validProps,
          status: UserStatus.PENDING_APPROVAL,
        });

        expect(user.canTransitionTo(UserStatus.PENDING_APPROVAL)).toBe(false);
      });

      it('should allow ACTIVE to INACTIVE', () => {
        const user = User.create({
          ...validProps,
          status: UserStatus.ACTIVE,
        });

        expect(user.canTransitionTo(UserStatus.INACTIVE)).toBe(true);
      });

      it('should allow INACTIVE to ACTIVE', () => {
        const user = User.create({
          ...validProps,
          status: UserStatus.INACTIVE,
        });

        expect(user.canTransitionTo(UserStatus.ACTIVE)).toBe(true);
      });

      it('should not allow ACTIVE to PENDING_APPROVAL', () => {
        const user = User.create({
          ...validProps,
          status: UserStatus.ACTIVE,
        });

        expect(user.canTransitionTo(UserStatus.PENDING_APPROVAL)).toBe(false);
      });
    });

    describe('transitionTo', () => {
      it('should create new user with ACTIVE status from PENDING_APPROVAL', () => {
        const pendingUser = User.create({
          ...validProps,
          status: UserStatus.PENDING_APPROVAL,
        });

        const activeUser = pendingUser.transitionTo(UserStatus.ACTIVE);

        expect(activeUser.status).toBe(UserStatus.ACTIVE);
        expect(activeUser.id).toBe(pendingUser.id);
        expect(activeUser.updatedAt.getTime()).toBeGreaterThanOrEqual(
          pendingUser.updatedAt.getTime(),
        );
      });

      it('should create new user with INACTIVE status from PENDING_APPROVAL', () => {
        const pendingUser = User.create({
          ...validProps,
          status: UserStatus.PENDING_APPROVAL,
        });

        const inactiveUser = pendingUser.transitionTo(UserStatus.INACTIVE);

        expect(inactiveUser.status).toBe(UserStatus.INACTIVE);
        expect(inactiveUser.id).toBe(pendingUser.id);
      });

      it('should throw InvalidStatusTransitionError for invalid transition', () => {
        const activeUser = User.create({
          ...validProps,
          status: UserStatus.ACTIVE,
        });

        expect(() => {
          activeUser.transitionTo(UserStatus.PENDING_APPROVAL);
        }).toThrow(InvalidStatusTransitionError);
      });
    });
  });

  describe('equals', () => {
    it('should return true for users with same ID', () => {
      const user1 = User.create(validProps);
      const user2 = User.create({ ...validProps, name: 'Different Name' });

      expect(user1.equals(user2)).toBe(true);
    });

    it('should return false for users with different IDs', () => {
      const user1 = User.create(validProps);
      const user2 = User.create({ ...validProps, id: 'user-2' });

      expect(user1.equals(user2)).toBe(false);
    });
  });
});
