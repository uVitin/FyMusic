"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { Section } from "@/components/section";
import { AlbumCard } from "@/components/album-card";
import { getHomeAlbums } from "@/lib/music-api";

// Saudação que muda conforme a hora do dia (como no Spotify)
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  // Busca os álbuns reais da API com cache/loading automáticos
  const {
    data: albums,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["home-albums"],
    queryFn: getHomeAlbums,
  });

  return (
    <div className="py-4">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        {greeting()}
        {user ? `, ${user.displayName}` : ""}
      </h1>

      <Section title="Em alta no FyMusic">
        {isLoading && (
          <p className="col-span-full text-neutral-400">Carregando álbuns...</p>
        )}
        {isError && (
          <p className="col-span-full text-red-400">
            Não foi possível carregar os álbuns.
          </p>
        )}
        {albums?.map((album) => (
          <AlbumCard
            key={album.id}
            id={album.id}
            name={album.name}
            artist={album.artist}
            image={album.image}
          />
        ))}
      </Section>
    </div>
  );
}