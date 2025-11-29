// src/shared/Layout.tsx
import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/bookings/Auth/store";

export default function Layout({ children }: { children: ReactNode }) {
  const { user, setToken, setUser } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <header className="flex items-center justify-between border-b border-black/10 bg-white/80 px-6 py-3 backdrop-blur">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-[var(--ink)]"
        >
          Holidaze
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/venues"
            className={({ isActive }) =>
              isActive ? "font-medium underline" : "hover:underline"
            }
          >
            Venues
          </NavLink>

          {user && (
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                isActive ? "font-medium underline" : "hover:underline"
              }
            >
              My bookings
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "font-medium underline" : "hover:underline"
              }
            >
              {user.name ?? "Profile"}
            </NavLink>
          )}

          {user?.venueManager && (
            <NavLink
              to="/manager/venues"
              className={({ isActive }) =>
                isActive ? "font-medium underline" : "hover:underline"
              }
            >
              Manager
            </NavLink>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium hover:border-black/30"
            >
              Log out
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "font-medium underline" : "hover:underline"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "font-medium underline" : "hover:underline"
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
