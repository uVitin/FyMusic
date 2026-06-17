"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Search as SearchIcon, Music } from "lucide-react";
import { searchTracks } from "@/lib/music-api";
import { usePlayerStore } from "@/store/player";
import { LikeButton } from "@/components/like-button";

// Converte segundos em "m:ss"
function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const playTrack = usePlayerStore((s) => s.playTrack);

  // Debounce: só atualiza o termo de busca 400ms após parar de digitar
  useEffect(() => {
    const id = setTimeout(() => setTerm(query.trim()), 400);
    return () => clearTimeout(id);
  }, [query]);

  const { data: tracks, isFetching } = useQuery({
    queryKey: ["search", term],
    queryFn: () => searchTracks(term),
    enabled: term.length > 1, // só busca com 2+ caracteres
  });

  return (
    <div className="py-4">
      {/* Campo de busca */}
      <div className="relative mb-6 max-w-md">
        <SearchIcon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="O que você quer ouvir?"
          autoFocus
          className="w-full rounded-full bg-neutral-800 py-3 pl-10 pr-4 text-sm outline-none transition focus:bg-neutral-700"
        />
      </div>

      {term.length <= 1 && (
        <p className="text-neutral-400">Digite para buscar músicas. 🔍</p>
      )}

      {isFetching && <p className="text-neutral-400">Buscando...</p>}

      {tracks && tracks.length === 0 && term.length > 1 && !isFetching && (
        <p className="text-neutral-400">Nenhum resultado para “{term}”.</p>
      )}

      <ul className="flex flex-col">
        {tracks?.map((t) => (
          <li
            key={t.id}
            onClick={() => playTrack(t)}
            className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition hover:bg-white/10"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
              {t.image ? (
                <Image
                  src={t.image}
                  alt={t.title}
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
              <p className="truncate text-sm font-medium">{t.title}</p>
              <p className="truncate text-xs text-neutral-400">{t.artist}</p>
            </div>
            <LikeButton track={t} />
            <span className="shrink-0 text-xs text-neutral-400">
              {formatDuration(t.duration)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}