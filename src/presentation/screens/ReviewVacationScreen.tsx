import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useReviewVacationDetails } from '../hooks/vacations/useReviewVacationDetails';
import { useApproveVacation } from '../hooks/vacations/useApproveVacation';
import { useRejectVacation } from '../hooks/vacations/useRejectVacation';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RejectionModal } from '../components/vacations/RejectionModal';
import { VacationStatus } from '../../domain/enums/VacationStatus';
import { useTheme } from '../theme/ThemeProvider';
import type { AppStackParamList } from '../navigation/types';
import type { RouteProp } from '@react-navigation/native';

type ReviewVacationRouteProp = RouteProp<AppStackParamList, 'ReviewVacation'>;

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusLabel(status: VacationStatus): string {
  switch (status) {
    case VacationStatus.PENDING_APPROVAL:
      return 'Pendente';
    case VacationStatus.APPROVED:
      return 'Aprovada';
    case VacationStatus.REJECTED:
      return 'Rejeitada';
    case VacationStatus.CANCELLED:
      return 'Cancelada';
    default:
      return status;
  }
}

export function ReviewVacationScreen() {
  const route = useRoute<ReviewVacationRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user } = useAuth();
  const theme = useTheme();
  const { requestId } = route.params;

  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isLoading, error } = useReviewVacationDetails(requestId);
  const { approveVacation, isLoading: isApproving, error: approveError } = useApproveVacation();
  const { rejectVacation, isLoading: isRejecting, error: rejectError } = useRejectVacation();

  const handleApprove = useCallback(async () => {
    if (!user || !data) {
      return;
    }

    setActionError(null);
    setSuccessMessage(null);

    const result = await approveVacation({
      requestId: data.id,
      reviewerId: user.id,
    });

    if (result.isSuccess) {
      setSuccessMessage('Solicitação aprovada com sucesso.');
      // Navigate back after a short delay to show success message
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } else {
      setActionError(result.getError().message);
    }
  }, [user, data, approveVacation, navigation]);

  const handleReject = useCallback(
    async (reason: string) => {
      if (!user || !data) {
        return;
      }

      setShowRejectionModal(false);
      setActionError(null);
      setSuccessMessage(null);

      const result = await rejectVacation({
        requestId: data.id,
        reviewerId: user.id,
        reason,
      });

      if (result.isSuccess) {
        setSuccessMessage('Solicitação reprovada com sucesso.');
        // Navigate back after a short delay to show success message
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        setActionError(result.getError().message);
      }
    },
    [user, data, rejectVacation, navigation],
  );

  const handleOpenRejectionModal = useCallback(() => {
    setActionError(null);
    setShowRejectionModal(true);
  }, []);

  const handleCloseRejectionModal = useCallback(() => {
    setShowRejectionModal(false);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="body" style={styles.loadingText}>
          Carregando detalhes...
        </Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="h3" style={styles.errorTitle}>
          Erro ao carregar detalhes
        </Text>
        <Text variant="body" style={styles.errorText}>
          {error || 'Solicitação não encontrada'}
        </Text>
        <Button
          label="Voltar"
          variant="primary"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  const statusLabel = getStatusLabel(data.status);
  const daysRequested =
    Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const canReview = data.status === VacationStatus.PENDING_APPROVAL;
  const isProcessing = isApproving || isRejecting;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="h3" style={styles.sectionTitle}>
              Período
            </Text>
            <Text variant="body" style={styles.periodText}>
              {formatDate(data.startDate)} → {formatDate(data.endDate)}
            </Text>
            <Text variant="caption" style={styles.daysText}>
              {daysRequested} {daysRequested === 1 ? 'dia' : 'dias'} solicitados
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="h3" style={styles.sectionTitle}>
              Status
            </Text>
            <Text variant="body" style={styles.statusText}>
              {statusLabel}
            </Text>
          </Card.Content>
        </Card>

        {data.observation && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="h3" style={styles.sectionTitle}>
                Observação
              </Text>
              <Text variant="body" style={styles.observationText}>
                {data.observation}
              </Text>
            </Card.Content>
          </Card>
        )}

        {data.status === VacationStatus.REJECTED && data.rejectionReason && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="h3" style={styles.sectionTitle}>
                Motivo da Reprovação
              </Text>
              <Text variant="body" style={[styles.rejectionReasonText, { color: theme.colors.error }]}>
                {data.rejectionReason}
              </Text>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="h3" style={styles.sectionTitle}>
              Informações Adicionais
            </Text>
            <Text variant="caption" style={styles.infoText}>
              Criada em: {formatDateTime(data.createdAt)}
            </Text>
            <Text variant="caption" style={styles.infoText}>
              Atualizada em: {formatDateTime(data.updatedAt)}
            </Text>
            {data.reviewedAt && (
              <Text variant="caption" style={styles.infoText}>
                Analisada em: {formatDateTime(data.reviewedAt)}
              </Text>
            )}
          </Card.Content>
        </Card>

        {actionError && (
          <Text variant="caption" style={[styles.errorText, { color: theme.colors.error }]}>
            {actionError}
          </Text>
        )}

        {successMessage && (
          <Text variant="caption" style={[styles.successText, { color: theme.colors.success }]}>
            {successMessage}
          </Text>
        )}

        {canReview && (
          <View style={styles.actions}>
            <Button
              label="Aprovar"
              variant="primary"
              onPress={handleApprove}
              loading={isApproving}
              disabled={isProcessing}
              style={styles.approveButton}
              testID="ReviewVacationScreen_ApproveButton"
            />
            <Button
              label="Reprovar"
              variant="secondary"
              onPress={handleOpenRejectionModal}
              loading={isRejecting}
              disabled={isProcessing}
              style={styles.rejectButton}
              testID="ReviewVacationScreen_RejectButton"
            />
          </View>
        )}

        <Button
          label="Voltar"
          variant="outline"
          onPress={() => navigation.goBack()}
          disabled={isProcessing}
          style={styles.backButton}
        />
      </ScrollView>

      <RejectionModal
        visible={showRejectionModal}
        onClose={handleCloseRejectionModal}
        onConfirm={handleReject}
        isLoading={isRejecting}
      />
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  approveButton: {
    flex: 1,
  },
  backButton: {
    marginTop: 24,
  },
  card: {
    marginBottom: 16,
  },
  centerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  daysText: {
    marginTop: 4,
  },
  errorText: {
    marginBottom: 8,
    marginTop: 16,
  },
  errorTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    marginBottom: 4,
  },
  loadingText: {
    marginTop: 16,
  },
  observationText: {
    marginTop: 4,
  },
  periodText: {
    marginBottom: 4,
  },
  rejectButton: {
    flex: 1,
  },
  rejectionReasonText: {
    fontWeight: '500',
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  statusText: {
    fontWeight: '600',
  },
  successText: {
    marginBottom: 8,
    marginTop: 16,
  },
});

