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
import { formatDateToPTBR, formatDateTimeToPTBR } from '../utils/dateFormatters';

type VacationDetailsRouteProp = RouteProp<AppStackParamList, 'VacationDetails'>;

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
      <View style={styles.centerContainer} testID="VacationDetailsScreen_LoadingContainer">
        <ActivityIndicator size="large" color={colors.primary} testID="VacationDetailsScreen_LoadingIndicator" />
        <Text variant="body" style={styles.loadingText} testID="VacationDetailsScreen_LoadingText">
          Carregando detalhes...
        </Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centerContainer} testID="VacationDetailsScreen_ErrorContainer">
        <Text variant="h3" style={styles.errorTitle} testID="VacationDetailsScreen_ErrorTitle">
          Erro ao carregar detalhes
        </Text>
        <Text variant="body" style={styles.errorText} testID="VacationDetailsScreen_ErrorText">
          {error || 'Solicitação não encontrada'}
        </Text>
        <Button
          label="Voltar"
          variant="primary"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          testID="VacationDetailsScreen_ErrorBackButton"
        />
      </View>
    );
  }

  const statusLabel = getStatusLabel(data.status);
  const daysRequested = Math.ceil(
    (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="VacationDetailsScreen_Container">
      <Card style={styles.card} testID="VacationDetailsScreen_PeriodCard">
        <Card.Content>
          <Text variant="h3" style={styles.sectionTitle} testID="VacationDetailsScreen_PeriodTitle">
            Período
          </Text>
          <Text variant="body" style={styles.periodText} testID="VacationDetailsScreen_PeriodText">
            {formatDateToPTBR(data.startDate)} → {formatDateToPTBR(data.endDate)}
          </Text>
          <Text variant="caption" style={styles.daysText} testID="VacationDetailsScreen_DaysText">
            {daysRequested} {daysRequested === 1 ? 'dia' : 'dias'} solicitados
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card} testID="VacationDetailsScreen_StatusCard">
        <Card.Content>
          <Text variant="h3" style={styles.sectionTitle} testID="VacationDetailsScreen_StatusTitle">
            Status
          </Text>
          <Text variant="body" style={styles.statusText} testID="VacationDetailsScreen_StatusText">
            {statusLabel}
          </Text>
        </Card.Content>
      </Card>

      {data.observation && (
        <Card style={styles.card} testID="VacationDetailsScreen_ObservationCard">
          <Card.Content>
            <Text variant="h3" style={styles.sectionTitle} testID="VacationDetailsScreen_ObservationTitle">
              Observação
            </Text>
            <Text variant="body" style={styles.observationText} testID="VacationDetailsScreen_ObservationText">
              {data.observation}
            </Text>
          </Card.Content>
        </Card>
      )}

      {data.status === VacationStatus.REJECTED && data.rejectionReason && (
        <Card style={styles.card} testID="VacationDetailsScreen_RejectionReasonCard">
          <Card.Content>
            <Text variant="h3" style={styles.sectionTitle} testID="VacationDetailsScreen_RejectionReasonTitle">
              Motivo da Reprovação
            </Text>
            <Text variant="body" style={[styles.rejectionReasonText, { color: colors.error }]} testID="VacationDetailsScreen_RejectionReasonText">
              {data.rejectionReason}
            </Text>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card} testID="VacationDetailsScreen_InfoCard">
        <Card.Content>
          <Text variant="h3" style={styles.sectionTitle} testID="VacationDetailsScreen_InfoTitle">
            Informações Adicionais
          </Text>
          <Text variant="caption" style={styles.infoText} testID="VacationDetailsScreen_CreatedAt">
            Criada em: {formatDateTimeToPTBR(data.createdAt)}
          </Text>
          <Text variant="caption" style={styles.infoText} testID="VacationDetailsScreen_UpdatedAt">
            Atualizada em: {formatDateTimeToPTBR(data.updatedAt)}
          </Text>
          {data.reviewedAt && (
            <Text variant="caption" style={styles.infoText} testID="VacationDetailsScreen_ReviewedAt">
              Analisada em: {formatDateTimeToPTBR(data.reviewedAt)}
            </Text>
          )}
        </Card.Content>
      </Card>

      <Button
        label="Voltar"
        variant="secondary"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        testID="VacationDetailsScreen_BackButton"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 24,
    textAlign: 'center',
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
});

