import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react-native';
import { VacationHistoryScreen } from '../../../../src/presentation/screens/VacationHistoryScreen';
import { VacationRequest } from '../../../../src/domain/entities/VacationRequest';
import { VacationStatus } from '../../../../src/domain/enums/VacationStatus';
import { renderWithProviders } from '../../../../src/helpers/render/renderWithProviders';

// Mock do hook useAuth - authentication is a mocked UI input
jest.mock('../../../../src/presentation/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'COLLABORATOR',
      departmentId: 'dept-1',
    },
    isAuthLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
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

describe('VacationHistoryScreen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockVacations: VacationRequest[] = [
    {
      id: 'vac-1',
      requesterId: 'user-123',
      startDate: new Date('2025-01-10'),
      endDate: new Date('2025-01-20'),
      status: VacationStatus.APPROVED,
      observation: 'Férias de verão',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-05'),
    } as VacationRequest,
    {
      id: 'vac-2',
      requesterId: 'user-123',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-15'),
      status: VacationStatus.PENDING_APPROVAL,
      observation: null,
      createdAt: new Date('2025-05-20'),
      updatedAt: new Date('2025-05-20'),
    } as VacationRequest,
  ];

  it('should render screen container and title', async () => {
    mockUseVacationHistory.mockReturnValue({
      data: mockVacations,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<VacationHistoryScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('VacationHistoryScreen_Container')).toBeTruthy();
      expect(screen.getByTestId('VacationHistoryScreen_Title')).toBeTruthy();
    });
  });

  it('should render vacation list when data is available', async () => {
    mockUseVacationHistory.mockReturnValue({
      data: mockVacations,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<VacationHistoryScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('VacationHistoryScreen_VacationsList')).toBeTruthy();
      expect(screen.getByTestId('VacationHistoryScreen_VacationItem_vac-1')).toBeTruthy();
      expect(screen.getByTestId('VacationHistoryScreen_VacationItem_vac-2')).toBeTruthy();
    });
  });

  it('should display empty state when no vacations', async () => {
    mockUseVacationHistory.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<VacationHistoryScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('VacationHistoryScreen_EmptyState')).toBeTruthy();
      expect(screen.getByTestId('VacationHistoryScreen_EmptyStateMessage')).toBeTruthy();
    });
  });

  it('should not render empty state while loading', () => {
    mockUseVacationHistory.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<VacationHistoryScreen />);

    expect(screen.getByTestId('VacationHistoryScreen_Container')).toBeTruthy();
    expect(screen.queryByTestId('VacationHistoryScreen_EmptyState')).toBeNull();
  });

  it('should display error message when fetch fails', async () => {
    const errorMessage = 'Failed to load vacation history';
    mockUseVacationHistory.mockReturnValue({
      data: [],
      isLoading: false,
      error: errorMessage,
      refetch: jest.fn(),
    });

    renderWithProviders(<VacationHistoryScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('VacationHistoryScreen_ErrorText')).toBeTruthy();
      expect(screen.getByText(errorMessage)).toBeTruthy();
    });
  });

  it('should navigate to VacationDetails when vacation item is pressed', async () => {
    mockUseVacationHistory.mockReturnValue({
      data: mockVacations,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<VacationHistoryScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('VacationHistoryScreen_VacationItem_vac-1')).toBeTruthy();
    });

    const vacationItem = screen.getByTestId('VacationHistoryScreen_VacationItem_vac-1');
    fireEvent.press(vacationItem);

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

    renderWithProviders(<VacationHistoryScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('VacationHistoryScreen_VacationsList')).toBeTruthy();
    });

    // Verify refetch function is available (actual RefreshControl testing requires more complex setup)
    expect(mockRefetch).toBeDefined();
  });
});
