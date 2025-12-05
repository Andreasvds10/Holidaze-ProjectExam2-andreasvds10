// src/features/bookings/venues/VenuePage.tsx
import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getVenueById, type Venue, type Booking } from "./venuesApi";
import { createBooking } from "../bookingsApi";
import { toBlockedSet } from "../blockedDates";
import { useAuth } from "../Auth/store";
import { toastSuccess, toastError } from "../../../components/ui/Toast";
import BookingCalendar from "../../../components/booking/BookingCalendar";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export default function VenuePage() {
  const { id = "" } = useParams();
  const { token } = useAuth();
  const qc = useQueryClient();

  const [dateFrom, setFrom] = useState("");
  const [dateTo, setTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [err, setErr] = useState<string | null>(null);

  const venue = useQuery({
    queryKey: ["venue", id],
    queryFn: () => getVenueById(id),
    enabled: !!id,
  });

  // Bruk bookings direkte fra venue-responsen
  const blocked = useMemo(
    () =>
      toBlockedSet(
        (((venue.data?.data as Venue | undefined)?.bookings ?? []) as Booking[])
      ),
    [venue.data]
  );

  // Calculate nights and total price
  const nights = useMemo(() => {
    if (!dateFrom || !dateTo) return 0;
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    if (to <= from) return 0;
    return Math.ceil((to.getTime() - from.getTime()) / 86400000);
  }, [dateFrom, dateTo]);

  const totalPrice = useMemo(() => {
    if (!venue.data?.data || nights === 0) return 0;
    const v = venue.data.data as Venue;
    return v.price * nights;
  }, [venue.data, nights]);

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      // Hent venue på nytt så nye bookings vises
      qc.invalidateQueries({ queryKey: ["venue", id] });
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      toastSuccess("Booking created successfully! View it in My Bookings.");
      setFrom("");
      setTo("");
      setGuests(1);
    },
    onError: (e: any) => {
      const errorMsg = e?.message || "Could not create booking";
      setErr(errorMsg);
      toastError(errorMsg);
    },
  });

  if (venue.isLoading)
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-64 w-full rounded-xl bg-gray-200" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
        </div>
      </div>
    );
  if (venue.error)
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">Failed to load venue</p>
          <Link
            to="/venues"
            className="mt-4 inline-block text-sm text-red-600 underline"
          >
            Back to venues
          </Link>
        </div>
      </div>
    );

  const v = venue.data!.data as Venue;

  const submit = () => {
    setErr(null);

    if (!token) return setErr("You must log in before booking.");
    if (!dateFrom || !dateTo) return setErr("Choose both dates.");

    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (to <= from) return setErr("End date must be after start date.");

    // Validate guests
    if (guests < 1) return setErr("Number of guests must be at least 1.");
    if (guests > v.maxGuests) {
      return setErr(
        `Maximum ${v.maxGuests} guest${v.maxGuests === 1 ? "" : "s"} allowed.`
      );
    }

    // Check for blocked dates
    for (let i = 0; i < nights; i++) {
      const day = iso(addDays(from, i));
      if (blocked.has(day)) {
        return setErr("Selected dates include blocked days.");
      }
    }

    mutation.mutate({
      dateFrom: iso(from),
      dateTo: iso(to),
      guests,
      venueId: id,
    });
  };

  const minDate = iso(new Date());

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Main content */}
        <div className="space-y-8">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl">
            <img
              className="aspect-[16/9] w-full object-cover"
              src={v.media?.[0]?.url || "https://picsum.photos/1200/675"}
              alt={v.media?.[0]?.alt || v.name}
            />
          </div>

          {/* Title and description */}
          <div className="mt-6">
            <h1 className="font-display text-4xl font-semibold text-[var(--ink)]">
              {v.name}
            </h1>
            {v.description && (
              <p className="mt-3 text-base leading-relaxed opacity-80">
                {v.description}
              </p>
            )}
          </div>

          {/* Location */}
          {v.location && (
            <div className="mt-6 flex items-center gap-2 text-sm opacity-70">
              <span>📍</span>
              <span>
                {[
                  v.location.address,
                  v.location.city,
                  v.location.zip,
                  v.location.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}

          {/* Meta info */}
          {v.meta && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {v.meta.wifi && (
                <div className="flex items-center gap-2 text-sm">
                  <span>📶</span>
                  <span>WiFi</span>
                </div>
              )}
              {v.meta.parking && (
                <div className="flex items-center gap-2 text-sm">
                  <span>🅿️</span>
                  <span>Parking</span>
                </div>
              )}
              {v.meta.breakfast && (
                <div className="flex items-center gap-2 text-sm">
                  <span>🍳</span>
                  <span>Breakfast</span>
                </div>
              )}
              {v.meta.pets && (
                <div className="flex items-center gap-2 text-sm">
                  <span>🐾</span>
                  <span>Pets allowed</span>
                </div>
              )}
            </div>
          )}

          {/* Rating */}
          {v.rating && (
            <div className="mt-6 flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span className="font-semibold">{v.rating.toFixed(1)}</span>
              <span className="text-sm opacity-70">rating</span>
            </div>
          )}

          {/* Calendar */}
          {token && (
            <div className="mt-8">
              <h2 className="mb-4 font-display text-2xl font-semibold text-[var(--ink)]">
                Availability calendar
              </h2>
              <BookingCalendar
                blockedDates={blocked}
                selected={{
                  from: dateFrom ? new Date(dateFrom) : undefined,
                  to: dateTo ? new Date(dateTo) : undefined,
                }}
                onSelect={(date: Date | undefined) => {
                  if (!date) return;
                  if (!dateFrom || (dateFrom && dateTo)) {
                    setFrom(iso(date));
                    setTo("");
                  } else if (dateFrom && !dateTo) {
                    const fromDate = new Date(dateFrom);
                    if (date > fromDate) {
                      setTo(iso(date));
                    } else {
                      setFrom(iso(date));
                      setTo("");
                    }
                  }
                }}
                minDate={new Date()}
              />
            </div>
          )}
        </div>

        {/* Booking card */}
        <div className="lg:sticky lg:top-6 lg:h-fit">
          <div className="rounded-2xl border border-black/10 bg-white/90 p-6 shadow-lg">
            <div className="mb-4">
              <p className="text-2xl font-semibold text-[var(--ink)]">
                NOK {v.price.toLocaleString("nb-NO")}
              </p>
              <p className="text-sm opacity-70">per night</p>
            </div>

            {!token ? (
              <div className="rounded-xl border border-black/10 bg-gray-50 p-4 text-center">
                <p className="mb-3 text-sm font-medium text-[var(--ink)]">
                  Log in to book
                </p>
                <Link
                  to="/login"
                  className="inline-block rounded-full bg-[var(--ink)] px-6 py-2 text-sm font-medium text-white transition hover:bg-black"
                >
                  Log in
                </Link>
              </div>
            ) : (
              <>
                {err && (
                  <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {err}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={dateFrom}
                        min={minDate}
                        onChange={(e) => {
                          setFrom(e.target.value);
                          if (e.target.value >= dateTo) {
                            setTo("");
                          }
                        }}
                        className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none transition focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--ink)]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={dateTo}
                        min={dateFrom || minDate}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none transition focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--ink)]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Guests
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 text-lg disabled:opacity-40"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={v.maxGuests}
                        value={guests}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setGuests(Math.min(v.maxGuests, Math.max(1, val)));
                        }}
                        className="flex-1 rounded-lg border border-black/10 px-3 py-2.5 text-center text-sm outline-none transition focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--ink)]/20"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setGuests(Math.min(v.maxGuests, guests + 1))
                        }
                        disabled={guests >= v.maxGuests}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 text-lg disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                    <p className="mt-1 text-xs opacity-70">
                      Max {v.maxGuests} guest{v.maxGuests === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                {/* Price breakdown */}
                {nights > 0 && (
                  <div className="my-4 border-t border-black/10 pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="opacity-70">
                          NOK {v.price.toLocaleString("nb-NO")} × {nights}{" "}
                          {nights === 1 ? "night" : "nights"}
                        </span>
                        <span className="font-medium">
                          NOK {totalPrice.toLocaleString("nb-NO")}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-black/5 pt-2 font-semibold">
                        <span>Total</span>
                        <span className="text-lg">
                          NOK {totalPrice.toLocaleString("nb-NO")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={submit}
                  disabled={mutation.isPending || !dateFrom || !dateTo}
                  className="mt-4 w-full rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Booking…" : "Book now"}
                </button>

                <p className="mt-3 text-center text-xs opacity-60">
                  No hidden fees • Instant confirmation
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
