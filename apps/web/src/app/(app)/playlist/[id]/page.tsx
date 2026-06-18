"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Trash2, ListMusic } from "lucide-react";
import { getPlaylist, deletePlaylist, removeTrackFromPlaylist } from "@/lib/playlists-api";
import { TrackRow } from "@/components/track-row";
import { usePlayerStore } from "@/store/player";

export default function PlaylistPage() {
  const params = useParams();
  const id = String(params.id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const playQueue = usePlayerStore((s) => s.playQueue);

  const {
    data: playlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["playlist", id],
    queryFn: () => getPlaylist(id),
  });

  const del = useMutation({
    mutationFn: () => deletePlaylist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      router.push("/library");
    },
  });

  const remove = useMutation({
    mutationFn: (trackId: number) => removeTrackFromPlaylist(id, trackId),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["playlist", id] });
        queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });

  if (isLoading) {
    return <p className="py-8 text-neutral-400">Carregando playlist...</p>;
  }
  if (isError || !playlist) {
    return <p className="py-8 text-red-400">Playlist não encontrada.</p>;
  }

  return (
    <div className="py-4">
      {/* Cabeçalho */}
      <header className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
        <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded bg-neutral-800 shadow-lg">
          <ListMusic size={48} className="text-neutral-400" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Playlist
          </p>
          <h1 className="text-2xl font-bold sm:text-4xl">{playlist.name}</h1>
          <p className="mt-1 text-sm text-neutral-300">
            {playlist.tracks.length} música(s)
          </p>
        </div>
      </header>

      {/* Ações */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => playQueue(playlist.tracks, 0)}
          disabled={playlist.tracks.length === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-black transition hover:scale-105 disabled:opacity-50"
          aria-label="Tocar playlist"
        >
          <Play size={22} className="ml-0.5" fill="currentColor" />
        </button>
        <button
          onClick={() => {
            if (confirm(`Apagar a playlist "${playlist.name}"?`)) del.mutate();
          }}
          className="flex items-center gap-2 text-sm text-neutral-400 transition hover:text-red-400"
        >
          <Trash2 size={18} /> Apagar
        </button>
      </div>

      {/* Faixas */}
      {playlist.tracks.length === 0 ? (
        <p className="text-neutral-400">
          Playlist vazia. Adicione músicas pelo botão ➕ nas faixas.
        </p>
      ) : (
        <ul className="flex flex-col">
          {playlist.tracks.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              queue={playlist.tracks}
              index={i}
              onRemove={() => remove.mutate(track.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}