// src/routes/App.tsx
import { Routes, Route, Link } from "react-router-dom";
import Layout from "../shared/Layout";

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

function Home() {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium ring-1 ring-black/10">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          Premium stays, effortless bookings
        </span>

        <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
          Find exclusive venues for your next escape
        </h1>

        <p className="mt-4 max-w-xl text-sm opacity-80 md:text-base">
          Curated spaces, transparent pricing, and a seamless booking
          experience.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            to="/venues"
            className="inline-flex h-11 items-center rounded-full bg-brand-ink px-6 text-white shadow-card transition hover:bg-black"
          >
            Explore venues
          </Link>

          <Link
            to="/bookings"
            className="inline-flex h-11 items-center rounded-full border border-black/10 bg-white px-6 transition hover:border-black/20"
          >
            My bookings
          </Link>
        </div>
      </div>

      <div className="order-first lg:order-last">
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-2xl bg-brand-gold/10 blur-2xl" />
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-card">
            <img
              src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop"
              alt="Exclusive venue"
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        </div>
        <p className="mt-3 text-xs opacity-60">
          *Demo content — real data will come from the Holidaze API.
        </p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/venues/:id" element={<VenuePage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer */}
        <Route path="/bookings" element={<MyBookingsPage />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Venue manager */}
        <Route path="/manager/venues" element={<ManagerVenuesPage />} />
        <Route path="/manager/venues/new" element={<CreateVenuePage />} />
        <Route path="/manager/venues/:id/edit" element={<EditVenuePage />} />

        {/* 404 fallback */}
        <Route path="*" element={<div className="p-6">Not found</div>} />
      </Routes>
    </Layout>
  );
}
