import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';
import { DashboardScreen } from '../screens/DashboardScreen';
import { RequestVacationScreen } from '../screens/RequestVacationScreen';
import { VacationHistoryScreen } from '../screens/VacationHistoryScreen';
import { VacationDetailsScreen } from '../screens/VacationDetailsScreen';
import { ManagerDashboardScreen } from '../screens/ManagerDashboardScreen';
import { ReviewVacationScreen } from '../screens/ReviewVacationScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen
        name="RequestVacation"
        component={RequestVacationScreen}
        options={{ title: 'Solicitar Férias' }}
      />
      <Stack.Screen
        name="VacationHistory"
        component={VacationHistoryScreen}
        options={{ title: 'Histórico de Férias' }}
      />
      <Stack.Screen
        name="VacationDetails"
        component={VacationDetailsScreen}
        options={{ title: 'Detalhes da Solicitação' }}
      />
      <Stack.Screen
        name="ManagerDashboard"
        component={ManagerDashboardScreen}
        options={{ title: 'Pendências de Aprovação' }}
      />
      <Stack.Screen
        name="ReviewVacation"
        component={ReviewVacationScreen}
        options={{ title: 'Revisar Solicitação' }}
      />
    </Stack.Navigator>
  );
}
