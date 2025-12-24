import { Department } from '../../../../src/domain/entities/Department';
import { DepartmentNameRequiredError } from '../../../../src/domain/errors/DepartmentNameRequiredError';

describe('Department', () => {
  const validProps = {
    id: 'dept-1',
    name: 'Engineering',
  };

  describe('create', () => {
    it('should create a valid department', () => {
      const department = Department.create(validProps);

      expect(department.id).toBe('dept-1');
      expect(department.name).toBe('Engineering');
      expect(department.managerId).toBeNull();
    });

    it('should trim department name', () => {
      const department = Department.create({
        ...validProps,
        name: '  Engineering  ',
      });

      expect(department.name).toBe('Engineering');
    });

    it('should throw specific error for empty name', () => {
      expect(() => {
        Department.create({ ...validProps, name: '' });
      }).toThrow(DepartmentNameRequiredError);

      expect(() => {
        Department.create({ ...validProps, name: '   ' });
      }).toThrow(DepartmentNameRequiredError);
    });

    it('should set managerId when provided', () => {
      const department = Department.create({
        ...validProps,
        managerId: 'manager-1',
      });

      expect(department.managerId).toBe('manager-1');
    });

    it('should set managerId to null when not provided', () => {
      const department = Department.create(validProps);

      expect(department.managerId).toBeNull();
    });

    it('should set createdAt and updatedAt to current date when not provided', () => {
      const beforeCreation = new Date();
      const department = Department.create(validProps);
      const afterCreation = new Date();

      expect(department.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(department.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
      expect(department.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(department.updatedAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });

    it('should clone Date objects to prevent mutation', () => {
      const createdAt = new Date(2024, 0, 1); // January 1, 2024
      const updatedAt = new Date(2024, 0, 2); // January 2, 2024
      const department = Department.create({
        ...validProps,
        createdAt,
        updatedAt,
      });

      // Store original years
      const originalCreatedYear = department.createdAt.getFullYear();
      const originalUpdatedYear = department.updatedAt.getFullYear();

      // Mutate the original dates
      createdAt.setFullYear(2025);
      updatedAt.setFullYear(2025);

      // Entity dates should remain unchanged
      expect(department.createdAt.getFullYear()).toBe(originalCreatedYear);
      expect(department.updatedAt.getFullYear()).toBe(originalUpdatedYear);
      expect(department.createdAt.getFullYear()).not.toBe(2025);
      expect(department.updatedAt.getFullYear()).not.toBe(2025);
    });
  });

  describe('equals', () => {
    it('should return true for departments with same ID', () => {
      const dept1 = Department.create(validProps);
      const dept2 = Department.create({ ...validProps, name: 'Different Name' });

      expect(dept1.equals(dept2)).toBe(true);
    });

    it('should return false for departments with different IDs', () => {
      const dept1 = Department.create(validProps);
      const dept2 = Department.create({ ...validProps, id: 'dept-2' });

      expect(dept1.equals(dept2)).toBe(false);
    });
  });
});
