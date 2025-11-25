// src/features/bookings/Auth/authApi.ts
import { api } from "../../../lib/api";
import { z } from "zod";

/* ---------------------------------- Schemas ---------------------------------- */

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z
    .string()
    .email()
    .refine((v) => v.endsWith("@stud.noroff.no"), {
      message: "You must use a stud.noroff.no email",
    }),
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

// REGISTER
export async function registerUser(input: RegisterInput) {
  const res = await api<{ data: Profile }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return res.data;
}

// LOGIN
export async function loginUser(
  input: LoginInput
): Promise<{ accessToken: string }> {
  const res = await api<{ data: { accessToken: string } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!res.data?.accessToken) {
    throw new Error("Login failed: No accessToken received.");
  }

  return { accessToken: res.data.accessToken };
}

// GET CURRENT PROFILE (CORRECT ENDPOINT)
export async function getMe(): Promise<Profile> {
  const res = await api<{ data: Profile }>("/holidaze/profiles/me");
  return res.data;
}

// UPDATE AVATAR (CORRECT ENDPOINT)
export async function updateAvatar(url: string, alt = "Avatar") {
  const res = await api<{ data: Profile }>("/holidaze/profiles/media", {
    method: "PUT",
    body: JSON.stringify({
      avatar: { url, alt },
    }),
  });

  return res.data;
}
