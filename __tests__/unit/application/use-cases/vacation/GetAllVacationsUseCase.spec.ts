import { GetAllVacationsUseCase } from '../../../../../src/application/use-cases/vacation/GetAllVacationsUseCase';
import { IVacationRepository } from '../../../../../src/domain/repositories/IVacationRepository';
import { IUserRepository } from '../../../../../src/domain/repositories/IUserRepository';
import { Result } from '../../../../../src/domain/shared/Result';
import { VacationRequest } from '../../../../../src/domain/entities/VacationRequest';
import { User } from '../../../../../src/domain/entities/User';
import { UserRole } from '../../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../../src/domain/enums/UserStatus';
import { VacationStatus } from '../../../../../src/domain/enums/VacationStatus';
import { InvalidInputError } from '../../../../../src/domain/errors/InvalidInputError';
import { NotFoundError } from '../../../../../src/domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../../../src/domain/errors/UnauthorizedError';

describe('GetAllVacationsUseCase', () => {
  let vacationRepository: jest.Mocked<IVacationRepository>;
  let userRepository: jest.Mocked<IUserRepository>;
  let useCase: GetAllVacationsUseCase;

  const mockAdminUser = User.create({
    id: 'admin-1',
    registrationNumber: 'ADM001',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
    managerId: null,
  });

  const mockManagerUser = User.create({
    id: 'manager-1',
    registrationNumber: 'MGR001',
    name: 'Manager User',
    email: 'manager@example.com',
    role: UserRole.MANAGER,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
    managerId: null,
  });

  const mockCollaboratorUser = User.create({
    id: 'collab-1',
    registrationNumber: 'COL001',
    name: 'Collaborator User',
    email: 'collab@example.com',
    role: UserRole.COLLABORATOR,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
    managerId: 'manager-1',
  });

  const mockVacationRequests: VacationRequest[] = [
    VacationRequest.create({
      id: 'vacation-1',
      requesterId: 'collab-1',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-15'),
    }),
  ];

  beforeEach(() => {
    vacationRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findByRequesterId: jest.fn(),
      findPendingByManagerId: jest.fn(),
      findByRequesterIdAndStatus: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IVacationRepository>;

    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      findByDepartmentId: jest.fn(),
      findByManagerId: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    useCase = new GetAllVacationsUseCase(vacationRepository, userRepository);
  });

  it('should return all vacation requests when caller is admin', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(mockAdminUser));
    (vacationRepository.findAll as jest.Mock).mockResolvedValue(Result.ok(mockVacationRequests));

    const result = await useCase.execute('admin-1');

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual(mockVacationRequests);
    expect(userRepository.findById).toHaveBeenCalledWith('admin-1');
    expect(vacationRepository.findAll).toHaveBeenCalled();
  });

  it('should return error when callerId is empty', async () => {
    const result = await useCase.execute('');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(InvalidInputError);
    expect(result.getError().message).toContain('Caller ID is required');
    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(vacationRepository.findAll).not.toHaveBeenCalled();
  });

  it('should return error when caller is not found', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(
      Result.fail(new NotFoundError('User', 'non-existent')),
    );

    const result = await useCase.execute('non-existent');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(NotFoundError);
    expect(vacationRepository.findAll).not.toHaveBeenCalled();
  });

  it('should return unauthorized error when caller is manager (not admin)', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(mockManagerUser));

    const result = await useCase.execute('manager-1');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(UnauthorizedError);
    expect(result.getError().message).toContain('Only administrators');
    expect(vacationRepository.findAll).not.toHaveBeenCalled();
  });

  it('should return unauthorized error when caller is collaborator (not admin)', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(mockCollaboratorUser));

    const result = await useCase.execute('collab-1');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(UnauthorizedError);
    expect(result.getError().message).toContain('Only administrators');
    expect(vacationRepository.findAll).not.toHaveBeenCalled();
  });

  it('should apply filters when provided', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(mockAdminUser));
    (vacationRepository.findAll as jest.Mock).mockResolvedValue(Result.ok(mockVacationRequests));

    const filters = {
      status: VacationStatus.PENDING_APPROVAL,
    };

    const result = await useCase.execute('admin-1', filters);

    expect(result.isSuccess).toBe(true);
    expect(vacationRepository.findAll).toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(mockAdminUser));
    (vacationRepository.findAll as jest.Mock).mockResolvedValue(
      Result.fail(new NotFoundError('VacationRequest')),
    );

    const result = await useCase.execute('admin-1');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(NotFoundError);
  });
});

