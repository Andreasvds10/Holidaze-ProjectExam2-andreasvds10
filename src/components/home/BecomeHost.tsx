import { Link } from "react-router-dom";

export default function BecomeHost() {
  return (
    <section className="rounded-3xl border border-black/5 bg-gradient-to-br from-[var(--gold)]/80 to-[var(--gold)] p-8 sm:p-10 lg:p-12 shadow-sm text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl md:text-4xl leading-tight">
          Become a Holidaze Host
        </h2>
        <p className="mt-4 text-base opacity-90 md:text-lg">
          Earn extra income by sharing your unique space with travelers around the world. List your venue with Holidaze today!
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/register?manager=true"
            className="inline-flex h-12 items-center rounded-full bg-white px-8 text-sm font-medium text-[var(--ink)] shadow-lg shadow-black/20 transition hover:bg-gray-100"
          >
            Learn more
          </Link>
          <Link
            to="/manager/venues/create"
            className="inline-flex h-12 items-center rounded-full border border-white/30 px-8 text-sm font-medium text-white shadow-sm transition hover:border-white/60"
          >
            List your venue
          </Link>
        </div>
      </div>
    </section>
  );
}
