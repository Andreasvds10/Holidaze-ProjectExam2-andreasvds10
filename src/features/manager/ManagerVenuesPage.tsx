// src/features/manager/ManagerVenuesPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyVenues, deleteVenue } from "../bookings/venues/venuesApi";
import { useAuth } from "../bookings/Auth/store";
import { Link, useNavigate } from "react-router-dom";

export default function ManagerVenuesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  if (!user) {
    return <p className="p-4 text-red-600">You must be logged in.</p>;
  }

  if (!user.venueManager) {
    return <p className="p-4 text-red-600">You are not a venue manager.</p>;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myVenues", user.name],
    queryFn: () => getMyVenues(user.name),
  });

  const mutation = useMutation({
    mutationFn: (id: string) => deleteVenue(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myVenues", user.name] });
    },
  });

  const venues = data?.data ?? [];

  const handleDelete = (id: string) => {
    if (!confirm("Delete this venue?")) return;
    mutation.mutate(id);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">My Venues</h1>

        <button
          type="button"
          onClick={() => navigate("/manager/venues/new")}
          className="rounded-xl bg-black px-4 py-2 text-white shadow hover:bg-black/80"
        >
          Create New Venue
        </button>
      </div>

      {isLoading && <p>Loading venues…</p>}
      {isError && (
        <p className="text-red-600">Failed to load your venues. Try again.</p>
      )}

      {!isLoading && !isError && venues.length === 0 && (
        <p className="opacity-70">
          You don&apos;t manage any venues yet. Create your first venue to get
          started.
        </p>
      )}

      <div className="mt-4 grid gap-4">
        {venues.map((v) => {
          const allBookings = (v as any).bookings ?? [];
          const bookingsCount = allBookings.filter((b: any) => {
            const end = new Date(b.dateTo);
            end.setHours(0, 0, 0, 0);
            return end >= today;
          }).length;

          return (
            <div
              key={v.id}
              className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-medium">{v.name}</h2>
                  <p className="text-sm opacity-70">
                    Max guests: {v.maxGuests} • Price: ${v.price}
                  </p>

                  {bookingsCount > 0 ? (
                    <p className="mt-1 text-sm">
                      <strong>{bookingsCount}</strong> upcoming booking
                      {bookingsCount > 1 ? "s" : ""}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs opacity-60">
                      No upcoming bookings yet.
                    </p>
                  )}
                </div>

                <img
                  src={v.media?.[0]?.url || "https://picsum.photos/200"}
                  alt={v.name}
                  className="h-20 w-32 rounded-lg object-cover"
                />
              </div>

              <div className="mt-4 flex gap-3">
                <Link
                  to={`/manager/venues/${v.id}/edit`}
                  className="rounded-lg border border-black/20 px-3 py-1 text-sm hover:bg-black/5"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(v.id)}
                  disabled={mutation.isPending}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100 disabled:opacity-60"
                >
                  {mutation.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
