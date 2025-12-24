import { LoginUseCase } from '../../../../../src/application/use-cases/auth/LoginUseCase';
import { IAuthRepository } from '../../../../../src/domain/repositories/IAuthRepository';
import { Result } from '../../../../../src/domain/shared/Result';
import { User } from '../../../../../src/domain/entities/User';
import { UserRole } from '../../../../../src/domain/enums/UserRole';
import { UserStatus } from '../../../../../src/domain/enums/UserStatus';
import { UnauthorizedError } from '../../../../../src/domain/errors/UnauthorizedError';
import type { LoginDTO } from '../../../../../src/application/dtos/LoginDTO';

describe('LoginUseCase', () => {
  let authRepository: jest.Mocked<IAuthRepository>;
  let useCase: LoginUseCase;

  const validDto: LoginDTO = {
    email: 'test@example.com',
    password: 'Test123!@#',
  };

  const domainUser = User.create({
    id: 'user-1',
    registrationNumber: '12345',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.COLLABORATOR,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
    managerId: null,
  });

  beforeEach(() => {
    authRepository = {
      login: jest.fn(),
      logout: jest.fn(),
    } as unknown as jest.Mocked<IAuthRepository>;

    useCase = new LoginUseCase(authRepository);
  });

  it('should login successfully and return UserDTO', async () => {
    (authRepository.login as jest.Mock).mockResolvedValue(Result.ok(domainUser));

    const result = await useCase.execute(validDto);

    expect(authRepository.login).toHaveBeenCalled();
    expect(result.isSuccess).toBe(true);
    const userDTO = result.getValue();
    expect(userDTO.id).toBe(domainUser.id);
    expect(userDTO.email).toBe(domainUser.email.value);
    expect(userDTO.role).toBe(domainUser.role);
  });

  it('should propagate failure from repository', async () => {
    const repoError = Result.fail(new UnauthorizedError('Invalid credentials'));
    (authRepository.login as jest.Mock).mockResolvedValue(repoError);

    const result = await useCase.execute(validDto);

    expect(result.isFailure).toBe(true);
    expect(result.getError().message).toBe('Invalid credentials');
  });

  it('should fail when Email VO throws', async () => {
    const dto: LoginDTO = { email: 'invalid-email', password: 'Test123!@#' };

    const result = await useCase.execute(dto);

    expect(result.isFailure).toBe(true);
    expect(result.getError().message).toBeDefined();
  });
});
