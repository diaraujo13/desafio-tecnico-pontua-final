import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
} from 'react';
import type { Result } from '../../domain/shared/Result';
import type { UserDTO } from '../../application/dtos/UserDTO';
import type { LoginDTO } from '../../application/dtos/LoginDTO';
import { loginUseCase, logoutUseCase, restoreSessionUseCase } from '../../main/container';

interface AuthContextValue {
  user: UserDTO | null;
  isAuthLoading: boolean;
  login: (dto: LoginDTO) => Promise<Result<UserDTO>>;
  logout: () => Promise<Result<void>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Start as true to check session on mount

  const handleLogin = useCallback(async (dto: LoginDTO): Promise<Result<UserDTO>> => {
    setIsAuthLoading(true);
    try {
      const result = await loginUseCase.execute(dto);

      if (result.isSuccess) {
        const loggedUser = result.getValue();
        setUser(loggedUser);
      }

      return result;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async (): Promise<Result<void>> => {
    setIsAuthLoading(true);
    try {
      const result = await logoutUseCase.execute();

      if (result.isSuccess) {
        setUser(null);
      }

      return result;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const result = await restoreSessionUseCase.execute();

        if (result.isSuccess) {
          const restoredUser = result.getValue();
          if (restoredUser) {
            setUser(restoredUser);
          }
        }
        // If restore fails or returns null, user remains null (not authenticated)
      } catch {
        // Silently fail - user is not authenticated
      } finally {
        setIsAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthLoading,
      login: handleLogin,
      logout: handleLogout,
    }),
    [user, isAuthLoading, handleLogin, handleLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return ctx;
}
