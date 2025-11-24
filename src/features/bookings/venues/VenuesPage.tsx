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

  const venues = data?.data ?? [];

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
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-4">
        <input
          className="w-full rounded-xl border border-black/10 px-3 py-2"
          placeholder="Search venues"
          defaultValue={q}
          onChange={(e) => setSp(e.target.value ? { q: e.target.value } : {})}
        />
      </div>

      {isLoading && <p>Loading…</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((v: Venue) => (
          <Link
            key={v.id}
            to={`/venues/${v.id}`}
            className="rounded-2xl border border-black/10 bg-white p-3 hover:shadow-card"
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
          </Link>
        ))}
      </div>
    </div>
  );
}
