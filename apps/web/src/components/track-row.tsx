"use client";

import Image from "next/image";
import { Music } from "lucide-react";
import type { Track } from "@/lib/music-api";
import { usePlayerStore } from "@/store/player";
import { LikeButton } from "./like-button";

// Converte segundos em "m:ss"
function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Linha de faixa reutilizável (busca, biblioteca, etc.): clicar toca a música.
export function TrackRow({ track }: { track: Track }) {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const current = usePlayerStore((s) => s.current);
  const isCurrent = current?.id === track.id;

  return (
    <li
      onClick={() => playTrack(track)}
      className={`flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition hover:bg-white/10 ${
        isCurrent ? "bg-white/5" : ""
      }`}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
        {track.image ? (
          <Image
            src={track.image}
            alt={track.title}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-700">
            <Music size={16} className="text-neutral-400" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            isCurrent ? "text-primary" : ""
          }`}
        >
          {track.title}
        </p>
        <p className="truncate text-xs text-neutral-400">{track.artist}</p>
      </div>
      <LikeButton track={track} />
      <span className="shrink-0 text-xs text-neutral-400">
        {formatDuration(track.duration)}
      </span>
    </li>
  );
}