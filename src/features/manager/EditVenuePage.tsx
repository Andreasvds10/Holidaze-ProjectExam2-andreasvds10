// src/features/manager/EditVenuePage.tsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { getVenue, updateVenue } from "../bookings/venues/venuesApi";
import type { VenuePayload } from "../bookings/venues/venuesApi";
import { useAuth } from "../bookings/Auth/store";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  maxGuests: z.coerce.number().min(1, "At least 1 guest").max(100, "Max 100"),
  mediaUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  city: z.string().optional(),
  country: z.string().optional(),
  wifi: z.boolean().optional(),
  parking: z.boolean().optional(),
  breakfast: z.boolean().optional(),
  pets: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditVenuePage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  if (!user) return <p className="p-4 text-red-600">You must be logged in.</p>;
  if (!user.venueManager)
    return <p className="p-4 text-red-600">You are not a venue manager.</p>;
  if (!id) return <p className="p-4 text-red-600">Missing venue ID.</p>;

  // -------------------------
  // REACT-HOOK-FORM FIXED
  // -------------------------
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // -------------------------
  // FETCH VENUE
  // -------------------------
  const venueQuery = useQuery({
    queryKey: ["venue", id],
    queryFn: () => getVenue(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (!venueQuery.data) return;

    const v = venueQuery.data.data;

    reset({
      name: v.name,
      description: v.description ?? "",
      price: v.price,
      maxGuests: v.maxGuests,
      mediaUrl: v.media?.[0]?.url ?? "",
      city: v.location?.city ?? "",
      country: v.location?.country ?? "",
      wifi: v.meta?.wifi ?? false,
      parking: v.meta?.parking ?? false,
      breakfast: v.meta?.breakfast ?? false,
      pets: v.meta?.pets ?? false,
    });
  }, [venueQuery.data, reset]);

  // -------------------------
  // UPDATE VENUE
  // -------------------------
  const mutation = useMutation({
    mutationFn: (dto: Partial<VenuePayload>) => updateVenue(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["venue", id] });
      qc.invalidateQueries({ queryKey: ["myVenues", user.name] });
      navigate("/manager/venues");
    },
  });

  function onSubmit(values: FormValues) {
    const payload: Partial<VenuePayload> = {
      name: values.name,
      description: values.description,
      price: values.price,
      maxGuests: values.maxGuests,
      media: values.mediaUrl
        ? [{ url: values.mediaUrl }]
        : [],
      meta: {
        wifi: values.wifi ?? false,
        parking: values.parking ?? false,
        breakfast: values.breakfast ?? false,
        pets: values.pets ?? false,
      },
      location: {
        city: values.city || undefined,
        country: values.country || undefined,
      },
    };

    mutation.mutate(payload);
  }

  if (venueQuery.isLoading) return <p className="p-6">Loading…</p>;
  if (venueQuery.error)
    return <p className="p-6 text-red-600">Failed to load venue.</p>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-3xl font-semibold">Edit Venue</h1>

      {/* ------------------------- */}
      {/* THE FORM — FIXED          */}
      {/* ------------------------- */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Name */}
        <div>
          <label className="mb-1 block text-sm">Name</label>
          <input
            className="w-full rounded-xl border border-black/10 px-3 py-2"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm">Description</label>
          <textarea
            className="w-full rounded-xl border border-black/10 px-3 py-2"
            rows={4}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-600 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Price + Guests */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Price</label>
            <input
              type="number"
              className="w-full rounded-xl border border-black/10 px-3 py-2"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-xs text-red-600 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm">Max guests</label>
            <input
              type="number"
              className="w-full rounded-xl border border-black/10 px-3 py-2"
              {...register("maxGuests")}
            />
            {errors.maxGuests && (
              <p className="text-xs text-red-600 mt-1">
                {errors.maxGuests.message}
              </p>
            )}
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="mb-1 block text-sm">Image URL</label>
          <input
            className="w-full rounded-xl border border-black/10 px-3 py-2"
            {...register("mediaUrl")}
          />
          {errors.mediaUrl && (
            <p className="text-xs text-red-600 mt-1">
              {errors.mediaUrl.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">City</label>
            <input
              className="w-full rounded-xl border border-black/10 px-3 py-2"
              {...register("city")}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Country</label>
            <input
              className="w-full rounded-xl border border-black/10 px-3 py-2"
              {...register("country")}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("wifi")} />
            Wifi
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("parking")} />
            Parking
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("breakfast")} />
            Breakfast included
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("pets")} />
            Pets allowed
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="mt-4 w-full rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {mutation.isPending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
