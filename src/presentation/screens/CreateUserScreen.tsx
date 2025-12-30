import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { useCreateUser } from '../hooks/useCreateUser';
import { useDepartments } from '../hooks/useDepartments';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { useTheme } from '../theme/ThemeProvider';
import { UserRole } from '../../domain/enums/UserRole';

const createUserSchema = z
  .object({
    registrationNumber: z.string().min(1, 'Matrícula é obrigatória'),
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
    role: z.nativeEnum(UserRole, {
      errorMap: () => ({ message: 'Perfil é obrigatório' }),
    }),
    departmentId: z.string().min(1, 'Departamento é obrigatório'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type CreateUserFormValues = z.infer<typeof createUserSchema>;

const ROLE_OPTIONS = [
  { label: 'Colaborador', value: UserRole.COLLABORATOR },
  { label: 'Gerente', value: UserRole.MANAGER },
  { label: 'Administrador', value: UserRole.ADMIN },
] as const;

export function CreateUserScreen() {
  const { user } = useAuth();
  const { createUser, isLoading, error, reset } = useCreateUser();
  const { departments, isLoading: isLoadingDepartments } = useDepartments();
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [showRolePicker, setShowRolePicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      registrationNumber: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.COLLABORATOR,
      departmentId: '',
    },
  });

  const selectedRole = watch('role');
  const selectedDepartmentId = watch('departmentId');

  const selectedDepartment = departments.find((d) => d.id === selectedDepartmentId);
  const selectedRoleLabel = ROLE_OPTIONS.find((r) => r.value === selectedRole)?.label || '';

  const onSubmit = useCallback(
    async (values: CreateUserFormValues) => {
      if (!user?.id) {
        return;
      }

      reset(); // Clear previous errors

      const result = await createUser({
        registrationNumber: values.registrationNumber,
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        departmentId: values.departmentId,
        createdBy: user.id,
      });

      if (result.isSuccess) {
        navigation.navigate('Dashboard');
      }
    },
    [createUser, user?.id, navigation, reset],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container} testID="CreateUserScreen_Container">
            <Text variant="h2" style={styles.title}>
              Novo Usuário
            </Text>
            <Text
              variant="bodySmall"
              style={[styles.subtitle, { color: theme.colors.textSecondary }]}
            >
              O usuário será criado com status &quot;Aguardando Aprovação&quot;
            </Text>

            <Controller
              control={control}
              name="registrationNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Matrícula"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="EMP001"
                  errorMessage={errors.registrationNumber?.message}
                  testID="CreateUserScreen_RegistrationNumberInput"
                />
              )}
            />

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome Completo"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="João Silva"
                  errorMessage={errors.name?.message}
                  testID="CreateUserScreen_NameInput"
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="joao@empresa.com"
                  errorMessage={errors.email?.message}
                  testID="CreateUserScreen_EmailInput"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Senha"
                  secureTextEntry
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="********"
                  errorMessage={errors.password?.message}
                  testID="CreateUserScreen_PasswordInput"
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirmar Senha"
                  secureTextEntry
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="********"
                  errorMessage={errors.confirmPassword?.message}
                  testID="CreateUserScreen_ConfirmPasswordInput"
                />
              )}
            />

            <Controller
              control={control}
              name="role"
              render={() => (
                <View>
                  <Text variant="label" style={styles.pickerLabel}>
                    Perfil
                  </Text>
                  <Pressable
                    onPress={() => setShowRolePicker(true)}
                    style={[
                      styles.pickerButton,
                      {
                        borderColor: errors.role ? theme.colors.error : theme.colors.border,
                        backgroundColor: theme.colors.surface,
                      },
                    ]}
                    testID="CreateUserScreen_RolePicker"
                  >
                    <Text
                      variant="body"
                      style={[
                        styles.pickerText,
                        {
                          color: selectedRoleLabel
                            ? theme.colors.textPrimary
                            : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {selectedRoleLabel || 'Selecione o perfil'}
                    </Text>
                  </Pressable>
                  {errors.role && (
                    <Text
                      variant="caption"
                      style={[styles.errorText, { color: theme.colors.error }]}
                    >
                      {errors.role.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="departmentId"
              render={() => (
                <View>
                  <Text variant="label" style={styles.pickerLabel}>
                    Departamento
                  </Text>
                  <Pressable
                    onPress={() => setShowDepartmentPicker(true)}
                    disabled={isLoadingDepartments}
                    style={[
                      styles.pickerButton,
                      {
                        borderColor: errors.departmentId ? theme.colors.error : theme.colors.border,
                        backgroundColor: theme.colors.surface,
                      },
                      isLoadingDepartments && styles.pickerButtonDisabled,
                    ]}
                    testID="CreateUserScreen_DepartmentPicker"
                  >
                    <Text
                      variant="body"
                      style={[
                        styles.pickerText,
                        {
                          color: selectedDepartment
                            ? theme.colors.textPrimary
                            : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {selectedDepartment?.name || 'Selecione o departamento'}
                    </Text>
                  </Pressable>
                  {errors.departmentId && (
                    <Text
                      variant="caption"
                      style={[styles.errorText, { color: theme.colors.error }]}
                    >
                      {errors.departmentId.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {error && (
              <Text
                variant="caption"
                style={[styles.errorText, { color: theme.colors.error }]}
                testID="CreateUserScreen_ErrorText"
              >
                {error}
              </Text>
            )}

            <Button
              label="Criar Usuário"
              variant="primary"
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
              testID="CreateUserScreen_CreateUserButton"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Role Picker Modal */}
      <Modal
        visible={showRolePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRolePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text variant="h3" style={styles.modalTitle}>
              Selecione o Perfil
            </Text>
            <FlatList
              data={ROLE_OPTIONS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setValue('role', item.value);
                    setShowRolePicker(false);
                  }}
                  style={[
                    styles.modalItem,
                    selectedRole === item.value && {
                      backgroundColor: theme.colors.primary + '20',
                    },
                  ]}
                  testID={`CreateUserScreen_RoleOption_${item.value}`}
                >
                  <Text
                    variant="body"
                    style={[
                      styles.modalItemText,
                      selectedRole === item.value && { color: theme.colors.primary },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
            <Button
              label="Cancelar"
              variant="outline"
              onPress={() => setShowRolePicker(false)}
              style={styles.modalCancelButton}
            />
          </Card>
        </View>
      </Modal>

      {/* Department Picker Modal */}
      <Modal
        visible={showDepartmentPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDepartmentPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text variant="h3" style={styles.modalTitle}>
              Selecione o Departamento
            </Text>
            {isLoadingDepartments ? (
              <Text
                variant="body"
                style={[styles.loadingText, { color: theme.colors.textSecondary }]}
              >
                Carregando departamentos...
              </Text>
            ) : (
              <FlatList
                data={departments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setValue('departmentId', item.id);
                      setShowDepartmentPicker(false);
                    }}
                    style={[
                      styles.modalItem,
                      selectedDepartmentId === item.id && {
                        backgroundColor: theme.colors.primary + '20',
                      },
                    ]}
                    testID={`CreateUserScreen_DepartmentOption_${item.id}`}
                  >
                    <Text
                      variant="body"
                      style={[
                        styles.modalItemText,
                        selectedDepartmentId === item.id && { color: theme.colors.primary },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                )}
              />
            )}
            <Button
              label="Cancelar"
              variant="outline"
              onPress={() => setShowDepartmentPicker(false)}
              style={styles.modalCancelButton}
            />
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  errorText: {
    marginBottom: 16,
    marginTop: 4,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  loadingText: {
    padding: 16,
    textAlign: 'center',
  },
  modalCancelButton: {
    marginTop: 16,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    padding: 24,
  },
  modalItem: {
    borderRadius: 8,
    marginBottom: 8,
    padding: 16,
  },
  modalItemText: {
    fontSize: 16,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerButton: {
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerButtonDisabled: {
    opacity: 0.5,
  },
  pickerLabel: {
    marginBottom: 8,
  },
  pickerText: {
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  submitButton: {
    marginTop: 16,
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

export default CreateUserScreen;
