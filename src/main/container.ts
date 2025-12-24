/**
 * Composition Root (Singleton)
 *
 * This module is responsible for wiring all dependencies at bootstrap time.
 * It instantiates Infrastructure implementations and injects them into Application Use Cases.
 *
 * RULES:
 * - NO React imports allowed
 * - NO React Context usage
 * - Stateless and side-effect free
 * - Dependency injection happens once at module load time
 * - Use Cases are the only Application layer boundary
 */

// Infrastructure: Repositories
import {
  AuthRepositoryInMemory,
  UserRepositoryInMemory,
  VacationRepositoryInMemory,
  DepartmentRepositoryInMemory,
} from '../infrastructure/repositories';

// Domain: Repository Interfaces
import { IAuthRepository } from '../domain/repositories/IAuthRepository';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IVacationRepository } from '../domain/repositories/IVacationRepository';
import { IDepartmentRepository } from '../domain/repositories/IDepartmentRepository';

// Application: Use Cases
import { LoginUseCase } from '../application/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '../application/use-cases/auth/LogoutUseCase';
import { RestoreSessionUseCase } from '../application/use-cases/auth/RestoreSessionUseCase';
import { RequestVacationUseCase } from '../application/use-cases/vacation/RequestVacationUseCase';
import { ApproveVacationUseCase } from '../application/use-cases/vacation/ApproveVacationUseCase';
import { RejectVacationUseCase } from '../application/use-cases/vacation/RejectVacationUseCase';
import { CancelVacationUseCase } from '../application/use-cases/vacation/CancelVacationUseCase';
import { GetVacationHistoryUseCase } from '../application/use-cases/vacation/GetVacationHistoryUseCase';
import { GetVacationDetailsUseCase } from '../application/use-cases/vacation/GetVacationDetailsUseCase';
import { GetManagerDashboardUseCase } from '../application/use-cases/vacation/GetManagerDashboardUseCase';
import { GetAllVacationsUseCase } from '../application/use-cases/vacation/GetAllVacationsUseCase';

/**
 * Repository Instances
 * Using InMemory implementations for now (can be swapped for HTTP implementations)
 */
const authRepository: IAuthRepository = new AuthRepositoryInMemory();
const userRepository: IUserRepository = new UserRepositoryInMemory();
const vacationRepository: IVacationRepository = new VacationRepositoryInMemory();
const departmentRepository: IDepartmentRepository = new DepartmentRepositoryInMemory();

/**
 * Use Case Instances
 * All dependencies are injected at module load time
 */
export const loginUseCase = new LoginUseCase(authRepository);

export const logoutUseCase = new LogoutUseCase(authRepository);

export const restoreSessionUseCase = new RestoreSessionUseCase(authRepository);

export const requestVacationUseCase = new RequestVacationUseCase(
  vacationRepository,
  userRepository,
);

export const approveVacationUseCase = new ApproveVacationUseCase(
  vacationRepository,
  userRepository,
);

export const rejectVacationUseCase = new RejectVacationUseCase(vacationRepository, userRepository);

export const cancelVacationUseCase = new CancelVacationUseCase(vacationRepository);

export const getVacationHistoryUseCase = new GetVacationHistoryUseCase(vacationRepository);

export const getVacationDetailsUseCase = new GetVacationDetailsUseCase(vacationRepository);

export const getManagerDashboardUseCase = new GetManagerDashboardUseCase(
  vacationRepository,
  userRepository,
);

export const getAllVacationsUseCase = new GetAllVacationsUseCase(
  vacationRepository,
  userRepository,
);

/**
 * Export repository instances if needed for direct access (e.g., in tests)
 * This is optional and should be used sparingly
 */
export const repositories = {
  auth: authRepository,
  user: userRepository,
  vacation: vacationRepository,
  department: departmentRepository,
} as const;
