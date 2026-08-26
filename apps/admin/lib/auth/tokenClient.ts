import { getCognitoConfig, getTokenUrl } from "./config";

export class AuthError extends Error {}

interface TokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

async function postToken(body: URLSearchParams, failureMessage: string): Promise<TokenResponse> {
  const res = await fetch(getTokenUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new AuthError(`${failureMessage} (status ${res.status})`);
  }

  return res.json();
}

export function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<TokenResponse> {
  const { clientId, redirectUri } = getCognitoConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });
  return postToken(body, "Failed to exchange authorization code");
}

export function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  const { clientId } = getCognitoConfig();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: refreshToken,
  });
  return postToken(body, "Failed to refresh session");
}
