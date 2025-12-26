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

interface AuthProviderProps extends PropsWithChildren {
  /**
   * Test seam: Skip bootstrap process for testing
   * When true, AuthProvider immediately renders children without calling restoreSessionUseCase
   * Default: false (production behavior unchanged)
   */
  skipBootstrap?: boolean;
}

export function AuthProvider({ children, skipBootstrap = false }: AuthProviderProps) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [hasBootstrapped, setHasBootstrapped] = useState(skipBootstrap);

  const handleLogin = useCallback(async (dto: LoginDTO): Promise<Result<UserDTO>> => {
    setIsAuthLoading(true);
    try {
      const result = await loginUseCase.execute(dto);

      if (result.isSuccess) {
        setUser(result.getValue());
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

  useEffect(() => {
    // Test seam: Skip bootstrap if skipBootstrap is true
    if (skipBootstrap) {
      return;
    }

    let isMounted = true;

    async function restoreSession() {
      try {
        const result = await restoreSessionUseCase.execute();

        if (!isMounted) return;

        if (result.isSuccess) {
          const restoredUser = result.getValue();
          if (restoredUser) {
            setUser(restoredUser);
          }
        }
      } finally {
        if (isMounted) {
          setHasBootstrapped(true);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [skipBootstrap]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthLoading,
      login: handleLogin,
      logout: handleLogout,
    }),
    [user, isAuthLoading, handleLogin, handleLogout],
  );

  if (!hasBootstrapped) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return ctx;
}
