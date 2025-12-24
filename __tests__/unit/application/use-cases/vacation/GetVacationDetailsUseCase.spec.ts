import { GetVacationDetailsUseCase } from '../../../../../src/application/use-cases/vacation/GetVacationDetailsUseCase';
import { IVacationRepository } from '../../../../../src/domain/repositories/IVacationRepository';
import { Result } from '../../../../../src/domain/shared/Result';
import { VacationRequest } from '../../../../../src/domain/entities/VacationRequest';
import { InvalidInputError } from '../../../../../src/domain/errors/InvalidInputError';
import { NotFoundError } from '../../../../../src/domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../../../src/domain/errors/UnauthorizedError';

describe('GetVacationDetailsUseCase', () => {
  let vacationRepository: jest.Mocked<IVacationRepository>;
  let useCase: GetVacationDetailsUseCase;

  const mockVacationRequest = VacationRequest.create({
    id: 'vacation-1',
    requesterId: 'user-1',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-15'),
    observation: 'Test observation',
  });

  beforeEach(() => {
    vacationRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findByRequesterId: jest.fn(),
      findPendingByManagerId: jest.fn(),
      findByRequesterIdAndStatus: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IVacationRepository>;

    useCase = new GetVacationDetailsUseCase(vacationRepository);
  });

  it('should return vacation request details successfully', async () => {
    (vacationRepository.findById as jest.Mock).mockResolvedValue(Result.ok(mockVacationRequest));

    const result = await useCase.execute('vacation-1', 'user-1');

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual(mockVacationRequest);
    expect(vacationRepository.findById).toHaveBeenCalledWith('vacation-1');
  });

  it('should return error when requestId is empty', async () => {
    const result = await useCase.execute('', 'user-1');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(InvalidInputError);
    expect(result.getError().message).toContain('Request ID is required');
    expect(vacationRepository.findById).not.toHaveBeenCalled();
  });

  it('should return error when requesterId is empty', async () => {
    const result = await useCase.execute('vacation-1', '');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(InvalidInputError);
    expect(result.getError().message).toContain('Requester ID is required');
    expect(vacationRepository.findById).not.toHaveBeenCalled();
  });

  it('should return error when vacation request is not found', async () => {
    (vacationRepository.findById as jest.Mock).mockResolvedValue(
      Result.fail(new NotFoundError('VacationRequest')),
    );

    const result = await useCase.execute('non-existent', 'user-1');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(NotFoundError);
  });

  it('should return unauthorized error when requesterId does not match', async () => {
    (vacationRepository.findById as jest.Mock).mockResolvedValue(Result.ok(mockVacationRequest));

    const result = await useCase.execute('vacation-1', 'user-2');

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(UnauthorizedError);
    expect(result.getError().message).toContain('not authorized');
  });
});
