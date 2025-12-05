
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyVenues, deleteVenue } from "../bookings/venues/venuesApi";
import { useAuth } from "../bookings/Auth/store";
import { Link, useNavigate } from "react-router-dom";
import { toastSuccess, toastError } from "../../components/ui/Toast";

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
      toastSuccess("Venue deleted successfully");
    },
    onError: (err: any) => {
      toastError(err?.message ?? "Could not delete venue");
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
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold text-[var(--ink)]">
            My Venues
          </h1>
          <p className="mt-1 text-sm opacity-70">
            Manage your venues and view bookings
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/manager/venues/new")}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:bg-black"
        >
          <span className="text-lg leading-none">+</span>
          Create New Venue
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-black/10 bg-white p-4"
            >
              <div className="h-32 w-full rounded-lg bg-gray-200" />
              <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-700">Failed to load your venues. Try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && venues.length === 0 && (
        <div className="rounded-xl border border-dashed border-black/10 bg-white/70 p-8 text-center">
          <p className="font-medium text-[var(--ink)]">
            You don&apos;t manage any venues yet.
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Create your first venue to get started.
          </p>
        </div>
      )}

      {/* Venues grid */}
      {!isLoading && !isError && venues.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
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
                className="rounded-2xl border border-black/10 bg-white/95 p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                    {v.media?.[0]?.url ? (
                      <img
                        src={v.media[0].url}
                        alt={v.media[0].alt || v.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-[var(--ink)] truncate">
                      {v.name}
                    </h2>
                    <p className="mt-1 text-xs text-gray-600">
                      Max {v.maxGuests} guests • NOK{" "}
                      {v.price.toLocaleString("nb-NO")}/night
                    </p>

                    {bookingsCount > 0 ? (
                      <p className="mt-2 text-sm font-medium text-[var(--ink)]">
                        {bookingsCount} upcoming booking
                        {bookingsCount > 1 ? "s" : ""}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-gray-500">
                        No upcoming bookings
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to={`/manager/venues/${v.id}/bookings`}
                    className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium hover:border-black/30"
                  >
                    View bookings ({bookingsCount})
                  </Link>
                  <Link
                    to={`/manager/venues/${v.id}/edit`}
                    className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium hover:border-black/30"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(v.id)}
                    disabled={mutation.isPending}
                    className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
                  >
                    {mutation.isPending ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
