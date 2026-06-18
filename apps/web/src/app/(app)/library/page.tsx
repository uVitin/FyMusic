"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListMusic, Plus } from "lucide-react";
import { useLikes } from "@/hooks/use-likes";
import { TrackRow } from "@/components/track-row";
import { getPlaylists, createPlaylist } from "@/lib/playlists-api";

export default function LibraryPage() {
  const { likes } = useLikes();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const { data: playlists = [] } = useQuery({
    queryKey: ["playlists"],
    queryFn: getPlaylists,
  });

  const create = useMutation({
    mutationFn: () => createPlaylist(name.trim()),
    onSuccess: () => {
      setName("");
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (name.trim()) create.mutate();
  }

  return (
    <div className="py-4">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Sua Biblioteca</h1>

      {/* Criar playlist */}
      <form onSubmit={handleCreate} className="mb-8 flex max-w-md gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da nova playlist"
          className="flex-1 rounded-full bg-neutral-800 px-4 py-2 text-sm outline-none transition focus:bg-neutral-700"
        />
        <button
          type="submit"
          disabled={!name.trim() || create.isPending}
          className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 disabled:opacity-50"
        >
          <Plus size={16} /> Criar
        </button>
      </form>

      {/* Playlists do usuário */}
      {playlists.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Suas Playlists</h2>
          <ul className="flex flex-col gap-1">
            {playlists.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/playlist/${p.id}`}
                  className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-neutral-800">
                    <ListMusic size={18} className="text-neutral-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-neutral-400">
                      {p.trackCount} música(s)
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Músicas curtidas */}
      <h2 className="mb-3 text-lg font-bold">Músicas Curtidas</h2>
      {likes.length === 0 ? (
        <p className="text-neutral-400">
          Você ainda não curtiu nenhuma música. ❤️
        </p>
      ) : (
        <ul className="flex flex-col">
          {likes.map((track, i) => (
            <TrackRow key={track.id} track={track} queue={likes} index={i} />
          ))}
        </ul>
      )}
    </div>
  );
}