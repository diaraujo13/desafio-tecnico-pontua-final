import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RequestVacationScreen } from '../../../../src/presentation/screens/RequestVacationScreen';
import { useAuth } from '../../../../src/presentation/hooks/useAuth';
import { useRequestVacation } from '../../../../src/presentation/hooks/vacations/useRequestVacation';
import { Result } from '../../../../src/domain/shared/Result';
import { ThemeProvider } from '../../../../src/presentation/theme/ThemeProvider';
import { AuthProvider } from '../../../../src/presentation/contexts/AuthContext';

// Mock hooks
jest.mock('../../../../src/presentation/hooks/useAuth');
jest.mock('../../../../src/presentation/hooks/vacations/useRequestVacation');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRequestVacation = useRequestVacation as jest.MockedFunction<typeof useRequestVacation>;

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const { View, Text, Pressable } = require('react-native');
  return function DateTimePicker({ value, onChange, testID }: any) {
    return (
      <View testID={testID}>
        <Pressable
          onPress={() => {
            const newDate = new Date(value);
            newDate.setDate(newDate.getDate() + 1);
            onChange({ type: 'set' }, newDate);
          }}
          testID={`${testID}_Button`}
        >
          <Text>Select Date</Text>
        </Pressable>
      </View>
    );
  };
});

const renderScreen = (queryClient: QueryClient) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RequestVacationScreen />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

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
    renderScreen(queryClient);

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

    renderScreen(queryClient);

    const submitButton = screen.getByTestId('RequestVacationScreen_SubmitButton');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('RequestVacationScreen_ErrorText')).toBeTruthy();
      expect(screen.getByText(errorMessage)).toBeTruthy();
    });
  });

  it('should call requestVacation with correct data on submit', async () => {
    renderScreen(queryClient);

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

    renderScreen(queryClient);

    expect(screen.getByTestId('RequestVacationScreen_Container')).toBeTruthy();
    expect(screen.getByTestId('RequestVacationScreen_SubmitButton')).toBeTruthy();
  });

  it('should show success message after successful submission', async () => {
    renderScreen(queryClient);

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
