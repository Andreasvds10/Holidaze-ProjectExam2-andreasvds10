// src/routes/App.tsx
import type { ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../shared/Layout";
import { RequireAuth, RequireManager } from "../shared/RequireAuth";

// Pages
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";

// Auth pages
import LoginPage from "../features/bookings/Auth/loginPage";
import RegisterPage from "../features/bookings/Auth/registerPage";

// Customer features
import MyBookingsPage from "../features/bookings/MyBookingsPage";

// Venues (list + detail)
import VenuesPage from "../features/bookings/venues/VenuesPage";
import VenuePage from "../features/bookings/venues/VenuePage";

// Profile
import ProfilePage from "../features/bookings/profile/ProfilePage";

// Manager
import ManagerVenuesPage from "../features/manager/ManagerVenuesPage";
import CreateVenuePage from "../features/manager/CreateVenuePage";
import EditVenuePage from "../features/manager/EditVenuePage";
import VenueBookingsPage from "../features/manager/VenueBookingsPage";

export default function App(): ReactElement {
  return (
    <Layout>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/venues/:id" element={<VenuePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated */}
        <Route
          path="/bookings"
          element={
            <RequireAuth>
              <MyBookingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        {/* Manager */}
        <Route
          path="/manager/venues"
          element={
            <RequireManager>
              <ManagerVenuesPage />
            </RequireManager>
          }
        />
        <Route
          path="/manager/venues/new"
          element={
            <RequireManager>
              <CreateVenuePage />
            </RequireManager>
          }
        />
        <Route
          path="/manager/venues/:id/edit"
          element={
            <RequireManager>
              <EditVenuePage />
            </RequireManager>
          }
        />
        <Route
          path="/manager/venues/:id/bookings"
          element={
            <RequireManager>
              <VenueBookingsPage />
            </RequireManager>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
