import { ApproveVacationUseCase } from '../../../../../src/application/use-cases/vacation/ApproveVacationUseCase';
import { IVacationRepository } from '../../../../../src/domain/repositories/IVacationRepository';
import { IUserRepository } from '../../../../../src/domain/repositories/IUserRepository';
import { VacationRequest } from '../../../../../src/domain/entities/VacationRequest';
import { InvalidStatusTransitionError } from '../../../../../src/domain/errors/InvalidStatusTransitionError';

describe('ApproveVacationUseCase - DomainError propagation', () => {
  it('should propagate DomainError thrown by entity without wrapping', async () => {
    const vacationRequestMock = {
      approve: jest.fn(() => {
        throw new InvalidStatusTransitionError('Invalid transition');
      }),
    } as unknown as VacationRequest;

    const vacationRepositoryMock: IVacationRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue({
        isFailure: false,
        isSuccess: true,
        getValue: () => vacationRequestMock,
        getError: () => {
          throw new Error('Should not be called');
        },
      }),
      findByRequesterId: jest.fn(),
      findPendingByManagerId: jest.fn(),
      findByRequesterIdAndStatus: jest.fn(),
      findAll: jest.fn(),
    };

    const userRepositoryMock: IUserRepository = {
      findById: jest.fn().mockResolvedValue({
        isFailure: false,
        isSuccess: true,
        getValue: () => ({
          isManager: () => true,
          isAdmin: () => false,
        }),
        getError: () => {
          throw new Error('Should not be called');
        },
      }),
      findByEmail: jest.fn(),
      save: jest.fn(),
      findByDepartmentId: jest.fn(),
      findByManagerId: jest.fn(),
    };

    const useCase = new ApproveVacationUseCase(vacationRepositoryMock, userRepositoryMock);

    const result = await useCase.execute({
      requestId: 'req-1',
      reviewerId: 'rev-1',
    });

    expect(result.isFailure).toBe(true);
    const received = result.getError();
    expect(received).toBeInstanceOf(InvalidStatusTransitionError);
    expect(received.code).toBe('InvalidStatusTransitionError');
    expect(received.message).toContain('Invalid status transition');
  });
});
