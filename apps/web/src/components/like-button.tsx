"use client";

import { Heart } from "lucide-react";
import type { Track } from "@/lib/music-api";
import { useLikes } from "@/hooks/use-likes";

export function LikeButton({ track, size = 18 }: { track: Track; size?: number }) {
  const { isLiked, toggleLike } = useLikes();
  const liked = isLiked(track.id);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // não dispara o clique da linha (que toca a faixa)
        toggleLike(track);
      }}
      aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className="shrink-0 text-neutral-400 transition hover:scale-110 hover:text-white"
    >
      <Heart
        size={size}
        className={liked ? "fill-primary text-primary" : ""}
      />
    </button>
  );
}