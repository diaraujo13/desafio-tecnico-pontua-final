import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { Result } from '../../../domain/shared/Result';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';

/**
 * LogoutUseCase
 *
 * Responsável por encerrar a sessão do usuário:
 * - Chama IAuthRepository.logout() para limpar token/sessão (infra cuida do detalhe)
 * - Retorna Result<void> indicando sucesso/falha
 */
export class LogoutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<Result<void>> {
    try {
      await this.authRepository.logout();
      return Result.ok();
    } catch (error) {
      if (error instanceof DomainError) {
        return Result.fail(error);
      }

      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      return Result.fail(new UnexpectedDomainError(errorMessage));
    }
  }
}
