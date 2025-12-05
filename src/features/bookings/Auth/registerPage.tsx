// src/features/bookings/Auth/registerPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";

import { registerUser, loginUser, getMe } from "./authApi";
import { useAuth } from "./store";
import { toastSuccess, toastError } from "../../../components/ui/Toast";

const schema = z.object({
  name: z.string().min(3, "Min 3 characters"),
  email: z
    .string()
    .email("Enter a valid email")
    .refine((value) => value.endsWith("@stud.noroff.no"), {
      message: "Use your stud.noroff.no email",
    }),
  password: z.string().min(8, "Min 8 characters"),
  venueManager: z.boolean().default(false),
});

// RHF expects input type
type FormValues = z.input<typeof schema>;

export default function RegisterPage() {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { venueManager: false },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setServerError(null);

    try {
      // Sørger for at vi har valid data før vi sender
      const payload = schema.parse(values);

      // Registrer bruker
      await registerUser(payload);

      // Logg inn direkte etter registrering
      const { accessToken } = await loginUser({
        email: payload.email,
        password: payload.password,
      });

      localStorage.setItem("accessToken", accessToken);
      setToken(accessToken);

      const me = await getMe();
      setUser(me);

      toastSuccess(
        `Account created successfully! Welcome, ${me.name}!`
      );
      navigate("/");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setServerError(msg);
      toastError(msg);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-card">
      <h1 className="mb-2 font-display text-2xl font-semibold">
        Create account
      </h1>
      <p className="mb-6 text-sm opacity-70">
        Use your <span className="font-medium">stud.noroff.no</span> email to
        register.
      </p>

      {serverError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm">Username</label>
          <input
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-black/20"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-black/20"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input
            type="password"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-black/20"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Venue manager toggle */}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("venueManager")} />
          Register as Venue Manager
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#0f1720] px-4 py-2 text-white transition hover:bg-black disabled:opacity-60"
        >
          {isSubmitting ? "Creating…" : "Create account"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm opacity-70">
        Already have an account?{" "}
        <Link className="underline hover:opacity-100" to="/login">
          Log in
        </Link>
      </div>
    </div>
  );
}
