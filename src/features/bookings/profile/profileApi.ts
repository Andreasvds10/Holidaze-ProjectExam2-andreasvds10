// src/features/bookings/profile/profileApi.ts
import { api } from "../../../lib/api";

export type ProfileAvatar = {
  url: string;
  alt?: string;
};

export type ProfileVenue = {
  id: string;
  name: string;
  description?: string;
  media?: { url: string; alt: string }[];
  price: number;
  maxGuests: number;
};

export type ProfileBooking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue?: {
    id: string;
    name: string;
  };
};

export type Profile = {
  name: string;
  email: string;
  avatar?: ProfileAvatar | null;
  banner?: {
    url: string;
    alt?: string;
  } | null;
  venueManager: boolean;
  _count?: {
    bookings?: number;
    venues?: number;
  };
  bookings?: ProfileBooking[];
  venues?: ProfileVenue[];
};

type ApiItem<T> = { data: T };

/**
 * Henter profil med bookinger og venues.
 */
export function getProfile(name: string) {
  const encoded = encodeURIComponent(name);
  return api<ApiItem<Profile>>(
    `/holidaze/profiles/${encoded}?_bookings=true&_venues=true`
  );
}

/**
 * Oppdaterer avatar-bildet.
 * Noroff v2 bruker: PUT /holidaze/profiles/{name}
 * Docs: https://docs.noroff.dev/docs/v2/holidaze/profiles
 */
export function updateProfileAvatar(name: string, avatarUrl: string | null) {
  const encoded = encodeURIComponent(name);
  return api<ApiItem<Profile>>(`/holidaze/profiles/${encoded}`, {
    method: "PUT",
    body: JSON.stringify({
      avatar: avatarUrl ? { url: avatarUrl, alt: `${name}'s avatar` } : null,
    }),
  });
}
