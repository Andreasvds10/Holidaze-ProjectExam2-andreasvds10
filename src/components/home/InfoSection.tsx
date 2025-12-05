// src/components/home/InfoSection.tsx
import { Link } from "react-router-dom";

export default function InfoSection() {
  return (
    <section className="rounded-3xl border border-black/5 bg-gradient-to-br from-white/90 to-white/60 p-8 sm:p-10 lg:p-12 shadow-sm">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl text-[var(--ink)] md:text-4xl">
          Ready to find your perfect stay?
        </h2>
        <p className="mt-4 text-base opacity-80 md:text-lg">
          Browse through our curated collection of exclusive venues. From
          modern city apartments to serene countryside retreats, we have
          something for every traveler. Start exploring and book your next
          adventure today.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/venues"
            className="inline-flex h-12 items-center rounded-full bg-[var(--ink)] px-8 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:bg-black"
          >
            Browse all venues
          </Link>
          <Link
            to="/register"
            className="inline-flex h-12 items-center rounded-full border border-black/10 bg-white px-8 text-sm font-medium text-[var(--ink)] shadow-sm transition hover:border-black/30"
          >
            Create an account
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--ink)]">500+</div>
            <div className="mt-1 text-xs opacity-70">Verified venues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--ink)]">50+</div>
            <div className="mt-1 text-xs opacity-70">Cities worldwide</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--ink)]">98%</div>
            <div className="mt-1 text-xs opacity-70">Satisfaction rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--ink)]">24/7</div>
            <div className="mt-1 text-xs opacity-70">Customer support</div>
          </div>
        </div>
      </div>
    </section>
  );
}

