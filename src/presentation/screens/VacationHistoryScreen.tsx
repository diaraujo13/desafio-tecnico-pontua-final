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
import type { AppStackParamList } from '../navigation/types';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
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

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

interface VacationItemProps {
  vacation: VacationRequest;
}

function VacationItem({ vacation }: VacationItemProps) {
  const navigation = useNavigation<NavigationProp>();
  const period = `${formatDate(vacation.startDate)} → ${formatDate(vacation.endDate)}`;
  const statusLabel = getStatusLabel(vacation.status);

  const handlePress = () => {
    navigation.navigate('VacationDetails', { requestId: vacation.id });
  };

  return (
    <Pressable onPress={handlePress}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="label" style={styles.cardTitle}>
            {period}
          </Text>
          <Text variant="bodySmall" style={styles.cardSubtitle}>
            Status: {statusLabel}
          </Text>
          <Text variant="caption" style={styles.cardCaption}>
            Criada em: {formatDate(vacation.createdAt)}
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

  return (
    <View style={styles.container}>
      <Text variant="h2" style={styles.title}>
        Histórico de Férias
      </Text>

      {error && (
        <Text variant="caption" style={styles.errorText}>
          {error}
        </Text>
      )}

      {isEmpty && (
        <View style={styles.emptyContainer}>
          <Text variant="body">Você ainda não solicitou férias.</Text>
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 8,
  },
  emptyContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardSubtitle: {
    marginBottom: 2,
  },
  cardCaption: {
    marginTop: 4,
  },
});


