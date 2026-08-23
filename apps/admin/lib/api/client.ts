import { clearTokens, getIdToken } from "@/lib/auth/storage";

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
  /** Attach the stored access token as an Authorization header. Defaults to true. */
  auth?: boolean;
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
  options?: ApiFetchOptions
): Promise<Response> {
  const url = `${getApiBaseUrl()}${path}`;
  const auth = options?.auth ?? true;
  const headers = new Headers(init?.headers);
  if (auth) {
    const idToken = getIdToken();
    if (idToken) {
      headers.set("Authorization", `Bearer ${idToken}`);
    }
  }

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch {
    throw new ApiError(
      `Could not reach the API at ${url}. This is often a CORS or network issue — check the backend's CORS configuration.`
    );
  }

  if (auth && res.status === 401) {
    // The token was rejected or is missing; drop it so the next navigation re-triggers login.
    clearTokens();
    if (typeof window !== "undefined") {
      // Plain module function outside the React tree — no useRouter() available here,
      // and a full reload is wanted anyway to reset all in-memory auth state.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(
      `Request to ${path} failed with status ${res.status}${body ? `: ${body}` : ""}`,
      res.status
    );
  }

  return res;
}
