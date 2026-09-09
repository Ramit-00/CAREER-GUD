/**
 * URL Sanitizer Utility
 * Neutralizes XSS in URLs and prevents Open Redirect vulnerabilities.
 */

/**
 * Ensures a URL is safe to render in an <a href="..."> tag.
 * Rejects javascript:, data:, vbscript: and protocol-relative (//) URLs.
 * Allows safe http:, https:, mailto:, tel:, and relative URLs starting with / (except //).
 */
export function sanitizeSafeUrl(url?: string | null): string {
  if (!url) return '#';
  const trimmed = url.trim();

  // Block javascript:, data:, vbscript:
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '#';
  }

  // Safe relative paths: starts with / but not //
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Safe external URLs: http or https
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return '#';
}

/**
 * Sanitizes callback URLs after login/authentication to prevent Open Redirect attacks.
 * Only permits internal application paths starting with a single '/' (not '//' or external domains).
 */
export function sanitizeCallbackUrl(url: string | null | undefined, fallback = '/dashboard'): string {
  if (!url) return fallback;
  const trimmed = url.trim();

  // Must start with '/' and not '//' or contain domain schemes
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('://')) {
    return trimmed;
  }

  return fallback;
}
