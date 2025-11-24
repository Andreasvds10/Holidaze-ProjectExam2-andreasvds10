// src/lib/api.ts

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const base = import.meta.env.VITE_API_URL as string | undefined;

  if (!base) {
    console.error("VITE_API_URL is not set. Check your .env file.");
    throw new Error("VITE_API_URL is not set. Check your .env file.");
  }

  const token = localStorage.getItem("accessToken");

  const url = base + path;
  console.log("[api] Request:", url);

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
      console.error("[api] Error response body:", body);
    } catch {
      // ignore JSON parse fail
    }
    console.error("[api] Request failed:", url, message);
    throw new Error(message);
  }

  const json = (await res.json()) as T;
  return json;
}
