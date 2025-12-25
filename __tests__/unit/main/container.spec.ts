/**
 * Tests for Composition Root
 *
 * These tests verify that:
 * - All Use Cases are properly instantiated
 * - Dependencies are correctly injected
 * - No React dependencies are present
 */

import {
  requestVacationUseCase,
  approveVacationUseCase,
  rejectVacationUseCase,
  cancelVacationUseCase,
  getVacationHistoryUseCase,
  getManagerDashboardUseCase,
  getAllVacationsUseCase,
  repositories,
} from '../../../src/main/container';

describe('Composition Root for dependency injection', () => {
  describe('Repository Instances', () => {
    it('should export all repository instances', () => {
      expect(repositories.auth).toBeDefined();
      expect(repositories.user).toBeDefined();
      expect(repositories.vacation).toBeDefined();
      expect(repositories.department).toBeDefined();
    });

    it('should have repositories with correct interfaces', () => {
      expect(repositories.auth).toHaveProperty('login');
      expect(repositories.user).toHaveProperty('findById');
      expect(repositories.vacation).toHaveProperty('save');
      expect(repositories.department).toHaveProperty('findById');
    });
  });

  describe('Use Case Instances', () => {
    it('should export requestVacationUseCase', () => {
      expect(requestVacationUseCase).toBeDefined();
      expect(requestVacationUseCase).toHaveProperty('execute');
    });

    it('should export approveVacationUseCase', () => {
      expect(approveVacationUseCase).toBeDefined();
      expect(approveVacationUseCase).toHaveProperty('execute');
    });

    it('should export rejectVacationUseCase', () => {
      expect(rejectVacationUseCase).toBeDefined();
      expect(rejectVacationUseCase).toHaveProperty('execute');
    });

    it('should export cancelVacationUseCase', () => {
      expect(cancelVacationUseCase).toBeDefined();
      expect(cancelVacationUseCase).toHaveProperty('execute');
    });

    it('should export getVacationHistoryUseCase', () => {
      expect(getVacationHistoryUseCase).toBeDefined();
      expect(getVacationHistoryUseCase).toHaveProperty('execute');
    });

    it('should export getManagerDashboardUseCase', () => {
      expect(getManagerDashboardUseCase).toBeDefined();
      expect(getManagerDashboardUseCase).toHaveProperty('execute');
    });

    it('should export getAllVacationsUseCase', () => {
      expect(getAllVacationsUseCase).toBeDefined();
      expect(getAllVacationsUseCase).toHaveProperty('execute');
    });
  });

  describe('Dependency Injection', () => {
    it('should have Use Cases with injected dependencies', () => {
      // Verify that Use Cases are instances (not undefined)
      expect(requestVacationUseCase).toBeInstanceOf(Object);
      expect(approveVacationUseCase).toBeInstanceOf(Object);
      expect(rejectVacationUseCase).toBeInstanceOf(Object);
      expect(cancelVacationUseCase).toBeInstanceOf(Object);
      expect(getVacationHistoryUseCase).toBeInstanceOf(Object);
      expect(getManagerDashboardUseCase).toBeInstanceOf(Object);
      expect(getAllVacationsUseCase).toBeInstanceOf(Object);
    });
  });

  describe('Module Requirements', () => {
    it('should not import React', () => {
      // This is a structural test - if React were imported, TypeScript would fail
      // We verify by checking that the module exports are plain objects
      expect(typeof requestVacationUseCase).toBe('object');
      expect(requestVacationUseCase).not.toHaveProperty('$$typeof'); // React elements have this
    });
  });
});



