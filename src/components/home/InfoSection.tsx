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
          Join thousands of happy travelers who have found their ideal getaway with Holidaze. Your next adventure is just a click away.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/venues"
            className="inline-flex h-12 items-center rounded-full bg-[var(--ink)] px-8 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:bg-black"
          >
            Explore all venues
          </Link>
          <Link
            to="/register"
            className="inline-flex h-12 items-center rounded-full border border-black/10 bg-white px-8 text-sm font-medium text-[var(--ink)] shadow-sm transition hover:border-black/30"
          >
            Create an account
          </Link>
        </div>

        {/* Testimonial Placeholder */}
        <div className="mt-12 mx-auto max-w-2xl text-center p-6 bg-white/70 rounded-2xl border border-black/5 shadow-inner">
          <p className="text-lg font-display italic text-[var(--ink)]">
            "Holidaze made finding our dream vacation spot incredibly easy. The selection was amazing, and the booking process was flawless!"
          </p>
          <p className="mt-4 text-sm font-medium text-gray-600">— Happy Customer</p>
        </div>
      </div>
    </section>
  );
}

