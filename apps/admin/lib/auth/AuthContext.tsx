"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { generateCodeChallenge, generateRandomString } from "./pkce";
import { getAuthorizeUrl, getLogoutUrl } from "./config";
import {
  clearPkceState,
  clearTokens,
  loadPkceState,
  loadTokens,
  savePkceState,
  saveTokens,
  type TokenSet,
} from "./storage";
import { AuthError, exchangeCodeForTokens, refreshTokens } from "./tokenClient";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface RawTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in: number;
}

interface AuthContextValue {
  status: AuthStatus;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  handleCallback: (code: string, state: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Refresh a little before actual expiry so a near-expiry token is never handed to a caller.
const EXPIRY_SKEW_MS = 30_000;

function toTokenSet(res: RawTokenResponse, previousRefreshToken?: string): TokenSet {
  return {
    accessToken: res.access_token,
    idToken: res.id_token,
    refreshToken: res.refresh_token ?? previousRefreshToken,
    expiresAt: Date.now() + res.expires_in * 1000 - EXPIRY_SKEW_MS,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const applyTokens = useCallback((tokens: TokenSet) => {
    saveTokens(tokens);
    setStatus("authenticated");
  }, []);

  const signOutLocally = useCallback(() => {
    clearTokens();
    setStatus("unauthenticated");
  }, []);

  useEffect(() => {
    // Restore an existing session on mount, transparently refreshing expired
    // ID/access tokens via the stored refresh token before falling back to "logged out".
    (async () => {
      const tokens = loadTokens();
      if (!tokens) {
        setStatus("unauthenticated");
        return;
      }
      if (Date.now() < tokens.expiresAt) {
        setStatus("authenticated");
        return;
      }
      if (!tokens.refreshToken) {
        clearTokens();
        setStatus("unauthenticated");
        return;
      }
      try {
        const res = await refreshTokens(tokens.refreshToken);
        applyTokens(toTokenSet(res, tokens.refreshToken));
      } catch {
        clearTokens();
        setStatus("unauthenticated");
      }
    })();
  }, [applyTokens]);

  const login = useCallback(async () => {
    const codeVerifier = generateRandomString(32);
    const state = generateRandomString(16);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    savePkceState({ codeVerifier, state });
    window.location.assign(getAuthorizeUrl(codeChallenge, state));
  }, []);

  const logout = useCallback(() => {
    signOutLocally();
    window.location.assign(getLogoutUrl());
  }, [signOutLocally]);

  const handleCallback = useCallback(
    async (code: string, state: string) => {
      const pkce = loadPkceState();
      clearPkceState();
      if (!pkce || pkce.state !== state) {
        setError("Invalid login state. Please try logging in again.");
        setStatus("unauthenticated");
        return;
      }
      try {
        const res = await exchangeCodeForTokens(code, pkce.codeVerifier);
        applyTokens(toTokenSet(res));
      } catch (err) {
        setError(err instanceof AuthError ? err.message : "Failed to complete login");
        setStatus("unauthenticated");
      }
    },
    [applyTokens]
  );

  const value = useMemo(
    () => ({ status, error, login, logout, handleCallback }),
    [status, error, login, logout, handleCallback]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
