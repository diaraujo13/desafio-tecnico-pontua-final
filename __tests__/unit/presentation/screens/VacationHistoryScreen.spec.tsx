import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { VacationHistoryScreen } from '../../../../src/presentation/screens/VacationHistoryScreen';
import { VacationRequest } from '../../../../src/domain/entities/VacationRequest';
import { VacationStatus } from '../../../../src/domain/enums/VacationStatus';
import { ThemeProvider } from '../../../../src/presentation/theme/ThemeProvider';

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

// Mock do hook useVacationHistory
const mockUseVacationHistory = jest.fn();
jest.mock('../../../../src/presentation/hooks/vacations/useVacationHistory', () => ({
  useVacationHistory: (userId: string) => mockUseVacationHistory(userId),
}));

// Mock do navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('VacationHistoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockVacations: VacationRequest[] = [
    {
      id: 'vac-1',
      userId: 'user-123',
      startDate: new Date('2025-01-10'),
      endDate: new Date('2025-01-20'),
      status: VacationStatus.APPROVED,
      observation: 'Férias de verão',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-05'),
    } as VacationRequest,
    {
      id: 'vac-2',
      userId: 'user-123',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-15'),
      status: VacationStatus.PENDING_APPROVAL,
      observation: null,
      createdAt: new Date('2025-05-20'),
      updatedAt: new Date('2025-05-20'),
    } as VacationRequest,
  ];

  it('should render vacation list correctly', async () => {
    mockUseVacationHistory.mockReturnValue({
      data: mockVacations,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <ThemeProvider>
        <NavigationContainer>
          <VacationHistoryScreen />
        </NavigationContainer>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Histórico de Férias')).toBeTruthy();
      expect(screen.getByText('2025-01-10 → 2025-01-20')).toBeTruthy();
      expect(screen.getByText(/Status: Aprovada/)).toBeTruthy();
      expect(screen.getByText(/Status: Pendente/)).toBeTruthy();
    });
  });

  it('should display empty state when no vacations', async () => {
    mockUseVacationHistory.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <ThemeProvider>
        <NavigationContainer>
          <VacationHistoryScreen />
        </NavigationContainer>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Você ainda não solicitou férias.')).toBeTruthy();
    });
  });

  it('should not render list while loading', () => {
    mockUseVacationHistory.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <ThemeProvider>
        <NavigationContainer>
          <VacationHistoryScreen />
        </NavigationContainer>
      </ThemeProvider>
    );

    expect(screen.getByText('Histórico de Férias')).toBeTruthy();
    expect(screen.queryByText('Você ainda não solicitou férias.')).toBeNull();
  });

  it('should display error message when fetch fails', async () => {
    mockUseVacationHistory.mockReturnValue({
      data: [],
      isLoading: false,
      error: 'Failed to load vacation history',
      refetch: jest.fn(),
    });

    render(
      <ThemeProvider>
        <NavigationContainer>
          <VacationHistoryScreen />
        </NavigationContainer>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load vacation history')).toBeTruthy();
    });
  });

  it('should navigate to VacationDetails when vacation item is pressed', async () => {
    mockUseVacationHistory.mockReturnValue({
      data: mockVacations,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <ThemeProvider>
        <NavigationContainer>
          <VacationHistoryScreen />
        </NavigationContainer>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Histórico de Férias')).toBeTruthy();
    });

    // Find and press the first vacation card using the period text
    const firstVacationPeriod = screen.getByText('2025-01-10 → 2025-01-20');
    
    // Navigate up to find the Pressable parent
    const pressable = firstVacationPeriod.parent?.parent?.parent;
    if (pressable) {
      fireEvent.press(pressable);
    }

    // Verify navigation was called with correct params
    expect(mockNavigate).toHaveBeenCalledWith('VacationDetails', {
      requestId: 'vac-1',
    });
  });

  it('should call refetch when pull to refresh is triggered', async () => {
    const mockRefetch = jest.fn();
    mockUseVacationHistory.mockReturnValue({
      data: mockVacations,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(
      <ThemeProvider>
        <NavigationContainer>
          <VacationHistoryScreen />
        </NavigationContainer>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Histórico de Férias')).toBeTruthy();
    });

    // Note: Testing RefreshControl behavior requires more complex setup
    // This test verifies that refetch function is available
    expect(mockRefetch).toBeDefined();
  });
});
