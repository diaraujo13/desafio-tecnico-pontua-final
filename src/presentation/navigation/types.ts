import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Root-level stacks
 */
export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  Dashboard: undefined;
  RequestVacation: undefined;
  VacationHistory: undefined;
  VacationDetails: { requestId: string };
  ManagerDashboard: undefined;
  ReviewVacation: { requestId: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

declare global {
  namespace ReactNavigation {
    // Augment the global namespace for type-safe navigation helpers

    interface RootParamList extends RootStackParamList {}
  }
}
