// src/features/bookings/venues/VenuesPage.tsx
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { getVenues, type Venue } from "./venuesApi";

export default function VenuesPage() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") ?? "";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["venues", q] as const,
    queryFn: () => getVenues(q ? { q } : undefined),
    staleTime: 60_000,
  });

  const venues = (data?.data ?? []) as Venue[];

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = String(formData.get("q") ?? "").trim();

    const next = new URLSearchParams(sp);
    if (value) {
      next.set("q", value);
    } else {
      next.delete("q");
    }
    setSp(next);
  }

  const hasError = isError;
  const errorMessage =
    hasError && error instanceof Error
      ? error.message
      : hasError
      ? "Failed to load venues"
      : null;

  return (
    <div className="mx-auto max-w-6xl p-4">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Venues</h1>
          <p className="text-sm opacity-70">
            Browse available venues and filter using the search field.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-sm gap-2"
          role="search"
          aria-label="Search venues"
        >
          <input
            name="q"
            className="flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm"
            placeholder="Search by name or city"
            defaultValue={q}
          />
          <button
            type="submit"
            className="rounded-xl bg-black px-4 py-2 text-sm text-white"
          >
            Search
          </button>
        </form>
      </header>

      {/* Loading / error / empty */}
      {isLoading && <p>Loading…</p>}

      {errorMessage && (
        <p className="text-red-600">
          {errorMessage}
        </p>
      )}

      {!isLoading && !hasError && venues.length === 0 && (
        <p className="opacity-70">
          {q
            ? `No venues found matching “${q}”. Try another search term.`
            : "No venues available at the moment."}
        </p>
      )}

      {/* Venues grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((v) => (
          <Link
            key={v.id}
            to={`/venues/${v.id}`}
            className="rounded-2xl border border-black/10 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <img
              className="aspect-[16/10] w-full rounded-lg object-cover"
              src={v.media?.[0]?.url || "https://picsum.photos/640/400"}
              alt={v.media?.[0]?.alt || v.name}
            />
            <div className="mt-2 font-medium">{v.name}</div>

            <div className="text-sm opacity-70">
              {v.location?.city || "—"}
              {v.location?.country ? `, ${v.location.country}` : ""}
            </div>

            <div className="mt-1 text-sm opacity-80">
              ${v.price} per night • Max {v.maxGuests} guests
            </div>

            {typeof v.rating === "number" && (
              <div className="mt-1 text-xs opacity-70">
                Rating: {v.rating.toFixed(1)} / 5
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
