import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { UserRole } from '../../domain/enums/UserRole';

export function DashboardScreen() {
  const { user, logout, isAuthLoading } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const isManagerOrAdmin = useMemo(() => {
    return user?.role === UserRole.MANAGER || user?.role === UserRole.ADMIN;
  }, [user?.role]);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const handleRequestVacation = useCallback(() => {
    navigation.navigate('RequestVacation');
  }, [navigation]);

  const handleViewHistory = useCallback(() => {
    navigation.navigate('VacationHistory');
  }, [navigation]);

  const handleViewPending = useCallback(() => {
    navigation.navigate('ManagerDashboard');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text variant="h2" style={styles.title}>
        Olá, {user?.name ?? 'colaborador'}
      </Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        Perfil: {user?.role ?? 'N/A'}
      </Text>

      <Button
        label="Solicitar férias"
        variant="primary"
        onPress={handleRequestVacation}
        style={styles.requestVacationButton}
      />
      <Button
        label="Ver histórico"
        variant="secondary"
        onPress={handleViewHistory}
        style={styles.historyButton}
      />
      {isManagerOrAdmin && (
        <Button
          label="Ver pendências"
          variant="secondary"
          onPress={handleViewPending}
          style={styles.pendingButton}
        />
      )}
      <Button
        label="Sair"
        variant="outline"
        onPress={handleLogout}
        loading={isAuthLoading}
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  historyButton: {
    marginTop: 16,
  },
  logoutButton: {
    marginTop: 16,
  },
  pendingButton: {
    marginTop: 16,
  },
  requestVacationButton: {
    marginTop: 24,
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
});
