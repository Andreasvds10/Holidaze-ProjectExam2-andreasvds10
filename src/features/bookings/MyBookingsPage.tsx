// src/features/bookings/MyBookingsPage.tsx
import { useQuery } from "@tanstack/react-query";
import { getMyBookings, type Booking } from "./bookingsApi";
import { useAuth } from "./Auth/store";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString();
}

export default function MyBookingsPage() {
  const { user } = useAuth();

  if (!user) {
    return <p className="p-4 text-red-600">You must be logged in to see your bookings.</p>;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myBookings"],
    queryFn: getMyBookings,
  });

  const bookings = data?.data ?? [];

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-3xl font-semibold">My bookings</h1>

      {isLoading && <p>Loading bookings…</p>}
      {isError && (
        <p className="text-red-600">
          Failed to load bookings. Please try again later.
        </p>
      )}

      {bookings.length === 0 && !isLoading && !isError && (
        <p className="opacity-70">You don&apos;t have any bookings yet.</p>
      )}

      <div className="mt-4 space-y-3">
        {bookings.map((b: Booking) => (
          <div
            key={b.id}
            className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"
          >
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  {formatDate(b.dateFrom)} → {formatDate(b.dateTo)}
                </p>
                <p className="text-xs opacity-70">Guests: {b.guests}</p>
              </div>
              {b.venue && (
                <div className="text-right">
                  <p className="text-sm font-semibold">{b.venue.name}</p>
                  {b.venue.location?.city && (
                    <p className="text-xs opacity-70">
                      {b.venue.location.city}
                      {b.venue.location.country
                        ? `, ${b.venue.location.country}`
                        : ""}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
