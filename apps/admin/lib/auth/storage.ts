export interface TokenSet {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  expiresAt: number;
}

interface PkceState {
  codeVerifier: string;
  state: string;
}

const TOKENS_KEY = "kyo8_admin_tokens";
const PKCE_KEY = "kyo8_admin_pkce";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function saveTokens(tokens: TokenSet): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function loadTokens(): TokenSet | null {
  if (!isBrowser()) return null;
  const raw = sessionStorage.getItem(TOKENS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TokenSet;
  } catch {
    return null;
  }
}

export function clearTokens(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(TOKENS_KEY);
}

// Used by lib/api/client.ts outside the React tree; returns null once expired
// rather than a stale token, so callers never send an access token past its lifetime.
export function getAccessToken(): string | null {
  const tokens = loadTokens();
  if (!tokens || Date.now() >= tokens.expiresAt) return null;
  return tokens.accessToken;
}

export function savePkceState(pkce: PkceState): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(PKCE_KEY, JSON.stringify(pkce));
}

export function loadPkceState(): PkceState | null {
  if (!isBrowser()) return null;
  const raw = sessionStorage.getItem(PKCE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PkceState;
  } catch {
    return null;
  }
}

export function clearPkceState(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(PKCE_KEY);
}
