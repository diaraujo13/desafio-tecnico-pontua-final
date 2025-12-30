import { RequestVacationUseCase } from '../../../../../src/application/use-cases/vacation/RequestVacationUseCase';
import { IVacationRepository } from '../../../../../src/domain/repositories/IVacationRepository';
import { IUserRepository } from '../../../../../src/domain/repositories/IUserRepository';
import { Result } from '../../../../../src/domain/shared/Result';
import { User } from '../../../../../src/domain/entities/User';
import { UserRole } from '../../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../../src/domain/enums/UserStatus';
import { UnauthorizedError } from '../../../../../src/domain/errors/UnauthorizedError';
import { NotFoundError } from '../../../../../src/domain/errors/NotFoundError';
import { InactiveUserCannotRequestVacationError } from '../../../../../src/domain/errors/InactiveUserCannotRequestVacationError';
import { InvalidDateRangeError } from '../../../../../src/domain/errors/InvalidDateRangeError';
import type { RequestVacationDTO } from '../../../../../src/application/dtos/VacationRequestDTO';

describe('RequestVacationUseCase', () => {
  let vacationRepository: jest.Mocked<IVacationRepository>;
  let userRepository: jest.Mocked<IUserRepository>;
  let useCase: RequestVacationUseCase;

  const validDto: RequestVacationDTO = {
    requesterId: 'user-1',
    startDate: new Date('2024-06-01').toISOString(),
    endDate: new Date('2024-06-15').toISOString(),
    observation: null,
  };

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
    vacationRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByRequesterId: jest.fn(),
      findPendingByManagerId: jest.fn(),
    } as unknown as jest.Mocked<IVacationRepository>;

    userRepository = {
      findById: jest.fn(),
      findByDepartmentId: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    useCase = new RequestVacationUseCase(vacationRepository, userRepository);
  });

  describe('authorization', () => {
    it('should fail with UnauthorizedError when MANAGER tries to request vacation', async () => {
      const managerDto: RequestVacationDTO = {
        ...validDto,
        requesterId: 'manager-1',
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(activeManager));

      const result = await useCase.execute(managerDto);

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBeInstanceOf(UnauthorizedError);
      expect(result.getError().message).toContain('Apenas funcionários podem solicitar férias');
      expect(vacationRepository.save).not.toHaveBeenCalled();
    });

    it('should fail with UnauthorizedError when ADMIN tries to request vacation', async () => {
      const adminDto: RequestVacationDTO = {
        ...validDto,
        requesterId: 'admin-1',
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(activeAdmin));

      const result = await useCase.execute(adminDto);

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBeInstanceOf(UnauthorizedError);
      expect(result.getError().message).toContain('Apenas funcionários podem solicitar férias');
      expect(vacationRepository.save).not.toHaveBeenCalled();
    });

    it('should succeed when COLLABORATOR requests vacation', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(activeCollaborator));
      (vacationRepository.save as jest.Mock).mockResolvedValue(Result.ok());

      const result = await useCase.execute(validDto);

      expect(result.isSuccess).toBe(true);
      expect(vacationRepository.save).toHaveBeenCalled();
    });
  });

  describe('validation', () => {
    it('should fail when user does not exist', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(
        Result.fail(new NotFoundError('User', 'user-1')),
      );

      const result = await useCase.execute(validDto);

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBeInstanceOf(NotFoundError);
      expect(vacationRepository.save).not.toHaveBeenCalled();
    });

    it('should fail when user is inactive', async () => {
      const inactiveUser = User.create({
        id: 'user-1',
        registrationNumber: '12345',
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.COLLABORATOR,
        status: UserStatus.INACTIVE,
        departmentId: 'dept-1',
      });

      (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(inactiveUser));

      const result = await useCase.execute(validDto);

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBeInstanceOf(InactiveUserCannotRequestVacationError);
      expect(vacationRepository.save).not.toHaveBeenCalled();
    });

    it('should fail with InvalidDateRangeError when start date equals end date', async () => {
      const sameDate = new Date('2024-06-01');
      const invalidDto: RequestVacationDTO = {
        requesterId: 'user-1',
        startDate: sameDate.toISOString(),
        endDate: sameDate.toISOString(),
        observation: null,
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(activeCollaborator));

      const result = await useCase.execute(invalidDto);

      expect(result.isFailure).toBe(true);
      const error = result.getError();
      expect(error).toBeInstanceOf(InvalidDateRangeError);
      expect(error.message).toMatch(/data de início.*deve ser anterior.*data de término/i);
      expect(vacationRepository.save).not.toHaveBeenCalled();
    });

    it('should fail with InvalidDateRangeError when start date is after end date', async () => {
      const invalidDto: RequestVacationDTO = {
        requesterId: 'user-1',
        startDate: new Date('2024-06-15').toISOString(),
        endDate: new Date('2024-06-01').toISOString(),
        observation: null,
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(Result.ok(activeCollaborator));

      const result = await useCase.execute(invalidDto);

      expect(result.isFailure).toBe(true);
      const error = result.getError();
      expect(error).toBeInstanceOf(InvalidDateRangeError);
      expect(error.message).toMatch(/data de início.*deve ser anterior.*data de término/i);
      expect(vacationRepository.save).not.toHaveBeenCalled();
    });
  });
});
