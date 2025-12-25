import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { usePendingVacations } from '../hooks/vacations/usePendingVacations';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { ListSkeleton } from '../components/ui/ListSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import type { VacationRequest } from '../../domain/entities/VacationRequest';
import { VacationStatus } from '../../domain/enums/VacationStatus';
import type { AppStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';
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

interface PendingVacationItemProps {
  vacation: VacationRequest;
}

function PendingVacationItem({ vacation }: PendingVacationItemProps) {
  const navigation = useNavigation<NavigationProp>();
  const period = `${formatDateToPTBR(vacation.startDate)} → ${formatDateToPTBR(vacation.endDate)}`;
  const statusLabel = getStatusLabel(vacation.status);

  const handlePress = () => {
    navigation.navigate('ReviewVacation', { requestId: vacation.id });
  };

  return (
    <Pressable onPress={handlePress} testID={`ManagerDashboardScreen_VacationItem_${vacation.id}`}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="label" style={styles.cardTitle} testID={`ManagerDashboardScreen_VacationItem_${vacation.id}_Period`}>
            {period}
          </Text>
          <Text variant="bodySmall" style={styles.cardSubtitle} testID={`ManagerDashboardScreen_VacationItem_${vacation.id}_Status`}>
            Status: {statusLabel}
          </Text>
          <Text variant="caption" style={styles.cardCaption} testID={`ManagerDashboardScreen_VacationItem_${vacation.id}_CreatedAt`}>
            Criada em: {formatDateToPTBR(vacation.createdAt)}
          </Text>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

export function ManagerDashboardScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const managerId = user?.id ?? '';
  const departmentId = user?.departmentId ?? '';

  const { data, isLoading, isFetching, error, refetch } = usePendingVacations(
    managerId,
    departmentId,
  );

  const isEmpty = useMemo(
    () => !isLoading && data.length === 0 && !error,
    [data.length, error, isLoading],
  );

  if (isLoading) {
    return (
      <View style={styles.container} testID="ManagerDashboardScreen_Container">
        <Text variant="h2" style={styles.title} testID="ManagerDashboardScreen_Title">
          Pendências de Aprovação
        </Text>
        <ListSkeleton count={3} testID="ManagerDashboardScreen_LoadingSkeleton" />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="ManagerDashboardScreen_Container">
      <Text variant="h2" style={styles.title} testID="ManagerDashboardScreen_Title">
        Pendências de Aprovação
      </Text>

      {error && (
        <Text variant="caption" style={[styles.errorText, { color: theme.colors.error }]} testID="ManagerDashboardScreen_ErrorText">
          {error}
        </Text>
      )}

      {isEmpty && (
        <View style={styles.emptyContainer} testID="ManagerDashboardScreen_EmptyState">
          <EmptyState
            title="Nenhuma solicitação pendente"
            description="Não há solicitações de férias aguardando sua aprovação no momento."
            testID="ManagerDashboardScreen_EmptyStateComponent"
          />
        </View>
      )}

      {!isEmpty && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PendingVacationItem vacation={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          testID="ManagerDashboardScreen_VacationsList"
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
    flex: 1,
    justifyContent: 'center',
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

