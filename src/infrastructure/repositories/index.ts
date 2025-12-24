/**
 * Barrel file for exporting in-memory repository implementations
 * Facilitates dependency injection and easy swapping between implementations
 */

export { AuthRepositoryInMemory } from './AuthRepositoryInMemory';
export { UserRepositoryInMemory } from './UserRepositoryInMemory';
export { VacationRepositoryInMemory } from './VacationRepositoryInMemory';
export { DepartmentRepositoryInMemory } from './DepartmentRepositoryInMemory';

// Also export HTTP implementations if they exist
export { AuthRepositoryImpl } from './AuthRepositoryImpl';
export { UserRepositoryImpl } from './UserRepositoryImpl';
export { VacationRepositoryImpl } from './VacationRepositoryImpl';
