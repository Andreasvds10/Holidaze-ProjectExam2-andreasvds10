// src/features/bookings/Auth/loginPage.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser, getMe } from "./authApi";
import { useAuth } from "./store";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { toastSuccess, toastError } from "../../../components/ui/Toast";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min 8 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);

    try {
      const { accessToken } = await loginUser(values);

      localStorage.setItem("accessToken", accessToken);
      setToken(accessToken);

      const me = await getMe();
      setUser(me);

      toastSuccess(`Welcome back, ${me.name}!`);
      navigate("/");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setServerError(msg);
      toastError(msg);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-card">
      <h1 className="mb-2 font-display text-2xl font-semibold">Log in</h1>
      <p className="mb-6 text-sm opacity-70">Use your Noroff account.</p>

      {serverError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input
            type="password"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-black/20"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#0f1720] px-4 py-2 text-white transition hover:bg-black disabled:opacity-60"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm opacity-70">
        No account?{" "}
        <Link className="underline hover:opacity-100" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}
