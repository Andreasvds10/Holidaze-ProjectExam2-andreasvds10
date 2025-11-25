// src/shared/Layout.tsx
import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/bookings/Auth/store";

export default function Layout({ children }: { children: ReactNode }) {
  const { user, setToken, setUser } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    // Fjern kun access token
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-3">
        <Link to="/" className="font-display text-xl font-semibold">
          Holidaze
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {/* Always visible */}
          <NavLink
            to="/venues"
            className={({ isActive }) =>
              isActive ? "font-medium underline" : "hover:underline"
            }
          >
            Venues
          </NavLink>

          {/* Visible only when logged in */}
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

          {/* Venue manager only */}
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

          {/* Right side: auth controls */}
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "font-medium underline" : "hover:underline"
                }
              >
                {user.name}
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/5"
              >
                Log out
              </button>
            </>
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
