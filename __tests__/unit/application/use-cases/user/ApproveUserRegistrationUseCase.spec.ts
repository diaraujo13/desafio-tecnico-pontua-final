import { ApproveUserRegistrationUseCase } from '../../../../../src/application/use-cases/user/ApproveUserRegistrationUseCase';
import { IUserRepository } from '../../../../../src/domain/repositories/IUserRepository';
import { Result } from '../../../../../src/domain/shared/Result';
import { User } from '../../../../../src/domain/entities/User';
import { UserRole } from '../../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../../src/domain/enums/UserStatus';
import { NotFoundError } from '../../../../../src/domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../../../src/domain/errors/UnauthorizedError';
import { InvalidUserStateError } from '../../../../../src/domain/errors/InvalidUserStateError';

describe('ApproveUserRegistrationUseCase', () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let useCase: ApproveUserRegistrationUseCase;

  const activeAdmin = User.create({
    id: 'admin-1',
    registrationNumber: 'ADM001',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
  });

  const pendingUser = User.create({
    id: 'pending-1',
    registrationNumber: 'EMP006',
    name: 'Pending User',
    email: 'pending@example.com',
    role: UserRole.COLLABORATOR,
    status: UserStatus.PENDING_APPROVAL,
    departmentId: 'dept-1',
  });

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    useCase = new ApproveUserRegistrationUseCase(userRepository);
  });

  it('should approve pending user registration successfully', async () => {
    (userRepository.findById as jest.Mock)
      .mockResolvedValueOnce(Result.ok(activeAdmin))
      .mockResolvedValueOnce(Result.ok(pendingUser));
    (userRepository.save as jest.Mock).mockResolvedValue(Result.ok());

    const result = await useCase.execute({
      userId: 'pending-1',
      approvedBy: 'admin-1',
    });

    expect(result.isSuccess).toBe(true);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    const savedUser = (userRepository.save as jest.Mock).mock.calls[0][0];
    expect(savedUser.status).toBe(UserStatus.ACTIVE);
  });

  it('should fail when approver does not exist', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(
      Result.fail(new NotFoundError('User', 'admin-1')),
    );

    const result = await useCase.execute({
      userId: 'pending-1',
      approvedBy: 'admin-1',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(NotFoundError);
  });

  it('should fail when approver is not admin', async () => {
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

    const result = await useCase.execute({
      userId: 'pending-1',
      approvedBy: 'manager-1',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(UnauthorizedError);
  });

  it('should fail when user to approve does not exist', async () => {
    (userRepository.findById as jest.Mock)
      .mockResolvedValueOnce(Result.ok(activeAdmin))
      .mockResolvedValueOnce(Result.fail(new NotFoundError('User', 'pending-1')));

    const result = await useCase.execute({
      userId: 'pending-1',
      approvedBy: 'admin-1',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(NotFoundError);
  });

  it('should fail when user is not in PENDING_APPROVAL status', async () => {
    const activeUser = User.create({
      id: 'active-1',
      registrationNumber: 'EMP007',
      name: 'Active User',
      email: 'active@example.com',
      role: UserRole.COLLABORATOR,
      status: UserStatus.ACTIVE,
      departmentId: 'dept-1',
    });

    (userRepository.findById as jest.Mock)
      .mockResolvedValueOnce(Result.ok(activeAdmin))
      .mockResolvedValueOnce(Result.ok(activeUser));

    const result = await useCase.execute({
      userId: 'active-1',
      approvedBy: 'admin-1',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(InvalidUserStateError);
  });
});
