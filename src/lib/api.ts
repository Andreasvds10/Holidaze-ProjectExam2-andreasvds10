// src/lib/api.ts

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!BASE_URL) throw new Error("VITE_API_URL is not defined in .env");
  if (!API_KEY) throw new Error("VITE_API_KEY is not defined in .env");

  const token = localStorage.getItem("accessToken");

  // Mutable headers object so TypeScript stops crying
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  // Merge any headers passed in from the call site
  if (init.headers) {
    Object.assign(headers, init.headers as Record<string, string>);
  }

  // Add auth token if we have one
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(BASE_URL + path, {
    ...init,
    headers,
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    const message =
      json?.errors?.[0]?.message ||
      json?.message ||
      `HTTP ${res.status}`;

    console.error("[api error]", message);
    throw new Error(message);
  }

  return json as T;
}
