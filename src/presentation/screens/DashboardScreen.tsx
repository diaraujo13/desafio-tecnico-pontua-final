import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { useUserPermissions } from '../hooks/useUserPermissions';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { UserRole } from '../../domain/enums/UserRole';
import { getRoleLabel } from '../utils/roleLabels';

export function DashboardScreen() {
  const { user, logout, isAuthLoading } = useAuth();
  const { permissions } = useUserPermissions(user?.id || null);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

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

  const handleCreateUser = useCallback(() => {
    navigation.navigate('CreateUser');
  }, [navigation]);

  const handleApproveUsers = useCallback(() => {
    navigation.navigate('ApproveUsers');
  }, [navigation]);

  return (
    <View style={styles.container} testID="DashboardScreen_Container">
      <Text variant="h2" style={styles.title}>
        Olá, {user?.name ?? 'colaborador'}
      </Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        Perfil: {getRoleLabel(user?.role as UserRole)}
      </Text>

      {permissions.canRequestVacation && (
        <Button
          label="Solicitar férias"
          variant="primary"
          onPress={handleRequestVacation}
          style={styles.requestVacationButton}
          testID="DashboardScreen_RequestVacationButton"
        />
      )}
      <Button
        label="Ver histórico"
        variant="secondary"
        onPress={handleViewHistory}
        style={styles.historyButton}
        testID="DashboardScreen_ViewHistoryButton"
      />
      {permissions.canApproveVacations && (
        <Button
          label="Ver pendências"
          variant="secondary"
          onPress={handleViewPending}
          style={styles.pendingButton}
          testID="DashboardScreen_ViewPendingButton"
        />
      )}

      {permissions.canCreateUser && (
        <Button
          label="Criar usuário"
          variant="secondary"
          onPress={handleCreateUser}
          style={styles.createUserButton}
          testID="DashboardScreen_CreateUserButton"
        />
      )}
      {permissions.canViewPendingRegistrations && (
        <Button
          label="Aprovar usuários"
          variant="secondary"
          onPress={handleApproveUsers}
          style={styles.approveUsersButton}
          testID="DashboardScreen_ApproveUsersButton"
        />
      )}
      <Button
        label="Sair"
        variant="outline"
        onPress={handleLogout}
        loading={isAuthLoading}
        style={styles.logoutButton}
        testID="DashboardScreen_LogoutButton"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  approveUsersButton: {
    marginTop: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  createUserButton: {
    marginTop: 16,
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
