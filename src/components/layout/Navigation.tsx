// src/components/layout/Navigation.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/bookings/Auth/store";

export default function Navigation() {
  const { user, setToken, setUser } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
    navigate("/");
  }

  return (
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
  );
}

