import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { usePendingUserRegistrations } from '../hooks/usePendingUserRegistrations';
import { useApproveUserRegistration } from '../hooks/useApproveUserRegistration';
import { useRejectUserRegistration } from '../hooks/useRejectUserRegistration';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ListSkeleton } from '../components/ui/ListSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import type { UserDTO } from '../../application/dtos/UserDTO';
import { useTheme } from '../theme/ThemeProvider';
import { getRoleLabel } from '../utils/roleLabels';
import { UserRole } from '../../domain/enums/UserRole';

interface PendingUserItemProps {
  user: UserDTO;
  onApprove: (userId: string) => void;
  onReject: (userId: string, reason: string) => void;
}

function PendingUserItem({ user, onApprove, onReject }: PendingUserItemProps) {
  const theme = useTheme();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = useCallback(() => {
    Alert.alert('Aprovar Usuário', `Deseja aprovar o registro de ${user.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aprovar',
        style: 'default',
        onPress: () => onApprove(user.id),
      },
    ]);
  }, [user, onApprove]);

  const handleReject = useCallback(() => {
    if (!rejectionReason.trim()) {
      Alert.alert('Erro', 'Por favor, informe o motivo da rejeição.');
      return;
    }

    Alert.alert('Rejeitar Usuário', `Deseja rejeitar o registro de ${user.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Rejeitar',
        style: 'destructive',
        onPress: () => {
          onReject(user.id, rejectionReason);
          setShowRejectModal(false);
          setRejectionReason('');
        },
      },
    ]);
  }, [user, rejectionReason, onReject]);

  return (
    <Card style={styles.card} testID={`ApproveUsersScreen_UserItem_${user.id}`}>
      <Card.Content>
        <Text
          variant="label"
          style={styles.cardTitle}
          testID={`ApproveUsersScreen_UserItem_${user.id}_Name`}
        >
          {user.name}
        </Text>
        <Text
          variant="bodySmall"
          style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}
          testID={`ApproveUsersScreen_UserItem_${user.id}_Email`}
        >
          {user.email}
        </Text>
        <Text
          variant="caption"
          style={[styles.cardCaption, { color: theme.colors.textSecondary }]}
          testID={`ApproveUsersScreen_UserItem_${user.id}_Role`}
        >
          Perfil: {getRoleLabel(user.role as UserRole)} • Matrícula: {user.registrationNumber}
        </Text>
        <View style={styles.cardActions}>
          <Button
            label="Aprovar"
            variant="primary"
            onPress={handleApprove}
            style={styles.approveButton}
            testID={`ApproveUsersScreen_UserItem_${user.id}_ApproveButton`}
          />
          <Button
            label="Rejeitar"
            variant="outline"
            onPress={() => setShowRejectModal(true)}
            style={styles.rejectButton}
            testID={`ApproveUsersScreen_UserItem_${user.id}_RejectButton`}
          />
        </View>
      </Card.Content>

      {/* Reject Modal */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowRejectModal(false);
          setRejectionReason('');
        }}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text variant="h3" style={styles.modalTitle}>
              Motivo da Rejeição
            </Text>
            <Text
              variant="body"
              style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}
            >
              Informe o motivo para rejeitar o registro de {user.name}:
            </Text>
            <TextInput
              style={[
                styles.reasonInput,
                {
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary,
                },
              ]}
              placeholder="Digite o motivo da rejeição..."
              placeholderTextColor={theme.colors.textSecondary}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
              numberOfLines={4}
              testID={`ApproveUsersScreen_UserItem_${user.id}_RejectionReasonInput`}
            />
            <View style={styles.modalActions}>
              <Button
                label="Cancelar"
                variant="outline"
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                style={styles.modalCancelButton}
              />
              <Button
                label="Confirmar Rejeição"
                variant="primary"
                onPress={handleReject}
                style={styles.modalConfirmButton}
                testID={`ApproveUsersScreen_UserItem_${user.id}_ConfirmRejectButton`}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </Card>
  );
}

export function ApproveUsersScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const { approveUser, error: approveError } = useApproveUserRegistration();
  const { rejectUser, error: rejectError } = useRejectUserRegistration();

  const { pendingUsers, isLoading, isFetching, error, refetch } = usePendingUserRegistrations(
    user?.id || null,
  );

  const handleApprove = useCallback(
    async (userId: string) => {
      if (!user?.id) {
        return;
      }

      const result = await approveUser({
        userId,
        approvedBy: user.id,
      });

      if (result.isSuccess) {
        Alert.alert('Sucesso', 'Usuário aprovado com sucesso!');
      }
    },
    [user, approveUser],
  );

  const handleReject = useCallback(
    async (userId: string, reason: string) => {
      if (!user?.id) {
        return;
      }

      const result = await rejectUser({
        userId,
        rejectedBy: user.id,
        reason,
      });

      if (result.isSuccess) {
        Alert.alert('Sucesso', 'Usuário rejeitado com sucesso!');
      }
    },
    [user, rejectUser],
  );

  const isEmpty = useMemo(
    () => !isLoading && pendingUsers.length === 0 && !error,
    [pendingUsers.length, error, isLoading],
  );

  const displayError = approveError || rejectError || error;

  const renderItem = useCallback(
    ({ item }: { item: UserDTO }) => (
      <PendingUserItem user={item} onApprove={handleApprove} onReject={handleReject} />
    ),
    [handleApprove, handleReject],
  );

  return (
    <View style={styles.container} testID="ApproveUsersScreen_Container">
      {isLoading ? (
        <ListSkeleton count={3} testID="ApproveUsersScreen_Loading" />
      ) : isEmpty ? (
        <EmptyState
          title="Nenhum usuário pendente"
          message="Não há registros de usuários aguardando aprovação."
          testID="ApproveUsersScreen_EmptyState"
        />
      ) : (
        <>
          {displayError && (
            <View
              style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}
              testID="ApproveUsersScreen_ErrorContainer"
            >
              <Text
                variant="caption"
                style={[styles.errorText, { color: theme.colors.error }]}
                testID="ApproveUsersScreen_ErrorText"
              >
                {displayError}
              </Text>
            </View>
          )}
          <FlatList
            data={pendingUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={refetch}
                tintColor={theme.colors.primary}
              />
            }
            testID="ApproveUsersScreen_UserList"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  approveButton: {
    flex: 1,
    marginRight: 8,
  },
  card: {
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  cardCaption: {
    marginTop: 4,
  },
  cardSubtitle: {
    marginTop: 4,
  },
  cardTitle: {
    marginBottom: 4,
  },
  container: {
    flex: 1,
  },
  errorContainer: {
    borderRadius: 8,
    margin: 16,
    padding: 12,
  },
  errorText: {
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    marginRight: 8,
  },
  modalConfirmButton: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    padding: 24,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSubtitle: {
    marginBottom: 16,
    marginTop: 8,
  },
  modalTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  reasonInput: {
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    minHeight: 100,
    padding: 12,
    textAlignVertical: 'top',
  },
  rejectButton: {
    flex: 1,
  },
});

export default ApproveUsersScreen;
