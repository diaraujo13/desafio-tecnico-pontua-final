import { UserRepositoryImpl } from '../../../../src/infrastructure/repositories/UserRepositoryImpl';
import { ApiClient } from '../../../../src/infrastructure/api/client';
import { UserRole } from '../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../src/domain/enums/UserStatus';

describe('UserRepositoryImpl', () => {
  let apiClient: jest.Mocked<ApiClient>;
  let repository: UserRepositoryImpl;

  beforeEach(() => {
    apiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      setAuthToken: jest.fn(),
      clearAuthToken: jest.fn(),
    } as unknown as jest.Mocked<ApiClient>;

    repository = new UserRepositoryImpl(apiClient);
  });

  const baseUserResponse = {
    id: 'user-1',
    registrationNumber: '12345',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.COLLABORATOR,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
    managerId: 'manager-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  describe('findById', () => {
    it('should return user when found', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue(baseUserResponse);

      const result = await repository.findById('user-1');

      expect(result.isSuccess).toBe(true);
      const user = result.getValue();
      expect(user.id).toBe('user-1');
      expect(user.email.value).toBe('test@example.com');
      expect(apiClient.get).toHaveBeenCalledWith('/users/user-1');
    });

    it('should return error when user is not found (404)', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('HTTP error! status: 404'));

      const result = await repository.findById('non-existent');

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toBe('User not found');
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue(baseUserResponse);

      const result = await repository.findByEmail('test@example.com');

      expect(result.isSuccess).toBe(true);
      expect(apiClient.get).toHaveBeenCalledWith('/users?email=test%40example.com');
    });

    it('should return error when user is not found by email (404)', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('HTTP error! status: 404'));

      const result = await repository.findByEmail('missing@example.com');

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toBe('User not found');
    });
  });

  describe('findByDepartmentId', () => {
    it('should return users in department', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue([baseUserResponse]);

      const result = await repository.findByDepartmentId('dept-1');

      expect(result.isSuccess).toBe(true);
      const users = result.getValue();
      expect(users).toHaveLength(1);
      expect(apiClient.get).toHaveBeenCalledWith('/users?departmentId=dept-1');
    });
  });

  describe('findByManagerId', () => {
    it('should return users managed by manager', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue([baseUserResponse]);

      const result = await repository.findByManagerId('manager-1');

      expect(result.isSuccess).toBe(true);
      const users = result.getValue();
      expect(users).toHaveLength(1);
      expect(apiClient.get).toHaveBeenCalledWith('/users?managerId=manager-1');
    });
  });
});
