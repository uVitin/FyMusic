"use client";

import { useLikes } from "@/hooks/use-likes";
import { TrackRow } from "@/components/track-row";

export default function LibraryPage() {
  const { likes } = useLikes();

  return (
    <div className="py-4">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Músicas Curtidas</h1>

      {likes.length === 0 ? (
        <p className="text-neutral-400">
          Você ainda não curtiu nenhuma música. Vá em Buscar e toque no
          coração! ❤️
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