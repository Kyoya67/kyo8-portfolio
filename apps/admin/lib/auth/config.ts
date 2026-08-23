function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export interface CognitoConfig {
  domain: string;
  clientId: string;
  region: string;
  redirectUri: string;
}

export function getCognitoConfig(): CognitoConfig {
  return {
    domain: requireEnv("NEXT_PUBLIC_COGNITO_DOMAIN", process.env.NEXT_PUBLIC_COGNITO_DOMAIN),
    clientId: requireEnv("NEXT_PUBLIC_COGNITO_CLIENT_ID", process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID),
    region: requireEnv("NEXT_PUBLIC_COGNITO_REGION", process.env.NEXT_PUBLIC_COGNITO_REGION),
    redirectUri: requireEnv(
      "NEXT_PUBLIC_COGNITO_REDIRECT_URI",
      process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI
    ),
  };
}

export function getTokenUrl(): string {
  return `${getCognitoConfig().domain}/oauth2/token`;
}

export function getAuthorizeUrl(codeChallenge: string, state: string): string {
  const { domain, clientId, redirectUri } = getCognitoConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: "openid email phone",
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
  });
  return `${domain}/oauth2/authorize?${params.toString()}`;
}

export function getLogoutUrl(): string {
  const { domain, clientId, redirectUri } = getCognitoConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    logout_uri: redirectUri.replace(/\/callback$/, "/login"),
  });
  return `${domain}/logout?${params.toString()}`;
}
