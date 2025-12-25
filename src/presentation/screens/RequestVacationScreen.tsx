import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../hooks/useAuth';
import { useRequestVacation } from '../hooks/vacations/useRequestVacation';
import { Text } from '../components/ui/Text';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useTheme } from '../theme/ThemeProvider';
import { formatDateToPTBR } from '../utils/dateFormatters';

const requestVacationSchema = z.object({
  startDate: z.date({ required_error: 'Data de início é obrigatória' }),
  endDate: z.date({ required_error: 'Data de término é obrigatória' }),
  observation: z.string().optional(),
});

type RequestVacationFormValues = z.infer<typeof requestVacationSchema>;

export function RequestVacationScreen() {
  const { user } = useAuth();
  const { requestVacation, isLoading, error, reset: resetMutation } = useRequestVacation();
  const { colors } = useTheme();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<RequestVacationFormValues>({
    resolver: zodResolver(requestVacationSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      observation: '',
    },
  });

  // Use useWatch hook to observe startDate value for minimumDate constraint
  const startDate = useWatch({ control, name: 'startDate' });

  const onSubmit = useCallback(
    async (values: RequestVacationFormValues) => {
      if (!user) {
        return;
      }

      // Clear previous messages and errors before new submission
      setSuccessMessage(null);
      resetMutation();

      const result = await requestVacation({
        requesterId: user.id,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        observation: values.observation || undefined,
      });

      if (result.isSuccess) {
        setSuccessMessage('Solicitação enviada com sucesso.');
        reset();
      }
      // Error is automatically handled by the hook and displayed via the error state
    },
    [requestVacation, reset, resetMutation, user],
  );

  return (
    <View style={styles.container} testID="RequestVacationScreen_Container">
      <Text variant="h2" style={styles.title} testID="RequestVacationScreen_Title">
        Solicitar Férias
      </Text>

      <Controller
        control={control}
        name="startDate"
        render={({ field: { onChange, value } }) => (
          <View>
            <Text variant="body" style={styles.label}>
              Data de início
            </Text>
            <Pressable
              onPress={() => setShowStartPicker(true)}
              style={[styles.dateButton, { borderColor: colors.border }]}
              testID="RequestVacationScreen_StartDateButton"
            >
              <Text variant="body">{formatDateToPTBR(value)}</Text>
            </Pressable>
            {errors.startDate && (
              <Text variant="caption" style={[styles.errorText, { color: colors.error }]}>
                {errors.startDate.message}
              </Text>
            )}
            {showStartPicker && (
              <DateTimePicker
                value={value}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowStartPicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    onChange(selectedDate);
                    setValue('startDate', selectedDate);
                  }
                }}
                minimumDate={new Date()}
                testID="RequestVacationScreen_StartDatePicker"
              />
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="endDate"
        render={({ field: { onChange, value } }) => (
          <View>
            <Text variant="body" style={styles.label}>
              Data de término
            </Text>
            <Pressable
              onPress={() => setShowEndPicker(true)}
              style={[styles.dateButton, { borderColor: colors.border }]}
              testID="RequestVacationScreen_EndDateButton"
            >
              <Text variant="body">{formatDateToPTBR(value)}</Text>
            </Pressable>
            {errors.endDate && (
              <Text variant="caption" style={[styles.errorText, { color: colors.error }]}>
                {errors.endDate.message}
              </Text>
            )}
            {showEndPicker && (
              <DateTimePicker
                value={value}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowEndPicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    onChange(selectedDate);
                    setValue('endDate', selectedDate);
                  }
                }}
                minimumDate={startDate}
                testID="RequestVacationScreen_EndDatePicker"
              />
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="observation"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Observação (opcional)"
            multiline
            numberOfLines={3}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {error && (
        <Text variant="caption" style={[styles.errorText, { color: colors.error }]} testID="RequestVacationScreen_ErrorText">
          {error}
        </Text>
      )}

      {successMessage && (
        <Text variant="caption" style={styles.successText} testID="RequestVacationScreen_SuccessText">
          {successMessage}
        </Text>
      )}

      <Button
        label="Enviar solicitação"
        variant="primary"
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
        style={styles.submitButton}
        testID="RequestVacationScreen_SubmitButton"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  dateButton: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
    marginTop: 8,
    padding: 12,
  },
  errorText: {
    marginTop: 4,
  },
  label: {
    marginTop: 16,
  },
  submitButton: {
    marginTop: 16,
  },
  successText: {
    marginTop: 8,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
});
