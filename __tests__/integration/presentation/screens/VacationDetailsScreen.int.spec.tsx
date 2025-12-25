import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { VacationRequest } from '../../../../src/domain/entities/VacationRequest';
import { VacationStatus } from '../../../../src/domain/enums/VacationStatus';
import { ThemeProvider } from '../../../../src/presentation/theme/ThemeProvider';
import { Result } from '../../../../src/domain/shared/Result';
import { DomainError } from '../../../../src/domain/errors/DomainError';

// Mock do container - mock only the UseCase, NOT the hook
// MUST be before any imports that use the container
const mockExecuteFn = jest.fn();
jest.mock('../../../../src/main/container', () => ({
  getVacationDetailsUseCase: {
    execute: (...args: any[]) => mockExecuteFn(...args),
  },
}));

// Mock do hook useAuth
jest.mock('../../../../src/presentation/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'COLLABORATOR',
      departmentId: 'dept-1',
    },
  }),
}));

// Mock useRoute to provide route params directly
// This avoids the complexity of making NavigationContainer work with the mocked navigator
const mockUseRoute = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    // Mock useRoute to return the route params we need
    useRoute: () => mockUseRoute(),
    // Keep NavigationContainer real for other tests
    NavigationContainer: actualNav.NavigationContainer,
    // Override useNavigation to provide goBack
    useNavigation: () => ({
      goBack: jest.fn(),
      navigate: jest.fn(),
    }),
  };
});

// Import component AFTER all mocks are set up
import { VacationDetailsScreen } from '../../../../src/presentation/screens/VacationDetailsScreen';

const Stack = createNativeStackNavigator();

const renderWithNavigation = (initialParams = { requestId: 'vac-1' }) => {
  // Update mockUseRoute to return the correct params
  mockUseRoute.mockReturnValue({
    params: initialParams,
    key: `VacationDetails-${initialParams.requestId}`,
    name: 'VacationDetails',
  });
  
  return render(
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="VacationDetails"
              component={VacationDetailsScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

describe('VacationDetailsScreen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: return loading state (pending promise)
    mockExecuteFn.mockImplementation(() => new Promise(() => {})); // Never resolves = loading
    // Default: provide route params via mockUseRoute
    mockUseRoute.mockReturnValue({
      params: { requestId: 'vac-1' },
      key: 'VacationDetails-vac-1',
      name: 'VacationDetails',
    });
  });

  // Helper to create a mock vacation that matches the entity structure
  const createMockVacation = (overrides?: Partial<VacationRequest>): VacationRequest => {
    return {
      id: 'vac-1',
      userId: 'user-123',
      startDate: new Date('2025-01-10'),
      endDate: new Date('2025-01-20'),
      status: VacationStatus.APPROVED,
      observation: 'Férias de verão',
      createdAt: new Date('2025-01-01T10:00:00'),
      updatedAt: new Date('2025-01-05T14:30:00'),
      reviewedAt: new Date('2025-01-05T14:30:00'),
      reviewedBy: 'manager-1',
      rejectionReason: null,
      ...overrides,
    } as unknown as VacationRequest;
  };

  const mockVacation = createMockVacation();

  it('should render loading state', async () => {
    // UseCase returns pending promise (never resolves) = loading state
    // Hook starts with isLoading: true, so component should render loading immediately
    mockExecuteFn.mockImplementation(() => new Promise(() => {}));

    renderWithNavigation();

    // Component should render loading state immediately since hook starts with isLoading: true
    // Hook calls UseCase in useEffect, which is async, so wait for it
    await waitFor(() => {
      expect(screen.getByTestId('VacationDetailsScreen_LoadingContainer')).toBeTruthy();
    }, { timeout: 1000 });

    expect(screen.getByTestId('VacationDetailsScreen_LoadingIndicator')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_LoadingText')).toBeTruthy();
  });

  it('should render error state with message', async () => {
    const errorMessage = 'Vacation request not found';
    // UseCase returns Result.fail = error state
    mockExecuteFn.mockResolvedValue(Result.fail(new DomainError(errorMessage)));

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByTestId('VacationDetailsScreen_ErrorContainer')).toBeTruthy();
    });

    expect(screen.getByTestId('VacationDetailsScreen_ErrorTitle')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_ErrorText')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_ErrorBackButton')).toBeTruthy();
    expect(screen.getByText(errorMessage)).toBeTruthy();
  });

  it('should render approved vacation details correctly', async () => {
    // UseCase returns Result.ok = success state
    mockExecuteFn.mockResolvedValue(Result.ok(mockVacation));

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByTestId('VacationDetailsScreen_Container')).toBeTruthy();
    });

    expect(screen.getByTestId('VacationDetailsScreen_PeriodCard')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_PeriodTitle')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_PeriodText')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_DaysText')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_StatusCard')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_StatusTitle')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_StatusText')).toBeTruthy();
  });

  it('should render rejected vacation with reason', async () => {
    const rejectedVacation = createMockVacation({
      status: VacationStatus.REJECTED,
      rejectionReason: 'Período solicitado já possui outras solicitações aprovadas',
    });

    // UseCase returns Result.ok with rejected vacation
    mockExecuteFn.mockResolvedValue(Result.ok(rejectedVacation));

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByTestId('VacationDetailsScreen_RejectionReasonCard')).toBeTruthy();
    });

    expect(screen.getByTestId('VacationDetailsScreen_RejectionReasonTitle')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_RejectionReasonText')).toBeTruthy();
  });

  it('should display vacation observation when present', async () => {
    // UseCase returns Result.ok with vacation that has observation
    mockExecuteFn.mockResolvedValue(Result.ok(mockVacation));

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByTestId('VacationDetailsScreen_ObservationCard')).toBeTruthy();
    });

    expect(screen.getByTestId('VacationDetailsScreen_ObservationTitle')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_ObservationText')).toBeTruthy();
  });

  it('should not display observation section when null', async () => {
    const vacationWithoutObservation = createMockVacation({
      observation: null,
    });

    // UseCase returns Result.ok with vacation without observation
    mockExecuteFn.mockResolvedValue(Result.ok(vacationWithoutObservation));

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByTestId('VacationDetailsScreen_PeriodCard')).toBeTruthy();
    });

    expect(screen.queryByTestId('VacationDetailsScreen_ObservationCard')).toBeNull();
  });

  it('should display rejection reason only for rejected vacations', async () => {
    const rejectedVacation = createMockVacation({
      status: VacationStatus.REJECTED,
      rejectionReason: 'Conflito com projeto urgente',
    });

    // UseCase returns Result.ok with rejected vacation
    mockExecuteFn.mockResolvedValue(Result.ok(rejectedVacation));

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByTestId('VacationDetailsScreen_RejectionReasonCard')).toBeTruthy();
    });
  });

  it('should not display rejection reason for approved vacations', async () => {
    const approvedVacation = createMockVacation({
      status: VacationStatus.APPROVED,
    });

    // UseCase returns Result.ok with approved vacation
    mockExecuteFn.mockResolvedValue(Result.ok(approvedVacation));

    renderWithNavigation({ requestId: 'vac-2' });

    await waitFor(() => {
      expect(screen.getByTestId('VacationDetailsScreen_StatusCard')).toBeTruthy();
    });

    expect(screen.queryByTestId('VacationDetailsScreen_RejectionReasonCard')).toBeNull();
  });

  it('should display info card with dates', async () => {
    // UseCase returns Result.ok with vacation
    mockExecuteFn.mockResolvedValue(Result.ok(mockVacation));

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByTestId('VacationDetailsScreen_InfoCard')).toBeTruthy();
    });

    expect(screen.getByTestId('VacationDetailsScreen_InfoTitle')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_CreatedAt')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_UpdatedAt')).toBeTruthy();
    expect(screen.getByTestId('VacationDetailsScreen_ReviewedAt')).toBeTruthy();
  });

  it('should render back button', async () => {
    // UseCase returns Result.ok with vacation
    mockExecuteFn.mockResolvedValue(Result.ok(mockVacation));

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByTestId('VacationDetailsScreen_Container')).toBeTruthy();
    });

    expect(screen.getByTestId('VacationDetailsScreen_BackButton')).toBeTruthy();
  });
});
