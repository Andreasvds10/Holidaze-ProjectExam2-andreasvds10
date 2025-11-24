// src/features/manager/CreateVenuePage.tsx
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { createVenue } from "../bookings/venues/venuesApi";
import type { VenuePayload } from "../bookings/venues/venuesApi";
import { useAuth } from "../bookings/Auth/store";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  maxGuests: z.coerce
    .number()
    .min(1, "At least 1 guest")
    .max(100, "Max 100 guests"),
  mediaUrl: z
    .string()
    .url("Enter a valid image URL")
    .optional()
    .or(z.literal("")),
  city: z.string().optional(),
  country: z.string().optional(),
  wifi: z.boolean().optional(),
  parking: z.boolean().optional(),
  breakfast: z.boolean().optional(),
  pets: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CreateVenuePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  if (!user) {
    return <p className="p-4 text-red-600">You must be logged in.</p>;
  }

  if (!user.venueManager) {
    return <p className="p-4 text-red-600">You are not a venue manager.</p>;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // some TS versions/libs are picky here, so we just cast
    resolver: zodResolver(schema) as any,
    defaultValues: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (dto: VenuePayload) => createVenue(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myVenues", user.name] });
      navigate("/manager/venues");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const payload: VenuePayload = {
      name: values.name,
      description: values.description,
      price: values.price,
      maxGuests: values.maxGuests,
      media: values.mediaUrl
        ? [
            {
              url: values.mediaUrl,
            },
          ]
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
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-3xl font-semibold">Create Venue</h1>

      {/* Hvis eslint noen gang maser om jsx-no-bind her, kan du legge inn disable-kommentar */}
      <form
        onSubmit={handleSubmit(onSubmit as SubmitHandler<FormValues>)}
        className="space-y-4"
      >
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm">Name</label>
          <input
            className="w-full rounded-xl border border-black/10 px-3 py-2"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
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
            <p className="mt-1 text-xs text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Price + maxGuests */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Price per night</label>
            <input
              type="number"
              className="w-full rounded-xl border border-black/10 px-3 py-2"
              {...register("price")}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">
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
              <p className="mt-1 text-xs text-red-600">
                {errors.maxGuests.message}
              </p>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="mb-1 block text-sm">Image URL</label>
          <input
            className="w-full rounded-xl border border-black/10 px-3 py-2"
            placeholder="https://…"
            {...register("mediaUrl")}
          />
          {errors.mediaUrl && (
            <p className="mt-1 text-xs text-red-600">
              {errors.mediaUrl.message}
            </p>
          )}
        </div>

        {/* City + country */}
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

        {/* Meta checkboxes */}
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
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
          {mutation.isPending ? "Creating…" : "Create venue"}
        </button>
      </form>
    </div>
  );
}
