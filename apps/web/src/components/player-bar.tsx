"use client";

import { useState } from "react";
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

// Barra do player (apenas visual por enquanto — tocar áudio vem na fase do player).
export function PlayerBar() {
  const [playing, setPlaying] = useState(false);

  return (
    <footer className="flex items-center gap-3 border-t border-neutral-800 bg-[#181818] px-3 py-2 lg:px-4 lg:py-3">
      {/* Faixa atual */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-gradient-to-br from-primary to-emerald-800">
          <Music size={20} className="text-black/70" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Nenhuma música</p>
          <p className="truncate text-xs text-neutral-400">Selecione uma faixa</p>
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
            onClick={() => setPlaying((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
            aria-label={playing ? "Pausar" : "Tocar"}
          >
            {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button className="text-neutral-300 transition hover:text-white">
            <SkipForward size={20} />
          </button>
          <button className="hidden text-neutral-400 transition hover:text-white lg:block">
            <Repeat size={18} />
          </button>
        </div>

        {/* Barra de progresso (desktop) */}
        <div className="hidden w-full max-w-md items-center gap-2 lg:flex">
          <span className="text-[11px] text-neutral-400">0:00</span>
          <div className="h-1 flex-1 rounded-full bg-neutral-600">
            <div className="h-1 w-0 rounded-full bg-white" />
          </div>
          <span className="text-[11px] text-neutral-400">0:00</span>
        </div>
      </div>

      {/* Volume (desktop) */}
      <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
        <Volume2 size={18} className="text-neutral-400" />
        <div className="h-1 w-24 rounded-full bg-neutral-600">
          <div className="h-1 w-2/3 rounded-full bg-white" />
        </div>
      </div>
    </footer>
  );
}