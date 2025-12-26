import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient } from '@tanstack/react-query';
import { RequestVacationScreen } from '../../../../src/presentation/screens/RequestVacationScreen';
import { useAuth } from '../../../../src/presentation/hooks/useAuth';
import { useRequestVacation } from '../../../../src/presentation/hooks/vacations/useRequestVacation';
import { Result } from '../../../../src/domain/shared/Result';
import { renderWithProviders } from '../../../../src/helpers/render/renderWithProviders';

// Mock hooks - authentication is a mocked UI input
jest.mock('../../../../src/presentation/hooks/useAuth');
jest.mock('../../../../src/presentation/hooks/vacations/useRequestVacation');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRequestVacation = useRequestVacation as jest.MockedFunction<typeof useRequestVacation>;

describe('RequestVacationScreen Integration', () => {
  let queryClient: QueryClient;
  const mockUser = {
    id: 'user-1',
    registrationNumber: '12345',
    name: 'Test User',
    email: 'test@example.com',
    role: 'COLLABORATOR' as const,
    status: 'ACTIVE' as const,
    departmentId: 'dept-1',
    managerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRequestVacation = jest.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockRequestVacation.mockResolvedValue(Result.ok());

    mockUseRequestVacation.mockReturnValue({
      requestVacation: mockRequestVacation,
      isLoading: false,
      error: null,
      reset: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render form container and fields', () => {
    renderWithProviders(<RequestVacationScreen />, { queryClient });

    expect(screen.getByTestId('RequestVacationScreen_Container')).toBeTruthy();
    expect(screen.getByTestId('RequestVacationScreen_Title')).toBeTruthy();
    expect(screen.getByTestId('RequestVacationScreen_StartDateButton')).toBeTruthy();
    expect(screen.getByTestId('RequestVacationScreen_EndDateButton')).toBeTruthy();
    expect(screen.getByTestId('RequestVacationScreen_SubmitButton')).toBeTruthy();
  });

  it('should show error message when request fails', async () => {
    const errorMessage = 'Invalid date range';
    mockRequestVacation.mockResolvedValue(
      Result.fail({
        message: errorMessage,
        name: 'DomainError',
      } as any),
    );

    mockUseRequestVacation.mockReturnValue({
      requestVacation: mockRequestVacation,
      isLoading: false,
      error: errorMessage,
      reset: jest.fn(),
    });

    renderWithProviders(<RequestVacationScreen />, { queryClient });

    const submitButton = screen.getByTestId('RequestVacationScreen_SubmitButton');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('RequestVacationScreen_ErrorText')).toBeTruthy();
      expect(screen.getByText(errorMessage)).toBeTruthy();
    });
  });

  it('should call requestVacation with correct data on submit', async () => {
    renderWithProviders(<RequestVacationScreen />, { queryClient });

    // Open start date picker
    const startDateButton = screen.getByTestId('RequestVacationScreen_StartDateButton');
    fireEvent.press(startDateButton);

    // Select date in picker
    const startPickerButton = screen.getByTestId('RequestVacationScreen_StartDatePicker_Button');
    fireEvent.press(startPickerButton);

    // Open end date picker
    const endDateButton = screen.getByTestId('RequestVacationScreen_EndDateButton');
    fireEvent.press(endDateButton);

    // Select date in picker
    const endPickerButton = screen.getByTestId('RequestVacationScreen_EndDatePicker_Button');
    fireEvent.press(endPickerButton);

    // Submit form
    const submitButton = screen.getByTestId('RequestVacationScreen_SubmitButton');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockRequestVacation).toHaveBeenCalledWith(
        expect.objectContaining({
          requesterId: mockUser.id,
          startDate: expect.any(String),
          endDate: expect.any(String),
        }),
      );
    });
  });

  it('should show loading state when submitting', () => {
    mockUseRequestVacation.mockReturnValue({
      requestVacation: mockRequestVacation,
      isLoading: true,
      error: null,
      reset: jest.fn(),
    });

    renderWithProviders(<RequestVacationScreen />, { queryClient });

    expect(screen.getByTestId('RequestVacationScreen_Container')).toBeTruthy();
    expect(screen.getByTestId('RequestVacationScreen_SubmitButton')).toBeTruthy();
  });

  it('should show success message after successful submission', async () => {
    renderWithProviders(<RequestVacationScreen />, { queryClient });

    const submitButton = screen.getByTestId('RequestVacationScreen_SubmitButton');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockRequestVacation).toHaveBeenCalled();
    });

    // After successful submission, success message should appear
    await waitFor(() => {
      expect(screen.getByTestId('RequestVacationScreen_SuccessText')).toBeTruthy();
    });
  });
});
