// src/lib/api.ts
export async function api<T>(endpoint: string, options: RequestInit = {}) {
  const baseUrl = import.meta.env.VITE_API_URL; // "https://v2.api.noroff.dev"
  const apiKey = import.meta.env.VITE_API_KEY;
  const token = localStorage.getItem("accessToken");

  if (!baseUrl) throw new Error("Missing VITE_API_URL");
  if (!apiKey) throw new Error("Missing VITE_API_KEY");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": apiKey,
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(baseUrl + endpoint, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("[api] Error response:", data);
    throw new Error(data?.errors?.[0]?.message || "API Error");
  }

  return data as T;
}
