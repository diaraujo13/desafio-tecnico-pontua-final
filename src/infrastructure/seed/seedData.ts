import { UserRole } from '../../domain/enums/UserRole';
import { UserStatus } from '../../domain/enums/UserStatus';
import { VacationStatus } from '../../domain/enums/VacationStatus';

/**
 * Seed data for in-memory repositories
 * Provides initial data for testing and development
 */

// User seed data (raw format - will be converted to entities)
export const usersSeed = [
  {
    id: 'user-1',
    registrationNumber: 'EMP001',
    name: 'João Silva',
    email: 'joao@empresa.com',
    password: 'Senha@123', // Simulated password hash
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
    managerId: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    registrationNumber: 'EMP002',
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    password: 'Senha@123',
    role: UserRole.MANAGER,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
    managerId: 'user-1',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'user-3',
    registrationNumber: 'EMP003',
    name: 'Pedro Oliveira',
    email: 'pedro@empresa.com',
    password: 'Senha@123',
    role: UserRole.COLLABORATOR,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
    managerId: 'user-2',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: 'user-4',
    registrationNumber: 'EMP004',
    name: 'Ana Costa',
    email: 'ana@empresa.com',
    password: 'Senha@123',
    role: UserRole.COLLABORATOR,
    status: UserStatus.ACTIVE,
    departmentId: 'dept-1',
    managerId: 'user-2',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: 'user-5',
    registrationNumber: 'EMP005',
    name: 'Carlos Ferreira',
    email: 'carlos@empresa.com',
    password: 'Senha@123',
    role: UserRole.COLLABORATOR,
    status: UserStatus.PENDING_APPROVAL,
    departmentId: 'dept-2',
    managerId: null,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
] as const;

// Department seed data
export const departmentsSeed = [
  {
    id: 'dept-1',
    name: 'Engenharia',
    managerId: 'user-2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'dept-2',
    name: 'Vendas',
    managerId: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
] as const;

// Vacation requests seed data (raw format - will be converted to entities)
export const vacationsSeed = [
  {
    id: 'vacation-1',
    requesterId: 'user-3',
    reviewerId: null,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-15'),
    observation: 'Férias de verão',
    status: VacationStatus.PENDING_APPROVAL,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    reviewedAt: null,
    rejectionReason: null,
  },
  {
    id: 'vacation-2',
    requesterId: 'user-4',
    reviewerId: 'user-2',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-10'),
    observation: 'Férias familiares',
    status: VacationStatus.APPROVED,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    reviewedAt: new Date('2024-01-20'),
    rejectionReason: null,
  },
  {
    id: 'vacation-3',
    requesterId: 'user-3',
    reviewerId: 'user-2',
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-08-05'),
    observation: 'Férias curtas',
    status: VacationStatus.REJECTED,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    reviewedAt: new Date('2024-01-25'),
    rejectionReason: 'Período de alta demanda no projeto',
  },
  {
    id: 'vacation-4',
    requesterId: 'user-4',
    reviewerId: null,
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-09-10'),
    observation: null,
    status: VacationStatus.CANCELLED,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
    reviewedAt: null,
    rejectionReason: null,
  },
] as const;


