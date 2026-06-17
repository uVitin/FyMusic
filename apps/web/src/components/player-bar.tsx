"use client";

import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Music,
} from "lucide-react";
import { usePlayerStore } from "@/store/player";

// Formata segundos em "m:ss"
function fmt(t: number) {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const current = usePlayerStore((s) => s.current);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const requestSeek = usePlayerStore((s) => s.requestSeek);
  const setVolume = usePlayerStore((s) => s.setVolume);

  return (
    <footer className="flex items-center gap-3 border-t border-neutral-800 bg-[#181818] px-3 py-2 lg:px-4 lg:py-3">
      {/* Faixa atual */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-neutral-800">
          {current?.image ? (
            <Image
              src={current.image}
              alt={current.title}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <Music size={20} className="text-neutral-500" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {current ? current.title : "Nenhuma música"}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {current ? current.artist : "Selecione uma faixa"}
          </p>
        </div>
      </div>

      {/* Controles centrais */}
      <div className="flex flex-col items-center gap-1 lg:flex-1">
        <div className="flex items-center gap-4">
          <button className="hidden text-neutral-400 transition hover:text-white lg:block">
            <Shuffle size={18} />
          </button>
          <button className="text-neutral-300 transition hover:text-white">
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            disabled={!current}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={isPlaying ? "Pausar" : "Tocar"}
          >
            {isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} className="ml-0.5" />
            )}
          </button>
          <button className="text-neutral-300 transition hover:text-white">
            <SkipForward size={20} />
          </button>
          <button className="hidden text-neutral-400 transition hover:text-white lg:block">
            <Repeat size={18} />
          </button>
        </div>

        {/* Barra de progresso funcional (desktop) */}
        <div className="hidden w-full max-w-md items-center gap-2 lg:flex">
          <span className="w-9 text-right text-[11px] text-neutral-400">
            {fmt(progress)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={progress}
            onChange={(e) => requestSeek(Number(e.target.value))}
            disabled={!current}
            aria-label="Progresso da música"
            className="h-1 flex-1 cursor-pointer accent-white"
          />
          <span className="w-9 text-[11px] text-neutral-400">{fmt(duration)}</span>
        </div>
      </div>

      {/* Volume (desktop) */}
      <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
        <Volume2 size={18} className="text-neutral-400" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="h-1 w-24 cursor-pointer accent-white"
        />
      </div>
    </footer>
  );
}