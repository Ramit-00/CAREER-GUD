/**
 * Centralized JWT secret retriever.
 * Ensures the application requires a valid secret in production
 * and prevents JWT token forgery via known fallback strings.
 */
export function getJwtSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'CRITICAL SECURITY CONFIGURATION ERROR: Neither NEXTAUTH_SECRET nor AUTH_SECRET is set in production environment.'
      );
    }
    // Safe development-only secret if not configured locally
    return 'career-gud-local-dev-fallback-secret-at-least-32-chars-long';
  }
  return secret;
}
