"use client";

import { usePlayerStore } from "@/store/player";
import { TrackRow } from "@/components/track-row";

export default function QueuePage() {
  const queue = usePlayerStore((s) => s.queue);
  const index = usePlayerStore((s) => s.index);

  const nowPlaying = index >= 0 ? queue[index] : null;
  const upNext = index >= 0 ? queue.slice(index + 1) : [];

  return (
    <div className="py-4">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Fila de reprodução</h1>

      {!nowPlaying ? (
        <p className="text-neutral-400">
          A fila está vazia. Toque uma música pra começar. 🎵
        </p>
      ) : (
        <>
          <h2 className="mb-2 text-sm font-semibold text-neutral-400">
            Tocando agora
          </h2>
          <ul className="mb-8 flex flex-col">
            <TrackRow track={nowPlaying} queue={queue} index={index} />
          </ul>

          {upNext.length > 0 && (
            <>
              <h2 className="mb-2 text-sm font-semibold text-neutral-400">
                A seguir
              </h2>
              <ul className="flex flex-col">
                {upNext.map((track, i) => (
                  <TrackRow
                    key={`${track.id}-${i}`}
                    track={track}
                    queue={queue}
                    index={index + 1 + i}
                  />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}