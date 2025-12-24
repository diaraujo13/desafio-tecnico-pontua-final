import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { useTheme } from '../theme/ThemeProvider';

const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Demo accounts for development/testing
const DEMO_ACCOUNTS = [
  { email: 'joao@empresa.com', password: 'Senha@123', role: 'ADMIN', name: 'João Silva' },
  { email: 'maria@empresa.com', password: 'Senha@123', role: 'MANAGER', name: 'Maria Santos' },
  { email: 'pedro@empresa.com', password: 'Senha@123', role: 'COLLABORATOR', name: 'Pedro Oliveira' },
] as const;

export function LoginScreen() {
  const { login, isAuthLoading } = useAuth();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleDemoAccountPress = React.useCallback(
    (email: string, password: string) => {
      setValue('email', email);
      setValue('password', password);
      setSubmitError(null);
    },
    [setValue],
  );

  const onSubmit = React.useCallback(
    async (values: LoginFormValues) => {
      setSubmitError(null);
      const result = await login({
        email: values.email,
        password: values.password,
      });

      if (result.isFailure) {
        const error = result.getError();
        setSubmitError(error.message);
      }
    },
    [login],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
          <View style={styles.container}>
            {__DEV__ && (
              <Card style={styles.demoBanner}>
                <Text
                  variant="label"
                  style={[styles.demoBannerTitle, { color: theme.colors.primary }]}
                >
                  Contas de Demonstração
                </Text>
                <Text variant="caption" style={[styles.demoBannerSubtitle, { color: theme.colors.textSecondary }]}>
                  Toque em uma conta para preencher automaticamente
                </Text>
                {DEMO_ACCOUNTS.map((account) => (
                  <Pressable
                    key={account.email}
                    onPress={() => handleDemoAccountPress(account.email, account.password)}
                    style={({ pressed }) => [
                      styles.demoAccountItem,
                      { backgroundColor: theme.colors.surfaceVariant },
                      pressed && styles.demoAccountItemPressed,
                    ]}
                    testID={`LoginScreen_DemoAccount_${account.role}`}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Usar conta de demonstração ${account.name}, ${account.role}`}
                  >
                    <View style={styles.demoAccountContent}>
                      <Text variant="body" style={{ color: theme.colors.textPrimary }}>
                        {account.name}
                      </Text>
                      <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                        {account.email} • {account.role}
                      </Text>
                    </View>
                    <Text variant="caption" style={{ color: theme.colors.primary }}>
                      {account.password}
                    </Text>
                  </Pressable>
                ))}
              </Card>
            )}

            <Text variant="h2" style={styles.title}>
              Entrar
            </Text>

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
                  placeholder="seu.email@empresa.com"
                  errorMessage={errors.email?.message}
                  testID="LoginScreen_EmailInput"
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
                  testID="LoginScreen_PasswordInput"
                />
              )}
            />

            {submitError && (
              <Text
                variant="caption"
                style={[styles.errorText, { color: theme.colors.error }]}
                testID="LoginScreen_ErrorText"
              >
                {submitError}
              </Text>
            )}

            <Button
              label="Entrar"
              variant="primary"
              loading={isAuthLoading}
              onPress={handleSubmit(onSubmit)}
              style={styles.button}
              testID="LoginScreen_LoginButton"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  demoAccountContent: {
    flex: 1,
  },
  demoAccountItem: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    padding: 12,
  },
  demoAccountItemPressed: {
    opacity: 0.7,
  },
  demoBanner: {
    marginBottom: 24,
    padding: 16,
  },
  demoBannerSubtitle: {
    marginBottom: 12,
    marginTop: 4,
  },
  demoBannerTitle: {
    marginBottom: 4,
  },
  errorText: {
    marginTop: 8,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
});
