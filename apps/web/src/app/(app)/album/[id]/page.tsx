"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Play, Music } from "lucide-react";
import { getAlbum } from "@/lib/music-api";
import { TrackRow } from "@/components/track-row";
import { usePlayerStore } from "@/store/player";

export default function AlbumPage() {
  const params = useParams();
  const id = String(params.id);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const {
    data: album,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["album", id],
    queryFn: () => getAlbum(id),
  });

  if (isLoading) {
    return <p className="py-8 text-neutral-400">Carregando álbum...</p>;
  }
  if (isError || !album) {
    return (
      <p className="py-8 text-red-400">Não foi possível carregar o álbum.</p>
    );
  }

  return (
    <div className="py-4">
      {/* Cabeçalho do álbum */}
      <header className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded shadow-lg">
          {album.image ? (
            <Image
              src={album.image}
              alt={album.name}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-700">
              <Music size={40} className="text-neutral-400" />
            </div>
          )}
        </div>
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Álbum
          </p>
          <h1 className="text-2xl font-bold sm:text-4xl">{album.name}</h1>
          <p className="mt-1 text-sm text-neutral-300">
            {album.artist} · {album.tracks.length} músicas
          </p>
        </div>
      </header>

      {/* Botão de tocar o álbum (começa pela 1ª faixa) */}
      <button
        onClick={() => album.tracks[0] && playTrack(album.tracks[0])}
        disabled={album.tracks.length === 0}
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-black transition hover:scale-105 disabled:opacity-50"
        aria-label="Tocar álbum"
      >
        <Play size={22} className="ml-0.5" fill="currentColor" />
      </button>

      {/* Lista de faixas (reusa o TrackRow) */}
      <ul className="flex flex-col">
        {album.tracks.map((track) => (
          <TrackRow key={track.id} track={track} />
        ))}
      </ul>
    </div>
  );
}