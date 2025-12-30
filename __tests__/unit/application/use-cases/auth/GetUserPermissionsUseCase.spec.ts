import { GetUserPermissionsUseCase } from '../../../../../src/application/use-cases/auth/GetUserPermissionsUseCase';
import { IUserRepository } from '../../../../../src/domain/repositories/IUserRepository';
import { Result } from '../../../../../src/domain/shared/Result';
import { User } from '../../../../../src/domain/entities/User';
import { UserRole } from '../../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../../src/domain/enums/UserStatus';
import { NotFoundError } from '../../../../../src/domain/errors/NotFoundError';

describe('GetUserPermissionsUseCase', () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let useCase: GetUserPermissionsUseCase;

  const activeCollaborator = User.create({
    id: 'user-1',
    registrationNumber: '12345',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.COLLABORATOR,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
  });

  const activeManager = User.create({
    id: 'manager-1',
    registrationNumber: 'MGR001',
    name: 'Manager User',
    email: 'manager@example.com',
    role: UserRole.MANAGER,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
  });

  const activeAdmin = User.create({
    id: 'admin-1',
    registrationNumber: 'ADM001',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
  });

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByDepartmentId: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    useCase = new GetUserPermissionsUseCase(userRepository);
  });

  it('should return correct permissions for COLLABORATOR', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(activeCollaborator));

    const result = await useCase.execute('user-1');

    expect(result.isSuccess).toBe(true);
    const permissions = result.getValue();
    expect(permissions.canRequestVacation).toBe(true);
    expect(permissions.canApproveVacations).toBe(false);
    expect(permissions.canApproveUserRegistration).toBe(false);
    expect(permissions.canRegisterUser).toBe(false);
    expect(permissions.canViewPendingRegistrations).toBe(false);
    expect(permissions.canRejectUserRegistration).toBe(false);
  });

  it('should return correct permissions for MANAGER', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(activeManager));

    const result = await useCase.execute('manager-1');

    expect(result.isSuccess).toBe(true);
    const permissions = result.getValue();
    expect(permissions.canRequestVacation).toBe(false);
    expect(permissions.canApproveVacations).toBe(true);
    expect(permissions.canApproveUserRegistration).toBe(false);
    expect(permissions.canRegisterUser).toBe(true);
    expect(permissions.canViewPendingRegistrations).toBe(false);
    expect(permissions.canRejectUserRegistration).toBe(false);
  });

  it('should return correct permissions for ADMIN', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(activeAdmin));

    const result = await useCase.execute('admin-1');

    expect(result.isSuccess).toBe(true);
    const permissions = result.getValue();
    expect(permissions.canRequestVacation).toBe(false);
    expect(permissions.canApproveVacations).toBe(true);
    expect(permissions.canApproveUserRegistration).toBe(true);
    expect(permissions.canRegisterUser).toBe(true);
    expect(permissions.canViewPendingRegistrations).toBe(true);
    expect(permissions.canRejectUserRegistration).toBe(true);
  });

  it('should fail when user does not exist', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(
      Result.fail(new NotFoundError('User', 'user-1')),
    );

    const result = await useCase.execute('user-1');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(NotFoundError);
  });

  it('should return false for all permissions when user is inactive', async () => {
    const inactiveCollaborator = User.create({
      id: 'user-1',
      registrationNumber: '12345',
      name: 'Test User',
      email: 'test@example.com',
      role: UserRole.COLLABORATOR,
      status: UserStatus.INACTIVE,
      departmentId: 'dept-1',
    });

    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(inactiveCollaborator));

    const result = await useCase.execute('user-1');

    expect(result.isSuccess).toBe(true);
    const permissions = result.getValue();
    expect(permissions.canRequestVacation).toBe(false);
    expect(permissions.canApproveVacations).toBe(false);
    expect(permissions.canApproveUserRegistration).toBe(false);
    expect(permissions.canRegisterUser).toBe(false);
    expect(permissions.canViewPendingRegistrations).toBe(false);
    expect(permissions.canRejectUserRegistration).toBe(false);
  });
});
