// src/shared/RequireAuth.tsx
import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/bookings/Auth/store";

type Props = {
  children: ReactElement;
};

export function RequireAuth({ children }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // sender brukeren til login, men husker hvor de kom fra
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export function RequireManager({ children }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user.venueManager) {
    // Ikke manager → bare send dem hjem
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
