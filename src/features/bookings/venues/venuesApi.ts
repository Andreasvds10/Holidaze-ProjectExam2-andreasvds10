// src/features/bookings/venues/venuesApi.ts
import { api } from "../../../lib/api";

export type Media = {
  url: string;
  alt?: string;
};

export type Location = {
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  continent?: string;
  lat?: number;
  lng?: number;
};

export type Meta = {
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
};

export type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
};

export type Venue = {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: Meta;
  location?: Location;
  created?: string;
  updated?: string;
  bookings?: Booking[]; // når vi bruker _bookings=true
};

type ApiList<T> = { data: T[] };
type ApiItem<T> = { data: T };

export type VenueQuery = {
  q?: string;
  limit?: number;
  page?: number;
  sort?: string;
  sortOrder?: "asc" | "desc";
};

// LISTE AV VENUES (public + søk) – brukes av VenuesPage
export function getVenues(params?: VenueQuery) {
  let url = "/holidaze/venues";

  if (params) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      searchParams.append(key, String(value));
    });

    const qs = searchParams.toString();
    if (qs) {
      url += `?${qs}`;
    }
  }

  return api<ApiList<Venue>>(url);
}

// SINGLE VENUE MED BOOKINGS – brukes av VenuePage
export function getVenueById(id: string) {
  const encoded = encodeURIComponent(id);
  const url = `/holidaze/venues/${encoded}?_bookings=true`;

  return api<ApiItem<Venue & { bookings?: Booking[] }>>(url);
}

// ALLE VENUES FOR EN PROFIL (Venue Manager dashboard) – brukes av ManagerVenuesPage
export function getMyVenues(profileName: string) {
  return api<ApiList<Venue>>(
    `/holidaze/profiles/${encodeURIComponent(
      profileName
    )}/venues?_bookings=true`
  );
}

// Payload for create/update
export type VenuePayload = {
  name: string;
  description: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  meta?: Meta;
  location?: Location;
};

// CREATE VENUE – brukes av ManagerVenuesPage
export function createVenue(dto: VenuePayload) {
  return api<ApiItem<Venue>>(`/holidaze/venues`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

// UPDATE VENUE – brukes av ManagerVenuesPage
export function updateVenue(id: string, dto: Partial<VenuePayload>) {
  return api<ApiItem<Venue>>(
    `/holidaze/venues/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(dto),
    }
  );
}

// DELETE VENUE – brukes av ManagerVenuesPage
export function deleteVenue(id: string) {
  return api<void>(
    `/holidaze/venues/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}
