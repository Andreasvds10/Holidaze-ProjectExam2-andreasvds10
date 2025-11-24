// src/features/bookings/bookingsApi.ts
import { api } from "../../lib/api";
import type { Venue } from "./venues/venuesApi";

export type Booking = {
  id: string;
  dateFrom: string; // ISO
  dateTo: string;   // ISO
  guests: number;
  venueId: string;
  // Når vi bruker _venue=true fra API, kommer venue-objektet også
  venue?: Venue;
};

type ApiList<T> = { data: T[] };
type ApiItem<T> = { data: T };

// Alle bookings for ET spesifikt venue (brukes på VenuePage)
export function getVenueBookings(venueId: string) {
  return api<ApiList<Booking>>(
    `/holidaze/venues/${encodeURIComponent(venueId)}/bookings`
  );
}

// Opprett booking
export function createBooking(dto: {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}) {
  return api<ApiItem<Booking>>(`/holidaze/bookings`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/**
 * Hent ALLE mine bookings (den innloggede brukeren)
 * Bruker _customer=true og _venue=true for å få med venue-data.
 */
export function getMyBookings() {
  return api<ApiList<Booking>>(
    "/holidaze/bookings?_customer=true&_venue=true&limit=100&sort=dateFrom&sortOrder=asc"
  );
}
