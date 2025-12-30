import { GetPendingUserRegistrationsUseCase } from '../../../../../src/application/use-cases/user/GetPendingUserRegistrationsUseCase';
import { IUserRepository } from '../../../../../src/domain/repositories/IUserRepository';
import { Result } from '../../../../../src/domain/shared/Result';
import { User } from '../../../../../src/domain/entities/User';
import { UserRole } from '../../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../../src/domain/enums/UserStatus';
import { NotFoundError } from '../../../../../src/domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../../../src/domain/errors/UnauthorizedError';

describe('GetPendingUserRegistrationsUseCase', () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let useCase: GetPendingUserRegistrationsUseCase;

  const activeAdmin = User.create({
    id: 'admin-1',
    registrationNumber: 'ADM001',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
  });

  const pendingUser1 = User.create({
    id: 'pending-1',
    registrationNumber: 'EMP006',
    name: 'Pending User 1',
    email: 'pending1@example.com',
    role: UserRole.COLLABORATOR,
    status: UserStatus.PENDING_APPROVAL,
    departmentId: 'dept-1',
  });

  const pendingUser2 = User.create({
    id: 'pending-2',
    registrationNumber: 'EMP007',
    name: 'Pending User 2',
    email: 'pending2@example.com',
    role: UserRole.MANAGER,
    status: UserStatus.PENDING_APPROVAL,
    departmentId: 'dept-2',
  });

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findPendingUsers: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    useCase = new GetPendingUserRegistrationsUseCase(userRepository);
  });

  it('should return pending users successfully', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(activeAdmin));
    (userRepository.findPendingUsers as jest.Mock).mockResolvedValue(
      Result.ok([pendingUser1, pendingUser2]),
    );

    const result = await useCase.execute('admin-1');

    expect(result.isSuccess).toBe(true);
    const userDTOs = result.getValue();
    expect(userDTOs).toHaveLength(2);
    expect(userDTOs[0].id).toBe('pending-1');
    expect(userDTOs[1].id).toBe('pending-2');
  });

  it('should return empty array when no pending users exist', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(activeAdmin));
    (userRepository.findPendingUsers as jest.Mock).mockResolvedValue(Result.ok([]));

    const result = await useCase.execute('admin-1');

    expect(result.isSuccess).toBe(true);
    const userDTOs = result.getValue();
    expect(userDTOs).toHaveLength(0);
  });

  it('should fail when caller does not exist', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(
      Result.fail(new NotFoundError('User', 'admin-1')),
    );

    const result = await useCase.execute('admin-1');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(NotFoundError);
  });

  it('should fail when caller is not admin', async () => {
    const manager = User.create({
      id: 'manager-1',
      registrationNumber: 'MGR001',
      name: 'Manager User',
      email: 'manager@example.com',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      departmentId: 'dept-1',
    });

    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(manager));

    const result = await useCase.execute('manager-1');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(UnauthorizedError);
  });
});
