// src/features/bookings/MyBookingsPage.tsx
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  getMyBookings,
  createBooking,
  deleteBooking,
  type Booking,
} from "./bookingsApi";
import { useAuth } from "./Auth/store";
import { toastSuccess, toastError } from "../../components/ui/Toast";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("nb-NO");
}

function getNights(booking: Booking) {
  const start = new Date(booking.dateFrom);
  const end = new Date(booking.dateTo);
  const diffMs = end.getTime() - start.getTime();
  const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return nights <= 0 ? 1 : nights;
}

function isUpcoming(booking: Booking) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(booking.dateFrom);
  start.setHours(0, 0, 0, 0);

  return start >= today;
}

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function MyBookingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venueId, setVenueId] = useState("");
  const [dateFrom, setDateFrom] = useState(isoToday());
  const [dateTo, setDateTo] = useState(isoToday());
  const [guests, setGuests] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-bookings", user?.name],
    queryFn: () => {
      if (!user?.name) {
        throw new Error("User not logged in");
      }
      // Bruker user.name fra login for å hente riktige bookings
      return getMyBookings(user.name);
    },
    enabled: !!user?.name, // Only fetch when user is logged in and has a name
  });

  const createMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      setIsModalOpen(false);
      setVenueId("");
      setDateFrom(isoToday());
      setDateTo(isoToday());
      setGuests(1);
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toastSuccess("Booking created successfully!");
    },
    onError: (err: any) => {
      const errorMsg = err?.message ?? "Could not create booking";
      setFormError(errorMsg);
      toastError(errorMsg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toastSuccess("Booking cancelled successfully");
    },
    onError: (err: any) => {
      toastError(err?.message ?? "Could not cancel booking");
    },
  });

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-6 py-8">
        <h1 className="font-display text-3xl">My bookings</h1>
        <p>You must be logged in to view your bookings.</p>
      </div>
    );
  }

  // API-et filtrerer allerede bookings basert på customer parameter i getMyBookings()
  // Dette sikrer at kun brukerens egne bookings returneres fra API-et
  // Query-parameteren `customer=${encoded}` forteller API-et å kun returnere bookings for den innloggede brukeren
  const bookings = useMemo(() => {
    if (!data?.data || !user?.name) return [];
    
    // API-et har allerede filtrert basert på customer parameter
    // Vi returnerer dataene direkte siden API-et håndterer filtreringen
    return data.data;
  }, [data?.data, user?.name]);

  const upcoming = bookings.filter(isUpcoming).sort((a, b) =>
    new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
  );
  const past = bookings.filter((b) => !isUpcoming(b)).sort((a, b) =>
    new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime()
  );

  const totalNights = bookings.reduce((sum, b) => sum + getNights(b), 0);
  const nextTrip = upcoming[0] ?? null;

  function openModal() {
    setFormError(null);
    setIsModalOpen(true);
  }

  function handleCreateBooking() {
    if (!venueId.trim()) {
      setFormError("Venue ID is required");
      return;
    }
    if (!dateFrom || !dateTo) {
      setFormError("Both dates are required");
      return;
    }
    if (new Date(dateTo) < new Date(dateFrom)) {
      setFormError("End date must be after start date");
      return;
    }
    if (guests <= 0) {
      setFormError("Guests must be at least 1");
      return;
    }

    createMutation.mutate({
      venueId: venueId.trim(),
      dateFrom,
      dateTo,
      guests,
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      {/* HERO / HEADER */}
      <section className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Your stays
            </p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl text-[var(--ink)]">
              My bookings
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              All your upcoming and past stays in one place. Manage dates,
              review venue details, and keep track of your travels.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right text-sm sm:block">
              <p className="font-medium text-[var(--ink)]">
                {user.name ?? "Guest"}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center rounded-full bg-[var(--ink)] px-5 py-2.5 text-xs font-medium text-white shadow-lg shadow-black/20 transition hover:bg-black"
            >
              <span className="mr-2 text-lg leading-none">+</span>
              Add booking manually
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-2xl bg-[var(--bg)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Total nights
            </p>
            <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">
              {totalNights}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--bg)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Upcoming stays
            </p>
            <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">
              {upcoming.length}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--bg)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Next trip
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--ink)]">
              {nextTrip ? formatDate(nextTrip.dateFrom) : "No upcoming trips"}
            </p>
          </div>
        </div>
      </section>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-3xl border border-black/5 bg-white/95 p-5"
            >
              <div className="h-40 w-full rounded-2xl bg-gray-200 sm:h-32" />
            </div>
          ))}
        </div>
      )}

      {/* ERROR */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-sm font-medium text-red-700">
            Could not load bookings.
          </p>
          {error instanceof Error && (
            <p className="mt-1 text-xs text-red-600">{error.message}</p>
          )}
        </div>
      )}

      {/* UPCOMING BOOKINGS */}
      {!isLoading && upcoming.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-[var(--ink)]">
            Upcoming stays
          </h2>

          <div className="space-y-4">
            {upcoming.map((b) => {
              const v = b.venue;
              const media = v?.media?.[0];
              const nights = getNights(b);

              return (
                <article
                  key={b.id}
                  className="flex flex-col gap-4 rounded-3xl border border-black/5 bg-white/95 p-4 shadow-sm sm:flex-row sm:p-5"
                >
                  {/* Image */}
                  <div className="sm:w-60">
                    <div className="overflow-hidden rounded-2xl bg-gray-200">
                      {media?.url ? (
                        <img
                          src={media.url}
                          alt={media.alt ?? v?.name ?? "Venue image"}
                          className="h-40 w-full object-cover sm:h-32"
                        />
                      ) : (
                        <div className="flex h-40 items-center justify-center text-xs text-gray-500 sm:h-32">
                          No image
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Upcoming stay
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]">
                        {v?.name ?? "Unnamed venue"}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {formatDate(b.dateFrom)} → {formatDate(b.dateTo)} •{" "}
                        {nights} {nights === 1 ? "night" : "nights"}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">
                        Guests: {b.guests}
                        {v?.location?.city || v?.location?.country
                          ? ` • ${
                              v.location?.city
                                ? `${v.location.city}${
                                    v.location.country
                                      ? `, ${v.location.country}`
                                      : ""
                                  }`
                                : v.location?.country
                            }`
                          : ""}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-2 text-sm sm:items-end">
                      {v?.price && (
                        <p className="text-sm font-semibold text-[var(--ink)]">
                          NOK {v.price.toLocaleString("nb-NO")} / night
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {v?.id && (
                          <Link
                            to={`/venues/${encodeURIComponent(v.id)}`}
                            className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-xs font-medium hover:border-black/30"
                          >
                            View venue
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to cancel this booking?"
                              )
                            ) {
                              deleteMutation.mutate(b.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
                        >
                          {deleteMutation.isPending ? "Canceling…" : "Cancel"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* PAST BOOKINGS */}
      {!isLoading && past.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-[var(--ink)]">
            Past stays
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {past.map((b) => {
              const v = b.venue;
              const nights = getNights(b);

              return (
                <article
                  key={b.id}
                  className="rounded-3xl border border-black/5 bg-white/70 p-4 text-sm"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Past stay
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-[var(--ink)]">
                    {v?.name ?? "Unnamed venue"}
                  </h3>
                  <p className="mt-1 text-xs text-gray-700">
                    {formatDate(b.dateFrom)} → {formatDate(b.dateTo)} •{" "}
                    {nights} {nights === 1 ? "night" : "nights"}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    Guests: {b.guests}
                    {v?.location?.city || v?.location?.country
                      ? ` • ${
                          v.location?.city
                            ? `${v.location.city}${
                                v.location.country
                                  ? `, ${v.location.country}`
                                  : ""
                              }`
                            : v.location?.country
                        }`
                      : ""}
                  </p>

                  {v?.id && (
                    <Link
                      to={`/venues/${encodeURIComponent(v.id)}`}
                      className="mt-3 inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-xs font-medium hover:border-black/30"
                    >
                      View venue
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {!isLoading && bookings.length === 0 && (
        <section className="rounded-3xl border border-dashed border-black/10 bg-white/70 p-6 text-center text-sm text-gray-700">
          <p className="font-medium text-[var(--ink)]">No bookings yet.</p>
          <p className="mt-1">
            When you book a venue, it will appear here. You can also create one
            manually using the button above.
          </p>
        </section>
      )}

      {/* MODAL: ADD BOOKING MANUALLY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="font-display text-xl text-[var(--ink)]">
              Add booking manually
            </h2>
            <p className="mt-1 text-xs text-gray-600">
              Creates a booking for an existing venue by ID. This is mainly for
              testing and admin purposes.
            </p>

            {formError && (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {formError}
              </p>
            )}

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Venue ID
                </label>
                <input
                  type="text"
                  value={venueId}
                  onChange={(e) => setVenueId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/40"
                  placeholder="Paste a venue ID"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Guests
                </label>
                <input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) =>
                    setGuests(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/40"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 text-sm">
              <button
                type="button"
                onClick={() => !createMutation.isPending && setIsModalOpen(false)}
                className="rounded-full border border-black/10 px-4 py-2 text-xs font-medium hover:border-black/30"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateBooking}
                disabled={createMutation.isPending}
                className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-medium text-white shadow-md shadow-black/20 disabled:opacity-60"
              >
                {createMutation.isPending ? "Creating…" : "Create booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
