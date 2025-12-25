import { useAuthContext } from '../contexts/AuthContext';

/**
 * useAuth
 *
 * Presentation hook that exposes the authentication state and actions.
 * It does NOT contain business logic; it simply forwards to AuthContext,
 * which in turn calls the Application Use Cases created in the Composition Root.
 */
export function useAuth() {
  return useAuthContext();
}
