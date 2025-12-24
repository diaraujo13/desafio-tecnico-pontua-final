import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import type { RootStackParamList } from './types';
import { useAuth } from '../hooks/useAuth';

const RootStack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator
 *
 * For now, auth state is mocked: we always show AuthNavigator.
 * Later this will be driven by a real AuthContext/useAuth.
 */
export function RootNavigator() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="App" component={AppNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
