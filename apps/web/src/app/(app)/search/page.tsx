"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { searchTracks } from "@/lib/music-api";
import { TrackRow } from "@/components/track-row";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");

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
        {tracks?.map((t, i) => (
          <TrackRow key={t.id} track={t} queue={tracks} index={i} />
        ))}
      </ul>
    </div>
  );
}