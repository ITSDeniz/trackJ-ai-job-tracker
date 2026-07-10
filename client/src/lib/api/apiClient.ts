const BASE_URL = "/api/v1";

export interface ApiErrorResponse {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
}

export class ApiError extends Error {
  public code: string;
  public fields?: Record<string, string[]>;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.code = response.code;
    this.fields = response.fields;
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("tp_token");
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  let json: { error?: ApiErrorResponse; data?: T; message?: string };
  try {
    json = await response.json();
  } catch {
    throw new Error("Could not parse response JSON.");
  }

  if (!response.ok) {
    if (json.error) {
      throw new ApiError(json.error);
    }
    throw new Error(json.message || "An unexpected error occurred.");
  }

  return json.data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
