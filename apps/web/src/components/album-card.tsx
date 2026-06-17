"use client";

import { Play, Music } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  gradient: string; // classes de gradiente do Tailwind, ex: "from-purple-500 to-indigo-800"
};

// Card de álbum/playlist com capa (placeholder) e botão de play no hover
export function AlbumCard({ title, subtitle, gradient }: Props) {
  return (
    <div className="group cursor-pointer rounded-md bg-[#181818] p-3 transition hover:bg-[#282828]">
      <div className="relative mb-3">
        <div
          className={`flex aspect-square w-full items-center justify-center rounded bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Music className="text-black/40" size={32} />
        </div>
        <button
          className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-primary text-black opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`Tocar ${title}`}
        >
          <Play size={18} className="ml-0.5" fill="currentColor" />
        </button>
      </div>
      <p className="truncate text-sm font-semibold">{title}</p>
      <p className="mt-1 line-clamp-2 text-xs text-neutral-400">{subtitle}</p>
    </div>
  );
}