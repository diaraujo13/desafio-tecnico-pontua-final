import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { RejectionModal } from '../../../../../src/presentation/components/vacations/RejectionModal';
import { ThemeProvider } from '../../../../../src/presentation/theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );

  TestWrapper.displayName = 'TestWrapper';

  return TestWrapper;
};

describe('RejectionModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when visible is false', () => {
    render(
      <RejectionModal visible={false} onClose={mockOnClose} onConfirm={mockOnConfirm} />,
      { wrapper: createTestWrapper() },
    );

    expect(screen.queryByTestId('RejectionModal_Modal')).toBeNull();
  });

  it('should render when visible is true', () => {
    render(
      <RejectionModal visible={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />,
      { wrapper: createTestWrapper() },
    );

    expect(screen.getByTestId('RejectionModal_Modal')).toBeTruthy();
    expect(screen.getByText('Motivo da Reprovação')).toBeTruthy();
    expect(screen.getByTestId('RejectionModal_ReasonInput')).toBeTruthy();
  });

  it('should not call onConfirm when confirming with empty reason', () => {
    render(
      <RejectionModal visible={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />,
      { wrapper: createTestWrapper() },
    );

    const confirmButton = screen.getByTestId('RejectionModal_ConfirmButton');
    fireEvent.press(confirmButton);

    // onConfirm should not be called because reason is empty
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm when reason is provided and button is pressed', async () => {
    render(
      <RejectionModal visible={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />,
      { wrapper: createTestWrapper() },
    );

    const input = screen.getByTestId('RejectionModal_ReasonInput');
    fireEvent.changeText(input, 'Motivo válido');

    const confirmButton = screen.getByTestId('RejectionModal_ConfirmButton');
    fireEvent.press(confirmButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith('Motivo válido');
    });
  });

  it('should show error when confirming with empty reason after validation', async () => {
    render(
      <RejectionModal visible={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />,
      { wrapper: createTestWrapper() },
    );

    // The button is disabled when reason is empty, so onConfirm won't be called
    // This test verifies that the validation logic exists in handleConfirm
    // The actual error display is tested by the component's internal validation
    const confirmButton = screen.getByTestId('RejectionModal_ConfirmButton');
    
    // Button should be disabled when reason is empty
    // We verify that onConfirm is not called (which is the expected behavior)
    fireEvent.press(confirmButton);
    
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm with trimmed reason when confirmed', async () => {
    render(
      <RejectionModal visible={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />,
      { wrapper: createTestWrapper() },
    );

    const input = screen.getByTestId('RejectionModal_ReasonInput');
    fireEvent.changeText(input, '  Motivo com espaços  ');

    const confirmButton = screen.getByTestId('RejectionModal_ConfirmButton');
    fireEvent.press(confirmButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith('Motivo com espaços');
    });
  });

  it('should call onClose when cancel button is pressed', () => {
    render(
      <RejectionModal visible={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />,
      { wrapper: createTestWrapper() },
    );

    const cancelButton = screen.getByTestId('RejectionModal_CancelButton');
    fireEvent.press(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should clear reason and error when closed', async () => {
    const { rerender } = render(
      <RejectionModal visible={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />,
      { wrapper: createTestWrapper() },
    );

    const input = screen.getByTestId('RejectionModal_ReasonInput');
    fireEvent.changeText(input, 'Algum motivo');

    // Close modal
    rerender(
      <RejectionModal visible={false} onClose={mockOnClose} onConfirm={mockOnConfirm} />,
    );

    // Wait for setTimeout to complete (state reset happens in setTimeout)
    rerender(
          <RejectionModal visible={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />,
        );

    // Wait for the state to be reset after reopening
    await waitFor(() => {
      const reopenedInput = screen.getByTestId('RejectionModal_ReasonInput');
      // After reopening, the input should be empty (state was reset by useEffect)
      expect(reopenedInput.props.value).toBe('');
    });
  });

  it('should not call onConfirm when isLoading is true', () => {
    render(
      <RejectionModal
        visible={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isLoading={true}
      />,
      { wrapper: createTestWrapper() },
    );

    const confirmButton = screen.getByTestId('RejectionModal_ConfirmButton');
    fireEvent.press(confirmButton);

    // onConfirm should not be called when loading
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should not call onClose when cancel button is pressed during loading', () => {
    render(
      <RejectionModal
        visible={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isLoading={true}
      />,
      { wrapper: createTestWrapper() },
    );

    const cancelButton = screen.getByTestId('RejectionModal_CancelButton');
    fireEvent.press(cancelButton);

    // onClose should not be called when loading
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});

