import { UserRepositoryInMemory } from '../../../../src/infrastructure/repositories/UserRepositoryInMemory';
import { User } from '../../../../src/domain/entities/User';
import { UserRole } from '../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../src/domain/enums/UserStatus';
import { generateId } from '../../../../src/domain/shared/idGenerator';

describe('UserRepositoryInMemory - Persistence Regression Tests', () => {
  let repository: UserRepositoryInMemory;

  beforeEach(() => {
    // Create a fresh repository instance for each test
    repository = new UserRepositoryInMemory();
  });

  describe('create and read persistence', () => {
    it('should persist a new user and allow retrieval', async () => {
      // Create a new user
      const newUser = User.create({
        id: generateId(),
        registrationNumber: 'EMP999',
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.COLLABORATOR,
        status: UserStatus.PENDING_APPROVAL,
        departmentId: 'dept-1',
        managerId: null,
      });

      // Save the user
      const saveResult = await repository.save(newUser);
      expect(saveResult.isSuccess).toBe(true);

      // Retrieve the user by ID
      const findResult = await repository.findById(newUser.id);
      expect(findResult.isSuccess).toBe(true);
      expect(findResult.getValue().id).toBe(newUser.id);
      expect(findResult.getValue().email.value).toBe('test@example.com');
      expect(findResult.getValue().status).toBe(UserStatus.PENDING_APPROVAL);
    });

    it('should persist user updates', async () => {
      // Get an existing user from seed
      const existingUserResult = await repository.findById('user-1');
      expect(existingUserResult.isSuccess).toBe(true);

      const existingUser = existingUserResult.getValue();
      expect(existingUser.status).toBe(UserStatus.ACTIVE);

      // Update the user status
      const updatedUser = existingUser.transitionTo(UserStatus.INACTIVE);
      const saveResult = await repository.save(updatedUser);
      expect(saveResult.isSuccess).toBe(true);

      // Retrieve the user again and verify the update
      const findResult = await repository.findById('user-1');
      expect(findResult.isSuccess).toBe(true);
      expect(findResult.getValue().status).toBe(UserStatus.INACTIVE);
    });

    it('should include new users in findPendingUsers', async () => {
      // Create a new user with PENDING_APPROVAL status
      const newUser = User.create({
        id: generateId(),
        registrationNumber: 'EMP888',
        name: 'Pending User',
        email: 'pending@example.com',
        role: UserRole.COLLABORATOR,
        status: UserStatus.PENDING_APPROVAL,
        departmentId: 'dept-1',
        managerId: null,
      });

      // Save the user
      const saveResult = await repository.save(newUser);
      expect(saveResult.isSuccess).toBe(true);

      // Find all pending users
      const pendingResult = await repository.findPendingUsers();
      expect(pendingResult.isSuccess).toBe(true);

      const pendingUsers = pendingResult.getValue();
      const foundUser = pendingUsers.find((u) => u.id === newUser.id);
      expect(foundUser).toBeDefined();
      expect(foundUser?.status).toBe(UserStatus.PENDING_APPROVAL);
    });

    it('should persist multiple users independently', async () => {
      // Create first user
      const user1 = User.create({
        id: generateId(),
        registrationNumber: 'EMP777',
        name: 'User One',
        email: 'user1@example.com',
        role: UserRole.COLLABORATOR,
        status: UserStatus.ACTIVE,
        departmentId: 'dept-1',
        managerId: null,
      });

      // Create second user
      const user2 = User.create({
        id: generateId(),
        registrationNumber: 'EMP776',
        name: 'User Two',
        email: 'user2@example.com',
        role: UserRole.COLLABORATOR,
        status: UserStatus.PENDING_APPROVAL,
        departmentId: 'dept-1',
        managerId: null,
      });

      // Save both users
      const save1Result = await repository.save(user1);
      const save2Result = await repository.save(user2);
      expect(save1Result.isSuccess).toBe(true);
      expect(save2Result.isSuccess).toBe(true);

      // Verify both users exist independently
      const find1Result = await repository.findById(user1.id);
      const find2Result = await repository.findById(user2.id);

      expect(find1Result.isSuccess).toBe(true);
      expect(find2Result.isSuccess).toBe(true);
      expect(find1Result.getValue().id).toBe(user1.id);
      expect(find1Result.getValue().status).toBe(UserStatus.ACTIVE);
      expect(find2Result.getValue().id).toBe(user2.id);
      expect(find2Result.getValue().status).toBe(UserStatus.PENDING_APPROVAL);
    });
  });

  describe('data isolation between instances', () => {
    it('should maintain separate state for different repository instances', async () => {
      // Create two separate repository instances
      const repo1 = new UserRepositoryInMemory();
      const repo2 = new UserRepositoryInMemory();

      // Create a user in repo1
      const newUser = User.create({
        id: generateId(),
        registrationNumber: 'EMP666',
        name: 'Isolated User',
        email: 'isolated@example.com',
        role: UserRole.COLLABORATOR,
        status: UserStatus.ACTIVE,
        departmentId: 'dept-1',
        managerId: null,
      });

      await repo1.save(newUser);

      // User should exist in repo1
      const find1Result = await repo1.findById(newUser.id);
      expect(find1Result.isSuccess).toBe(true);

      // User should NOT exist in repo2 (separate instance)
      const find2Result = await repo2.findById(newUser.id);
      expect(find2Result.isFailure).toBe(true);
    });
  });
});
