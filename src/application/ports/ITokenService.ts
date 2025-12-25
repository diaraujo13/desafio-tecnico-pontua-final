/**
 * Token service abstraction for Application layer
 * Allows Login/Logout use cases to manage tokens without knowing storage details.
 */
export interface ITokenService {
  /**
   * Persists an access token (and optionally refresh token) in some storage.
   */
  saveToken(token: string): Promise<void>;

  /**
   * Clears any stored tokens from storage.
   */
  clearToken(): Promise<void>;

  /**
   * Retrieves the current token if present.
   */
  getToken(): Promise<string | null>;
}
