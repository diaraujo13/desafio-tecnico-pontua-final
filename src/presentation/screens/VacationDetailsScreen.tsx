import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useVacationDetails } from '../hooks/vacations/useVacationDetails';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { VacationStatus } from '../../domain/enums/VacationStatus';
import { useTheme } from '../theme/ThemeProvider';
import type { AppStackParamList } from '../navigation/types';
import type { RouteProp } from '@react-navigation/native';

type VacationDetailsRouteProp = RouteProp<AppStackParamList, 'VacationDetails'>;

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

export function VacationDetailsScreen() {
  const route = useRoute<VacationDetailsRouteProp>();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { requestId } = route.params;
  const requesterId = user?.id ?? '';

  const { data, isLoading, error } = useVacationDetails(requestId, requesterId);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
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
  const daysRequested = Math.ceil(
    (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
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
            <Text variant="body" style={[styles.rejectionReasonText, { color: colors.error }]}>
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

      <Button
        label="Voltar"
        variant="secondary"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
  },
  errorTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  periodText: {
    marginBottom: 4,
  },
  daysText: {
    marginTop: 4,
  },
  statusText: {
    fontWeight: '600',
  },
  observationText: {
    marginTop: 4,
  },
  rejectionReasonText: {
    marginTop: 4,
    fontWeight: '500',
  },
  infoText: {
    marginBottom: 4,
  },
  backButton: {
    marginTop: 24,
  },
});

