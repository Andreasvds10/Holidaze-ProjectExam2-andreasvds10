// src/features/bookings/bookingsApi.ts
import { api } from "../../lib/api";
import type { Venue } from "./venues/venuesApi";

export type Customer = {
  name: string;
  email: string;
  bio?: string;
  avatar?: { url: string; alt?: string } | null;
  banner?: { url: string; alt?: string } | null;
};

export type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
  created?: string;
  updated?: string;
  venue?: Venue;
  customer?: Customer; // Inkludert når _customer=true
};

type ApiList<T> = { data: T[] };
type ApiItem<T> = { data: T };

/**
 * Henter alle bookings for et spesifikt venue.
 * Brukes av venue managers for å se bookings for sine venues.
 */
export function getVenueBookings(venueId: string) {
  return api<ApiList<Booking>>(
    `/holidaze/venues/${encodeURIComponent(venueId)}/bookings?_customer=true`
  );
}

/**
 * Henter en enkelt booking basert på ID.
 */
export function getBookingById(bookingId: string) {
  return api<ApiItem<Booking>>(
    `/holidaze/bookings/${encodeURIComponent(bookingId)}?_venue=true&_customer=true`
  );
}

/**
 * Oppretter en ny booking.
 */
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
 * Oppdaterer en eksisterende booking.
 */
export function updateBooking(
  bookingId: string,
  dto: {
    dateFrom?: string;
    dateTo?: string;
    guests?: number;
  }
) {
  return api<ApiItem<Booking>>(
    `/holidaze/bookings/${encodeURIComponent(bookingId)}`,
    {
      method: "PUT",
      body: JSON.stringify(dto),
    }
  );
}

/**
 * Sletter en booking.
 */
export function deleteBooking(bookingId: string) {
  return api<void>(`/holidaze/bookings/${encodeURIComponent(bookingId)}`, {
    method: "DELETE",
  });
}

/**
 * Henter kun brukerens egne bookings fra API-et.
 * Bruker riktig endpoint: /holidaze/profiles/{name}/bookings
 * 
 * @param profileName - Brukernavnet fra login (hentet fra user.name i store)
 */
export function getMyBookings(profileName: string) {
  if (!profileName) {
    throw new Error("Profile name is required");
  }

  const encoded = encodeURIComponent(profileName);

  // Bruker riktig endpoint for å hente bookings for en profil
  // Dette er den korrekte måten ifølge API-dokumentasjonen
  return api<ApiList<Booking>>(
    `/holidaze/profiles/${encoded}/bookings?_venue=true&limit=100&sort=dateFrom&sortOrder=asc`
  );
}
