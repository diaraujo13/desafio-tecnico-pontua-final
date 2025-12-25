import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface RejectionModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;
  /**
   * Callback when the modal should be closed
   */
  onClose: () => void;
  /**
   * Callback when rejection is confirmed with a reason
   * @param reason - The rejection reason provided by the user
   */
  onConfirm: (reason: string) => void;
  /**
   * Whether the confirmation action is in progress (loading state)
   */
  isLoading?: boolean;
}

/**
 * RejectionModal Component
 *
 * A controlled modal component for inputting a rejection reason.
 * Validates that the reason is not empty before allowing confirmation.
 */
export function RejectionModal({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}: RejectionModalProps) {
  const theme = useTheme();
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = useCallback(() => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setError('O motivo da reprovação é obrigatório');
      return;
    }

    setError(null);
    onConfirm(trimmedReason);
  }, [reason, onConfirm]);

  const handleClose = useCallback(() => {
    setReason('');
    setError(null);
    onClose();
  }, [onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        setReason('');
        setError(null);
      }, 0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      testID="RejectionModal_Modal"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.backdrop} onTouchEnd={handleClose} />
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.background,
              borderRadius: theme.borderRadius.lg,
            },
          ]}
        >
          <Text variant="h3" style={styles.title}>
            Motivo da Reprovação
          </Text>

          <Text variant="bodySmall" style={styles.description}>
            Por favor, informe o motivo da reprovação desta solicitação de férias.
          </Text>

          <Input
            label="Motivo"
            value={reason}
            onChangeText={(text) => {
              setReason(text);
              if (error) {
                setError(null);
              }
            }}
            placeholder="Digite o motivo da reprovação..."
            multiline
            numberOfLines={4}
            errorMessage={error ?? undefined}
            containerStyle={styles.inputContainer}
            testID="RejectionModal_ReasonInput"
          />

          <View style={styles.actions}>
            <Button
              label="Cancelar"
              variant="outline"
              onPress={handleClose}
              disabled={isLoading}
              style={styles.cancelButton}
              testID="RejectionModal_CancelButton"
            />
            <Button
              label="Confirmar"
              variant="primary"
              onPress={handleConfirm}
              loading={isLoading}
              disabled={isLoading || !reason.trim()}
              style={styles.confirmButton}
              testID="RejectionModal_ConfirmButton"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  container: {
    elevation: 5,
    margin: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  description: {
    marginBottom: 16,
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 4,
  },
});

