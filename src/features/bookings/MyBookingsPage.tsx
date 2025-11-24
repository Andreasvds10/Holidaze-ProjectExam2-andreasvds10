// src/features/bookings/MyBookingsPage.tsx
import { useQuery } from "@tanstack/react-query";
import { getMyBookings, type Booking } from "./bookingsApi";
import { useAuth } from "./Auth/store";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString();
}

function isUpcoming(b: Booking) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(b.dateTo);
  end.setHours(0, 0, 0, 0);
  return end >= today;
}

export default function MyBookingsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <p className="p-4 text-red-600">
        You must be logged in to see your bookings.
      </p>
    );
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myBookings"],
    queryFn: getMyBookings,
  });

  const all = (data?.data ?? []) as Booking[];
  const upcoming = all.filter(isUpcoming);
  const past = all.filter((b) => !isUpcoming(b));

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-3xl font-semibold">My bookings</h1>

      {isLoading && <p>Loading bookings…</p>}
      {isError && (
        <p className="text-red-600">
          Failed to load bookings. Please try again later.
        </p>
      )}

      {!isLoading && !isError && upcoming.length === 0 && all.length === 0 && (
        <p className="opacity-70">You don&apos;t have any bookings yet.</p>
      )}

      {/* Upcoming bookings */}
      {upcoming.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-2 text-lg font-semibold">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map((b) => (
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
                  {(b as any).venue && (
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {(b as any).venue.name}
                      </p>
                      {(b as any).venue.location?.city && (
                        <p className="text-xs opacity-70">
                          {(b as any).venue.location.city}
                          {(b as any).venue.location.country
                            ? `, ${(b as any).venue.location.country}`
                            : ""}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past bookings */}
      {past.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold opacity-70">
            Past bookings
          </h2>
          <div className="space-y-3">
            {past.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-black/10 bg-white p-3 text-xs opacity-80"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p>
                      {formatDate(b.dateFrom)} → {formatDate(b.dateTo)}
                    </p>
                    <p>Guests: {b.guests}</p>
                  </div>
                  {(b as any).venue && (
                    <div className="text-right">
                      <p className="font-medium">
                        {(b as any).venue.name}
                      </p>
                      {(b as any).venue.location?.city && (
                        <p>
                          {(b as any).venue.location.city}
                          {(b as any).venue.location.country
                            ? `, ${(b as any).venue.location.country}`
                            : ""}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
