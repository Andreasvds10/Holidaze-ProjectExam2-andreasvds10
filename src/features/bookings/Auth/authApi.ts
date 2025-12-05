// src/features/bookings/Auth/authApi.ts
import { api } from "../../../lib/api";
import { z } from "zod";

/* ---------------------------------- Schemas ---------------------------------- */

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  venueManager: z.boolean().optional().default(false),
});

export type RegisterInput = z.input<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginInput = z.input<typeof loginSchema>;

export type Profile = {
  name: string;
  email: string;
  avatar?: { url: string; alt?: string } | null;
  venueManager?: boolean;
};

/* ---------------------------------- Helpers ---------------------------------- */

function getToken(): string {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Not authenticated");
  }
  return token;
}

function decodeTokenPayload(): any {
  const token = getToken();

  try {
    const payloadJson = atob(token.split(".")[1]);
    return JSON.parse(payloadJson);
  } catch (error) {
    console.error("[authApi] Failed to decode token:", error);
    throw new Error("Could not read user information from token");
  }
}

function getNameFromToken(): string {
  const payload = decodeTokenPayload();
  const name = payload.name as string | undefined;

  if (!name) {
    throw new Error("Invalid token: missing name");
  }

  return name;
}

/* ---------------------------------- API Calls ---------------------------------- */

// REGISTER (POST /auth/register)
export async function registerUser(input: RegisterInput) {
  const payload = {
    name: input.name.trim(),
    email: input.email.trim(),
    password: input.password,
    venueManager: input.venueManager ?? false,
  };

  const res = await api<{ data: Profile }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.data;
}

// LOGIN (POST /auth/login)
export async function loginUser(
  input: LoginInput,
): Promise<{ accessToken: string }> {
  const payload = {
    email: input.email.trim(),
    password: input.password,
  };

  const res = await api<{ data: { accessToken: string } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.data?.accessToken) {
    throw new Error("Login failed: missing accessToken");
  }

  return { accessToken: res.data.accessToken };
}

// GET PROFILE (fetch from API to get full profile including venueManager)
export async function getMe(): Promise<Profile> {
  // First get name from token
  const name = getNameFromToken();
  
  // Then fetch full profile from API to get venueManager and other info
  const encoded = encodeURIComponent(name);
  const res = await api<{ data: Profile }>(
    `/holidaze/profiles/${encoded}`
  );

  return res.data;
}

// UPDATE AVATAR (PUT /holidaze/profiles/{name})
// According to API docs: https://docs.noroff.dev/docs/v2/holidaze/profiles
export async function updateAvatar(url: string | null, alt = "Avatar") {
  const name = getNameFromToken();
  const encoded = encodeURIComponent(name);

  const res = await api<{ data: Profile }>(
    `/holidaze/profiles/${encoded}`,
    {
      method: "PUT",
      body: JSON.stringify({
        avatar: url ? { url, alt } : null,
      }),
    },
  );

  return res.data;
}
