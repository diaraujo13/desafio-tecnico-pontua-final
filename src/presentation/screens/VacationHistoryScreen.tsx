import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useVacationHistory } from '../hooks/vacations/useVacationHistory';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import type { VacationRequest } from '../../domain/entities/VacationRequest';
import { VacationStatus } from '../../domain/enums/VacationStatus';
import { UserRole } from '../../domain/enums/UserRole';
import type { AppStackParamList } from '../navigation/types';
import { formatDateToPTBR } from '../utils/dateFormatters';

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

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

interface VacationItemProps {
  vacation: VacationRequest;
}

function VacationItem({ vacation }: VacationItemProps) {
  const navigation = useNavigation<NavigationProp>();
  const period = `${formatDateToPTBR(vacation.startDate)} → ${formatDateToPTBR(vacation.endDate)}`;
  const statusLabel = getStatusLabel(vacation.status);

  const handlePress = () => {
    navigation.navigate('VacationDetails', { requestId: vacation.id });
  };

  return (
    <Pressable onPress={handlePress} testID={`VacationHistoryScreen_VacationItem_${vacation.id}`}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="label" style={styles.cardTitle} testID={`VacationHistoryScreen_VacationItem_${vacation.id}_Period`}>
            {period}
          </Text>
          <Text variant="bodySmall" style={styles.cardSubtitle} testID={`VacationHistoryScreen_VacationItem_${vacation.id}_Status`}>
            Status: {statusLabel}
          </Text>
          <Text variant="caption" style={styles.cardCaption} testID={`VacationHistoryScreen_VacationItem_${vacation.id}_CreatedAt`}>
            Criada em: {formatDateToPTBR(vacation.createdAt)}
          </Text>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

export function VacationHistoryScreen() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const { data, isLoading, error, refetch } = useVacationHistory(userId);

  const isEmpty = useMemo(() => !isLoading && data.length === 0 && !error, [data.length, error, isLoading]);

  // Get appropriate empty state message based on user role
  const getEmptyStateMessage = (): string => {
    if (!user?.role) {
      return 'Nenhuma solicitação encontrada.';
    }

    switch (user.role) {
      case UserRole.COLLABORATOR:
        return 'Você ainda não solicitou férias.';
      case UserRole.MANAGER:
        return 'Nenhuma solicitação de férias encontrada.';
      case UserRole.ADMIN:
        return 'Nenhuma solicitação de férias encontrada.';
      default:
        return 'Nenhuma solicitação encontrada.';
    }
  };

  return (
    <View style={styles.container} testID="VacationHistoryScreen_Container">
      <Text variant="h2" style={styles.title} testID="VacationHistoryScreen_Title">
        Histórico de Férias
      </Text>

      {error && (
        <Text variant="caption" style={styles.errorText} testID="VacationHistoryScreen_ErrorText">
          {error}
        </Text>
      )}

      {isEmpty && (
        <View style={styles.emptyContainer} testID="VacationHistoryScreen_EmptyState">
          <Text variant="body" testID="VacationHistoryScreen_EmptyStateMessage">{getEmptyStateMessage()}</Text>
        </View>
      )}

      {!isEmpty && (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <VacationItem vacation={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          testID="VacationHistoryScreen_VacationsList"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  cardCaption: {
    marginTop: 4,
  },
  cardSubtitle: {
    marginBottom: 2,
  },
  cardTitle: {
    marginBottom: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  errorText: {
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 16,
    paddingTop: 8,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
});


