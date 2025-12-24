import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';
import { Result } from '../../../domain/shared/Result';
import { DomainError } from '../../../domain/errors/DomainError';
import { UnexpectedDomainError } from '../../../domain/errors/UnexpectedDomainError';
import type { LoginDTO } from '../../dtos/LoginDTO';
import type { UserDTO } from '../../dtos/UserDTO';
import { UserMapper } from '../../mappers/UserMapper';

/**
 * LoginUseCase
 *
 * Responsibilities:
 * - Receber LoginDTO (email/password como string)
 * - Criar Value Objects (Email, Password)
 * - Delegar autenticação ao IAuthRepository
 * - Converter User (Domain) -> UserDTO
 * - Retornar Result<UserDTO>
 *
 * Não faz validação de formato de email/senha (responsabilidade dos VOs).
 */
export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(dto: LoginDTO): Promise<Result<UserDTO>> {
    try {
      const emailVO = Email.create(dto.email);
      const passwordVO = Password.create(dto.password);

      const result = await this.authRepository.login(emailVO, passwordVO);

      if (result.isFailure) {
        return Result.fail(result.getError());
      }

      const user = result.getValue();
      const userDTO = UserMapper.toDTO(user);

      return Result.ok(userDTO);
    } catch (error) {
      if (error instanceof DomainError) {
        return Result.fail(error);
      }

      return Result.fail(new UnexpectedDomainError());
    }
  }
}
