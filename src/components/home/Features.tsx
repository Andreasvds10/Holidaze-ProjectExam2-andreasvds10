// src/components/home/Features.tsx
export default function Features() {
  return (
    <section className="rounded-3xl border border-black/5 bg-white/80 p-6 sm:p-8 lg:p-10 shadow-sm">
      <div className="grid gap-8 lg:grid-cols-3">
        <div>
          <h2 className="font-display text-xl text-[var(--ink)]">
            Why choose Holidaze?
          </h2>
          <p className="mt-3 text-sm opacity-75">
            Experience seamless booking and discover exceptional venues, all powered by the robust Noroff Holidaze API.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-[var(--ink)]">
            <span className="mr-2 text-lg">✅</span> Verified Venues
          </p>
          <p className="opacity-75">
            Book with confidence. All our venues are thoroughly vetted, ensuring quality and peace of mind for every stay.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-[var(--ink)]">
            <span className="mr-2 text-lg">✨</span> Transparent Bookings
          </p>
          <p className="opacity-75">
            No surprises. See all available dates and pricing upfront, and manage your upcoming stays with clarity.
          </p>
        </div>
      </div>
    </section>
  );
}

