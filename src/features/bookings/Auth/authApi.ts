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


/* ---------------------------------- API Calls ---------------------------------- */

// REGISTER (fetch)
export async function registerUser(input: RegisterInput) {
  const res = await api<{ data: Profile }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return res.data;
}

// LOGIN (fetch)
export async function loginUser(input: LoginInput): Promise<{ accessToken: string }> {
  const res = await api<{ data: { accessToken: string } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!res.data?.accessToken) {
    throw new Error("Login failed: missing accessToken");
  }

  return { accessToken: res.data.accessToken };
}

// GET PROFILE (correct endpoint: /profiles/me)
export async function getMe(): Promise<Profile> {
  const res = await api<{ data: Profile }>("/profiles/me");
  return res.data;
}

// UPDATE AVATAR (PUT /auth/profile/media)
export async function updateAvatar(url: string, alt = "Avatar") {
  const res = await api<{ data: Profile }>("/auth/profile/media", {
    method: "PUT",
    body: JSON.stringify({
      avatar: {
        url,
        alt,
      },
    }),
  });

  return res.data;
}
