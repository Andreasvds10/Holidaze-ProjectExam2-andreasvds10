// src/features/bookings/venues/VenuePage.tsx
import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getVenueById, type Venue, type Booking } from "./venuesApi";
import { createBooking } from "../bookingsApi";
import { toBlockedSet } from "../blockedDates";
import { useAuth } from "../Auth/store";

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

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      // Hent venue på nytt så nye bookings vises
      qc.invalidateQueries({ queryKey: ["venue", id] });
      alert("Booking created");
    },
    onError: (e: any) => setErr(e?.message || "Could not book."),
  });

  if (venue.isLoading) return <p className="p-4">Loading…</p>;
  if (venue.error)
    return <p className="p-4 text-red-600">Failed to load venue</p>;

  const v = venue.data!.data as Venue;

  const submit = () => {
    setErr(null);

    if (!token) return setErr("You must log in before booking.");
    if (!dateFrom || !dateTo) return setErr("Choose both dates.");

    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (to <= from) return setErr("End date must be after start date.");

    const nights = Math.ceil((to.getTime() - from.getTime()) / 86400000);

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

  return (
    <div className="mx-auto max-w-4xl p-4">
      <img
        className="aspect-[16/9] w-full rounded-xl object-cover"
        src={v.media?.[0]?.url || "https://picsum.photos/1200/675"}
        alt={v.media?.[0]?.alt || v.name}
      />

      <h1 className="mt-4 text-3xl font-semibold">{v.name}</h1>
      {v.description && <p className="mt-2 opacity-80">{v.description}</p>}

      <div className="mt-6 rounded-xl border border-black/10 bg-white p-4">
        <h2 className="mb-3 text-xl font-medium">Book this venue</h2>

        {err && (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm">Guests</label>
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={mutation.isPending}
          className="mt-4 rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {mutation.isPending ? "Booking…" : "Book"}
        </button>
      </div>
    </div>
  );
}
