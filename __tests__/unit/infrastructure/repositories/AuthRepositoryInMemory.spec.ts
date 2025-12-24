import { AuthRepositoryInMemory } from '../../../../src/infrastructure/repositories/AuthRepositoryInMemory';
import { Email } from '../../../../src/domain/value-objects/Email';
import { Password } from '../../../../src/domain/value-objects/Password';

describe('AuthRepositoryInMemory', () => {
  let repository: AuthRepositoryInMemory;

  beforeEach(() => {
    repository = new AuthRepositoryInMemory();
  });

  describe('login', () => {
    it('should return user with valid credentials', async () => {
      const email = Email.create('joao@empresa.com');
      const password = Password.create('Senha@123');

      const result = await repository.login(email, password);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const user = result.getValue();
        expect(user.email.value).toBe('joao@empresa.com');
        expect(user.name).toBe('João Silva');
      }
    });

    it('should fail with invalid email', async () => {
      const email = Email.create('invalid@empresa.com');
      const password = Password.create('Senha@123');

      const result = await repository.login(email, password);

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.getError().message).toBe('Invalid credentials');
      }
    });

    it('should fail with invalid password', async () => {
      const email = Email.create('joao@empresa.com');
      const password = Password.create('WrongPassword@123');

      const result = await repository.login(email, password);

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.getError().message).toBe('Invalid credentials');
      }
    });

    it('should simulate network delay', async () => {
      const email = Email.create('joao@empresa.com');
      const password = Password.create('Senha@123');

      const start = Date.now();
      await repository.login(email, password);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(750);
      expect(elapsed).toBeLessThan(1000);
    });
  });

  describe('logout', () => {
    it('should complete logout successfully', async () => {
      await expect(repository.logout()).resolves.toBeUndefined();
    });

    it('should simulate network delay', async () => {
      const start = Date.now();
      await repository.logout();
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(250);
      expect(elapsed).toBeLessThan(500);
    });
  });
});
