import { clearTokens, getAccessToken } from "@/lib/auth/storage";

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

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = `${getApiBaseUrl()}${path}`;
  const accessToken = getAccessToken();
  const headers = new Headers(init?.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch {
    throw new ApiError(
      `Could not reach the API at ${url}. This is often a CORS or network issue — check the backend's CORS configuration.`
    );
  }

  if (res.status === 401) {
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
    throw new ApiError(`Request to ${path} failed with status ${res.status}`, res.status);
  }

  return res;
}
