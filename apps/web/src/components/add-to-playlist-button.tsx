"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlaylists, addTrackToPlaylist } from "@/lib/playlists-api";
import type { Track } from "@/lib/music-api";

// Botão "+" que abre um menu com as playlists do usuário para adicionar a faixa.
export function AddToPlaylistButton({ track }: { track: Track }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Só busca as playlists quando o menu abre
  const { data: playlists = [] } = useQuery({
    queryKey: ["playlists"],
    queryFn: getPlaylists,
    enabled: open,
  });

  const add = useMutation({
    mutationFn: (playlistId: string) => addTrackToPlaylist(playlistId, track),
    onSuccess: (_data, playlistId) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      setOpen(false);
    },
  });

  return (
    <div className="relative shrink-0">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label="Adicionar à playlist"
        className="text-neutral-400 transition hover:scale-110 hover:text-white"
      >
        <Plus size={18} />
      </button>

      {open && (
        <>
          {/* fecha o menu ao clicar fora */}
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 z-20 mt-1 w-52 rounded-md bg-neutral-800 p-1 shadow-xl"
          >
            <p className="px-2 py-1 text-xs text-neutral-400">Adicionar a...</p>
            {playlists.length === 0 ? (
              <p className="px-2 py-1 text-xs text-neutral-500">
                Nenhuma playlist. Crie uma na Biblioteca.
              </p>
            ) : (
              playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => add.mutate(p.id)}
                  className="block w-full truncate rounded px-2 py-1.5 text-left text-sm transition hover:bg-white/10"
                >
                  {p.name}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}