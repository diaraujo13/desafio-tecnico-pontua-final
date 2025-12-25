import {
  usersSeed,
  departmentsSeed,
  vacationsSeed,
} from '../../../../src/infrastructure/seed/seedData';
import { UserRole } from '../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../src/domain/enums/UserStatus';
import { VacationStatus } from '../../../../src/domain/enums/VacationStatus';

describe('Seed Data', () => {
  describe('usersSeed', () => {
    it('should contain users with correct structure', () => {
      expect(usersSeed.length).toBeGreaterThan(0);

      usersSeed.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('registrationNumber');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('password');
        expect(user).toHaveProperty('role');
        expect(user).toHaveProperty('status');
        expect(user).toHaveProperty('departmentId');
        expect(user).toHaveProperty('managerId');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
      });
    });

    it('should contain at least one admin user', () => {
      const admin = usersSeed.find((u) => u.role === UserRole.ADMIN);
      expect(admin).toBeDefined();
    });

    it('should contain at least one manager user', () => {
      const manager = usersSeed.find((u) => u.role === UserRole.MANAGER);
      expect(manager).toBeDefined();
    });

    it('should contain at least one collaborator user', () => {
      const collaborator = usersSeed.find((u) => u.role === UserRole.COLLABORATOR);
      expect(collaborator).toBeDefined();
    });

    it('should have valid role values', () => {
      usersSeed.forEach((user) => {
        expect(Object.values(UserRole)).toContain(user.role);
      });
    });

    it('should have valid status values', () => {
      usersSeed.forEach((user) => {
        expect(Object.values(UserStatus)).toContain(user.status);
      });
    });
  });

  describe('departmentsSeed', () => {
    it('should contain departments with correct structure', () => {
      expect(departmentsSeed.length).toBeGreaterThan(0);

      departmentsSeed.forEach((department) => {
        expect(department).toHaveProperty('id');
        expect(department).toHaveProperty('name');
        expect(department).toHaveProperty('managerId');
        expect(department).toHaveProperty('createdAt');
        expect(department).toHaveProperty('updatedAt');
      });
    });

    it('should have non-empty department names', () => {
      departmentsSeed.forEach((department) => {
        expect(department.name.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('vacationsSeed', () => {
    it('should contain vacation requests with correct structure', () => {
      expect(vacationsSeed.length).toBeGreaterThan(0);

      vacationsSeed.forEach((vacation) => {
        expect(vacation).toHaveProperty('id');
        expect(vacation).toHaveProperty('requesterId');
        expect(vacation).toHaveProperty('reviewerId');
        expect(vacation).toHaveProperty('startDate');
        expect(vacation).toHaveProperty('endDate');
        expect(vacation).toHaveProperty('observation');
        expect(vacation).toHaveProperty('status');
        expect(vacation).toHaveProperty('createdAt');
        expect(vacation).toHaveProperty('updatedAt');
        expect(vacation).toHaveProperty('reviewedAt');
        expect(vacation).toHaveProperty('rejectionReason');
      });
    });

    it('should have valid status values', () => {
      vacationsSeed.forEach((vacation) => {
        expect(Object.values(VacationStatus)).toContain(vacation.status);
      });
    });

    it('should have startDate before endDate', () => {
      vacationsSeed.forEach((vacation) => {
        expect(vacation.startDate.getTime()).toBeLessThan(vacation.endDate.getTime());
      });
    });

    it('should contain vacations in different states', () => {
      const statuses = vacationsSeed.map((v) => v.status);
      const uniqueStatuses = new Set(statuses);
      expect(uniqueStatuses.size).toBeGreaterThan(1);
    });
  });
});
