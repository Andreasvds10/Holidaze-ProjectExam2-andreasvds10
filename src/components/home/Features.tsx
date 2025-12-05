// src/components/home/Features.tsx
export default function Features() {
  return (
    <section className="rounded-3xl border border-black/5 bg-white/80 p-6 sm:p-8 lg:p-10 shadow-sm">
      <div className="grid gap-8 lg:grid-cols-3">
        <div>
          <h2 className="font-display text-xl text-[var(--ink)]">
            Why book with Holidaze?
          </h2>
          <p className="mt-3 text-sm opacity-75">
            Built for your exam, styled like a premium booking platform.
            Every venue, booking and profile is powered by the Noroff Holidaze
            API.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-[var(--ink)]">Verified venues</p>
          <p className="opacity-75">
            Hosts manage their own listings, and venue managers can update,
            edit and create venues directly from the platform.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-[var(--ink)]">
            Transparent bookings
          </p>
          <p className="opacity-75">
            See available dates, blocked dates and your upcoming stays in one
            place, with no surprise addons during checkout.
          </p>
        </div>
      </div>
    </section>
  );
}

