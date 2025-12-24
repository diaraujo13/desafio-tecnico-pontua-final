import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VacationDetailsScreen } from '../../../../src/presentation/screens/VacationDetailsScreen';
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

// Mock do hook useVacationDetails
const mockUseVacationDetails = jest.fn();
jest.mock('../../../../src/presentation/hooks/vacations/useVacationDetails', () => ({
  useVacationDetails: (requestId: string, requesterId: string) =>
    mockUseVacationDetails(requestId, requesterId),
}));

const Stack = createNativeStackNavigator();

describe('VacationDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  const renderWithNavigation = () => {
    return render(
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="VacationDetails"
              component={VacationDetailsScreen}
              initialParams={{ requestId: 'vac-1' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    );
  };

  it('should render approved vacation details correctly', async () => {
    mockUseVacationDetails.mockReturnValue({
      data: mockVacation,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByText('Período')).toBeTruthy();
      expect(screen.getByText(/11 dias solicitados/)).toBeTruthy();
      expect(screen.getByText('Aprovada')).toBeTruthy();
    });
  });

  it('should render rejected vacation with reason', async () => {
    const rejectedVacation = createMockVacation({
      status: VacationStatus.REJECTED,
      rejectionReason: 'Período solicitado já possui outras solicitações aprovadas',
    });

    mockUseVacationDetails.mockReturnValue({
      data: rejectedVacation,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByText('Motivo da Reprovação')).toBeTruthy();
      expect(screen.getByText('Período solicitado já possui outras solicitações aprovadas')).toBeTruthy();
    });
  });

  it('should show loading state', () => {
    mockUseVacationDetails.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    renderWithNavigation();

    expect(screen.getByText('Carregando detalhes...')).toBeTruthy();
  });

    it('should show error state with message', async () => {
    mockUseVacationDetails.mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Vacation request not found',
      refetch: jest.fn(),
    });

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar detalhes')).toBeTruthy();
      expect(screen.getByText('Vacation request not found')).toBeTruthy();
      });
    });

  it('should display vacation observation when present', async () => {
    mockUseVacationDetails.mockReturnValue({
      data: mockVacation,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByText('Observação')).toBeTruthy();
      expect(screen.getByText('Férias de verão')).toBeTruthy();
    });
  });

  it('should not display observation section when null', async () => {
    const vacationWithoutObservation = createMockVacation({
      observation: null,
    });

    mockUseVacationDetails.mockReturnValue({
      data: vacationWithoutObservation,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByText('Período')).toBeTruthy();
    });

    expect(screen.queryByText('Observação')).toBeNull();
  });

  it('should display rejection reason only for rejected vacations', async () => {
    const rejectedVacation = createMockVacation({
      status: VacationStatus.REJECTED,
      rejectionReason: 'Conflito com projeto urgente',
    });

    mockUseVacationDetails.mockReturnValue({
      data: rejectedVacation,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithNavigation();

    await waitFor(() => {
      expect(screen.getByText('Motivo da Reprovação')).toBeTruthy();
      expect(screen.getByText('Conflito com projeto urgente')).toBeTruthy();
    });
  });

  it('should calculate and display correct number of days', async () => {
    mockUseVacationDetails.mockReturnValue({
      data: mockVacation,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithNavigation();

    await waitFor(() => {
      // 10 dias de diferença + 1 = 11 dias
      expect(screen.getByText(/11 dias solicitados/)).toBeTruthy();
    });
  });

  it('should handle navigation back when error occurs', async () => {
    mockUseVacationDetails.mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Not found',
      refetch: jest.fn(),
    });

    const { getByText } = renderWithNavigation();

    await waitFor(() => {
      expect(getByText('Voltar')).toBeTruthy();
    });

    // Just verify the button exists - actual navigation is handled by React Navigation
    const backButton = getByText('Voltar');
    expect(backButton).toBeTruthy();
  });
});
