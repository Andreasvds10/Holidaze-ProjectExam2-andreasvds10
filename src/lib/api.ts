// src/lib/api.ts
export async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const token = localStorage.getItem("accessToken");

  if (!baseUrl) {
    throw new Error("Missing VITE_API_URL in .env");
  }
  if (!apiKey) {
    throw new Error("Missing VITE_API_KEY in .env");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": apiKey,          // ✔ REQUIRED
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;  // ✔ send token ved protected routes
  }

  const res = await fetch(baseUrl + endpoint, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers ?? {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("[api] Error response body:", data);
    throw new Error(data?.errors?.[0]?.message || "API request failed");
  }

  return data as T;
}
