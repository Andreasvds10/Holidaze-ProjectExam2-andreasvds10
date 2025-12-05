// src/features/bookings/venues/VenuesPage.tsx
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { getVenues, type Venue } from "./venuesApi";

export default function VenuesPage() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") ?? "";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["venues"] as const,
    queryFn: () => getVenues(),
    staleTime: 60_000,
  });

  // Filter venues by name on client-side
  const venues = useMemo(() => {
    const allVenues = data?.data ?? [];
    if (!q.trim()) {
      return allVenues;
    }
    const searchTerm = q.toLowerCase().trim();
    return allVenues.filter((venue: Venue) =>
      venue.name.toLowerCase().includes(searchTerm)
    );
  }, [data?.data, q]);

  // Log the error so we see it in DevTools
  if (isError) {
    console.error("Failed to load venues:", error);
  }

  const errorMessage =
    isError && error instanceof Error
      ? error.message
      : isError
      ? "Failed to load venues"
      : null;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="mb-2 font-display text-4xl font-semibold text-[var(--ink)]">
          Browse Venues
        </h1>
        <p className="text-sm opacity-70">
          Discover unique accommodations for your next stay
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="search"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 pl-10 text-sm shadow-sm transition focus:border-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--ink)]/20"
            placeholder="Search venues by name..."
            defaultValue={q}
            onChange={(e) => setSp(e.target.value ? { q: e.target.value } : {})}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-black/10 bg-white p-3"
            >
              <div className="aspect-[16/10] w-full rounded-lg bg-gray-200" />
              <div className="mt-2 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-1 h-3 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Venues grid */}
      {!isLoading && !errorMessage && (
        <>
          {venues.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map((v: Venue) => (
                <Link
                  key={v.id}
                  to={`/venues/${v.id}`}
                  className="group rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:shadow-lg hover:border-black/20"
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-100">
                    {v.media?.[0]?.url ? (
                      <img
                        className="aspect-[16/10] w-full object-cover transition group-hover:scale-105"
                        src={v.media[0].url}
                        alt={v.media[0].alt || v.name}
                      />
                    ) : (
                      <div className="flex aspect-[16/10] w-full items-center justify-center text-gray-400">
                        <span className="text-sm">No image</span>
                      </div>
                    )}
                    {v.price && (
                      <div className="absolute bottom-2 right-2 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-[var(--ink)] backdrop-blur">
                        NOK {v.price.toLocaleString("nb-NO")}/night
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-[var(--ink)] group-hover:underline">
                      {v.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {v.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      {v.location?.city && (
                        <>
                          <span>📍</span>
                          <span>
                            {v.location.city}
                            {v.location.country && `, ${v.location.country}`}
                          </span>
                        </>
                      )}
                    </div>
                    {v.rating && (
                      <div className="mt-2 flex items-center gap-1 text-xs">
                        <span>⭐</span>
                        <span className="font-medium">{v.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-black/10 bg-white/70 p-8 text-center">
              <p className="font-medium text-[var(--ink)]">
                No venues found
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {q
                  ? "Try adjusting your search terms"
                  : "Check back later for new venues"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
