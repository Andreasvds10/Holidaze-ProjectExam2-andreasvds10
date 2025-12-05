// src/features/manager/VenueBookingsPage.tsx
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getVenueBookings, type Booking } from "../bookings/bookingsApi";
import { getVenueById } from "../bookings/venues/venuesApi";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isUpcoming(booking: Booking) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(booking.dateTo);
  end.setHours(0, 0, 0, 0);
  return end >= today;
}

export default function VenueBookingsPage() {
  const { id = "" } = useParams();

  const venue = useQuery({
    queryKey: ["venue", id],
    queryFn: () => getVenueById(id),
    enabled: !!id,
  });

  const bookings = useQuery({
    queryKey: ["venue-bookings", id],
    queryFn: () => getVenueBookings(id),
    enabled: !!id,
  });

  if (venue.isLoading || bookings.isLoading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <p>Loading…</p>
      </div>
    );
  }

  if (venue.error || bookings.error) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <p className="text-red-600">Failed to load venue or bookings.</p>
      </div>
    );
  }

  const v = venue.data!.data;
  const allBookings = bookings.data?.data ?? [];
  const upcoming = allBookings.filter(isUpcoming);
  const past = allBookings.filter((b) => !isUpcoming(b));

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <Link
          to="/manager/venues"
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to venues
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Bookings for {v.name}
        </h1>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white/90 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Total bookings
          </p>
          <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">
            {allBookings.length}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white/90 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Upcoming
          </p>
          <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">
            {upcoming.length}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white/90 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Past bookings
          </p>
          <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">
            {past.length}
          </p>
        </div>
      </div>

      {/* Upcoming bookings */}
      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 font-display text-2xl text-[var(--ink)]">
            Upcoming bookings
          </h2>
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-black/10 bg-white/95 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">
                      {formatDate(booking.dateFrom)} → {formatDate(booking.dateTo)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.guests} guest{booking.guests === 1 ? "" : "s"}
                      {booking.customer && (
                        <> • Booked by {booking.customer.name}</>
                      )}
                      {booking.customer?.email && (
                        <> ({booking.customer.email})</>
                      )}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-[var(--ink)]">
                      Booking ID: {booking.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past bookings */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-2xl text-[var(--ink)]">
            Past bookings
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {past.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-black/5 bg-white/70 p-4 text-sm"
              >
                <p className="font-semibold text-[var(--ink)]">
                  {formatDate(booking.dateFrom)} → {formatDate(booking.dateTo)}
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  {booking.guests} guest{booking.guests === 1 ? "" : "s"}
                  {booking.customer && <> • {booking.customer.name}</>}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {allBookings.length === 0 && (
        <div className="rounded-xl border border-dashed border-black/10 bg-white/70 p-6 text-center">
          <p className="font-medium text-[var(--ink)]">No bookings yet.</p>
          <p className="mt-1 text-sm text-gray-600">
            When customers book this venue, bookings will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

