import { LogoutUseCase } from '../../../../../src/application/use-cases/auth/LogoutUseCase';
import { IAuthRepository } from '../../../../../src/domain/repositories/IAuthRepository';

describe('LogoutUseCase', () => {
  let authRepository: jest.Mocked<IAuthRepository>;
  let useCase: LogoutUseCase;

  beforeEach(() => {
    authRepository = {
      login: jest.fn(),
      logout: jest.fn(),
    } as unknown as jest.Mocked<IAuthRepository>;

    useCase = new LogoutUseCase(authRepository);
  });

  it('should logout successfully', async () => {
    (authRepository.logout as jest.Mock).mockResolvedValue(undefined);

    const result = await useCase.execute();

    expect(authRepository.logout).toHaveBeenCalled();
    expect(result.isSuccess).toBe(true);
  });

  it('should return failure when repository throws', async () => {
    (authRepository.logout as jest.Mock).mockRejectedValue(new Error('Logout failed'));

    const result = await useCase.execute();

    expect(result.isFailure).toBe(true);
    expect(result.getError().message).toBe('Logout failed');
  });
});
