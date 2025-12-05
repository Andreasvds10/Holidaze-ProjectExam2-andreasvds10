// src/features/bookings/profile/ProfilePage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateAvatar, type Profile } from "../Auth/authApi";
import { useAuth } from "../Auth/store";
import { toastSuccess, toastError, toastWarning } from "../../../components/ui/Toast";

export default function ProfilePage() {
  const qc = useQueryClient();
  const { setUser } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<Profile>({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const [avatarUrl, setAvatarUrl] = useState("");

  const mutation = useMutation({
    mutationFn: (url: string) => updateAvatar(url),
    onSuccess: (updatedProfile) => {
      // Oppdater query cache med ny data
      qc.setQueryData(["me"], updatedProfile);
      // Oppdater auth store så navigasjon og andre steder viser ny avatar
      setUser(updatedProfile);
      setAvatarUrl("");
      toastSuccess("Avatar updated successfully!");
    },
    onError: (err: any) => {
      toastError(err?.message ?? "Could not update avatar");
    },
  });

  if (isLoading) {
    return <p className="p-4">Laster profil…</p>;
  }

  if (isError || !data) {
    return (
      <div className="p-4 text-red-600">
        Kunne ikke laste profil.
        {error instanceof Error && (
          <p className="mt-1 text-xs opacity-80">{error.message}</p>
        )}
      </div>
    );
  }

  const avatar = data.avatar?.url;

  const handleUpdate = () => {
    const trimmed = avatarUrl.trim();

    if (!trimmed) {
      // Tillat også å sende tomt for å fjerne avatar, hvis backend håndterer det
      mutation.mutate("");
      return;
    }

    try {
      // Basic URL-sjekk
      new URL(trimmed);
    } catch {
      toastWarning("Avatar must be a valid URL.");
      return;
    }

    mutation.mutate(trimmed);
  };

  return (
    <div className="mx-auto max-w-xl p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Min profil</h1>
        <p className="text-sm opacity-80">
          Se kontoinformasjonen din og oppdater avatar.
        </p>
      </header>

      {/* Profilkort */}
      <section className="flex flex-col items-center gap-3 rounded-2xl border border-black/10 bg-white p-5 shadow-card">
        <div className="h-28 w-28 overflow-hidden rounded-full border border-black/10 bg-gray-200">
          {avatar ? (
            <img
              src={avatar}
              alt={data.name}
              className="h-full w-full object-cover"
              key={avatar} // Force re-render when avatar URL changes
              onError={(e) => {
                // Fallback hvis bildet ikke kan lastes
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs opacity-60">
              Ingen avatar
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-lg font-medium">{data.name}</p>
          <p className="text-sm opacity-70">{data.email}</p>
        </div>
      </section>

      {/* Avatar-oppdatering */}
      <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Oppdater avatar</h2>
        <p className="mb-3 text-xs opacity-80">
          Lim inn en bilde-URL. Bruk et offentlig, tilgjengelig bilde (for
          eksempel fra et CDN eller bildehost).
        </p>

        <input
          type="url"
          placeholder={avatar || "https://example.com/avatar.jpg"}
          className="w-full rounded-xl border border-black/15 px-3 py-2 text-sm"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />

        <button
          className="mt-3 w-full rounded-xl bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
          onClick={handleUpdate}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Oppdaterer…" : "Lagre avatar"}
        </button>
      </section>
    </div>
  );
}
