// src/shared/Layout.tsx
import type { ReactNode } from "react";
import { useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ToastContainer from "../components/ui/Toast";
import { useAuth } from "../features/bookings/Auth/store";
import { getMe } from "../features/bookings/Auth/authApi";

export default function Layout({ children }: { children: ReactNode }) {
  const { token, user, setUser } = useAuth();

  // Initialize user from token on mount if token exists but user is not set
  useEffect(() => {
    if (token && !user) {
      getMe()
        .then((profile) => {
          setUser(profile);
        })
        .catch((err) => {
          console.error("Failed to initialize user:", err);
          // If token is invalid, clear it
          localStorage.removeItem("accessToken");
        });
    }
  }, [token, user, setUser]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col">
      <Header />
      <main className="p-6 flex-1">{children}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
