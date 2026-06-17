"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLikes, likeTrack, unlikeTrack } from "@/lib/likes-api";
import type { Track } from "@/lib/music-api";
import { useAuthStore } from "@/store/auth";

// Hook central de favoritos: lista as curtidas, diz se uma faixa é curtida
// e alterna (curtir/descurtir). Várias telas usam o mesmo cache (queryKey "likes").
export function useLikes() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: likes = [] } = useQuery({
    queryKey: ["likes"],
    queryFn: getLikes,
    enabled: !!user, // só busca se estiver logado
  });

  const likedIds = new Set(likes.map((t) => t.id));

  const toggle = useMutation({
    mutationFn: async (track: Track) => {
      if (likedIds.has(track.id)) {
        await unlikeTrack(track.id);
      } else {
        await likeTrack(track);
      }
    },
    // Após curtir/descurtir, refaz a lista de curtidas
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["likes"] }),
  });

  return {
    likes,
    isLiked: (id: number) => likedIds.has(id),
    toggleLike: (track: Track) => toggle.mutate(track),
  };
}