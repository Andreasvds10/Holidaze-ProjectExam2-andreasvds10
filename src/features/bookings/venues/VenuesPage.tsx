// src/features/bookings/venues/VenuesPage.tsx
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { getVenues, type Venue } from "./venuesApi";

export default function VenuesPage() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") ?? "";
  const sort = sp.get("sort") ?? "";
  const city = sp.get("city") ?? "";
  const country = sp.get("country") ?? "";
  const guests = sp.get("guests") ?? "";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["venues"] as const,
    queryFn: () => getVenues(),
    staleTime: 60_000,
  });

  // Filter and sort venues on client-side
  const venues = useMemo(() => {
    const allVenues = data?.data ?? [];
    let filteredVenues = allVenues;

    if (q.trim()) {
      const searchTerm = q.toLowerCase().trim();
      filteredVenues = filteredVenues.filter((venue: Venue) =>
        venue.name.toLowerCase().includes(searchTerm)
      );
    }

    if (city.trim()) {
      const searchCity = city.toLowerCase().trim();
      filteredVenues = filteredVenues.filter((venue: Venue) =>
        venue.location?.city?.toLowerCase().includes(searchCity)
      );
    }

    if (country.trim()) {
      const searchCountry = country.toLowerCase().trim();
      filteredVenues = filteredVenues.filter((venue: Venue) =>
        venue.location?.country?.toLowerCase().includes(searchCountry)
      );
    }

    if (guests) {
      const guestCount = parseInt(guests, 10);
      if (!isNaN(guestCount)) {
        filteredVenues = filteredVenues.filter((venue: Venue) =>
          venue.maxGuests ? venue.maxGuests >= guestCount : true
        );
      }
    }

    // Apply sorting
    if (sort) {
      return [...filteredVenues].sort((a: Venue, b: Venue) => {
        switch (sort) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "price-asc":
            return (a.price || 0) - (b.price || 0);
          case "price-desc":
            return (b.price || 0) - (a.price || 0);
          case "rating-desc":
            return (b.rating || 0) - (a.rating || 0);
          case "rating-asc":
            return (a.rating || 0) - (b.rating || 0);
          default:
            return 0;
        }
      });
    }

    return filteredVenues;
  }, [data?.data, q, sort, city, country, guests]);

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
            onChange={(e) =>
              setSp((prev) => {
                if (e.target.value) {
                  prev.set("q", e.target.value);
                } else {
                  prev.delete("q");
                }
                return prev;
              })
            }
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          className="w-full sm:w-auto rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--ink)]/20"
          placeholder="City..."
          defaultValue={city}
          onChange={(e) =>
            setSp((prev) => {
              if (e.target.value) {
                prev.set("city", e.target.value);
              } else {
                prev.delete("city");
              }
              return prev;
            })
          }
        />
        <input
          type="text"
          className="w-full sm:w-auto rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--ink)]/20"
          placeholder="Country..."
          defaultValue={country}
          onChange={(e) =>
            setSp((prev) => {
              if (e.target.value) {
                prev.set("country", e.target.value);
              } else {
                prev.delete("country");
              }
              return prev;
            })
          }
        />
        <input
          type="number"
          className="w-full sm:w-auto rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--ink)]/20"
          placeholder="Guests..."
          defaultValue={guests}
          min="1"
          onChange={(e) =>
            setSp((prev) => {
              if (e.target.value) {
                prev.set("guests", e.target.value);
              } else {
                prev.delete("guests");
              }
              return prev;
            })
          }
        />
      </div>

      {/* Sort */}
      <div className="mb-6 flex justify-end">
        <select
          className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--ink)]/20"
          value={sort}
          onChange={(e) =>
            setSp((prev) => {
              if (e.target.value) {
                prev.set("sort", e.target.value);
              } else {
                prev.delete("sort");
              }
              return prev;
            })
          }
        >
          <option value="">Sort by</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="rating-desc">Rating (High to Low)</option>
          <option value="rating-asc">Rating (Low to High)</option>
        </select>
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
