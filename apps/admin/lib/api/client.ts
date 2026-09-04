import { clearTokens, getIdToken, loadTokens, saveTokens } from "@/lib/auth/storage";
import { refreshTokens } from "@/lib/auth/tokenClient";

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new ApiError("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  return baseUrl;
}

export interface ApiFetchOptions {
  /** Attach the stored ID token as an Authorization header. Defaults to true. */
  auth?: boolean;
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
  options?: ApiFetchOptions
): Promise<Response> {
  const url = `${getApiBaseUrl()}${path}`;
  const auth = options?.auth ?? true;
  const request = async (): Promise<Response> => {
    const headers = new Headers(init?.headers);
    if (auth) {
      const idToken = getIdToken();
      if (idToken) headers.set("Authorization", `Bearer ${idToken}`);
    }
    try {
      return await fetch(url, { ...init, headers });
    } catch {
      throw new ApiError(
        `Could not reach the API at ${url}. This is often a CORS or network issue — check the backend's CORS configuration.`
      );
    }
  };

  let res = await request();

  if (auth && res.status === 401) {
    const tokens = loadTokens();
    if (tokens?.refreshToken) {
      try {
        const refreshed = await refreshTokens(tokens.refreshToken);
        saveTokens({
          accessToken: refreshed.access_token,
          idToken: refreshed.id_token,
          refreshToken: refreshed.refresh_token ?? tokens.refreshToken,
          expiresAt: Date.now() + refreshed.expires_in * 1000 - 30_000,
        });
        res = await request();
      } catch {
        // The refresh token is expired or invalid. Re-authentication is required.
        clearTokens();
      }
    } else {
      clearTokens();
    }

    if (res.status === 401 && typeof window !== "undefined") {
      // Retry only once; otherwise a rejected token could cause an infinite loop.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const message =
      res.status === 404
        ? `Resource not found: ${path}`
        : `Request to ${path} failed with status ${res.status}${body ? `: ${body}` : ""}`;
    throw new ApiError(
      message,
      res.status
    );
  }

  return res;
}
