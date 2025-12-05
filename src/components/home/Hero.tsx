// src/components/home/Hero.tsx
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {/* Left */}
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium ring-1 ring-black/10">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
          Handpicked stays • Noroff Holidaze
        </span>

        <h1 className="mt-4 font-display text-4xl leading-tight text-[var(--ink)] md:text-5xl lg:text-6xl">
          Find exclusive venues for your next escape
        </h1>

        <p className="mt-4 max-w-xl text-sm opacity-80 md:text-base">
          Curated spaces, transparent pricing, and a seamless booking
          experience. From city lofts to coastal villas, everything is ready
          to book in a few clicks.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/venues"
            className="inline-flex h-11 items-center rounded-full bg-[var(--ink)] px-7 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:bg-black"
          >
            Explore venues
          </Link>

          <Link
            to="/bookings"
            className="inline-flex h-11 items-center rounded-full border border-black/10 bg-white px-7 text-sm font-medium text-[var(--ink)] shadow-sm transition hover:border-black/30"
          >
            My bookings
          </Link>

          <p className="text-xs opacity-70">
            No hidden fees • Instant confirmation
          </p>
        </div>

        <Stats />
      </div>

      {/* Right */}
      <HeroImage />
    </section>
  );
}

function Stats() {
  return (
    <div className="mt-8 flex flex-wrap gap-6 text-xs md:text-sm">
      <div>
        <p className="font-semibold text-[var(--ink)]">4.8 / 5</p>
        <p className="opacity-60">Average guest rating</p>
      </div>
      <div>
        <p className="font-semibold text-[var(--ink)]">12k+</p>
        <p className="opacity-60">Nights booked</p>
      </div>
      <div>
        <p className="font-semibold text-[var(--ink)]">24/7</p>
        <p className="opacity-60">Support for hosts &amp; guests</p>
      </div>
    </div>
  );
}

function HeroImage() {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/20">
        <img
          src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Interior of an elegant living room"
          className="h-full w-full object-cover"
        />

        <p className="absolute bottom-4 right-6 text-[10px] text-white/80 drop-shadow">
          *Demo content — real data will come from the Holidaze API.
        </p>
      </div>

      {/* overlay card */}
      <div className="absolute -bottom-4 left-4 w-[70%] max-w-xs rounded-2xl bg-white/90 p-4 text-xs shadow-xl backdrop-blur">
        <p className="text-[10px] uppercase tracking-wide text-gray-500">
          Featured stay
        </p>
        <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
          Oslo City Loft
        </p>
        <p className="mt-1 text-xs opacity-75">
          From <span className="font-semibold">NOK 2 100</span> / night ·
          Sleeps 4
        </p>
        <p className="mt-1 text-xs opacity-75">
          ⭐ 4.9 · 32 verified reviews
        </p>
      </div>
    </div>
  );
}

