"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, Music } from "lucide-react";

type Props = {
  id: number;
  name: string;
  artist: string;
  image: string | null;
};

// Card de álbum: clicar abre a página do álbum (/album/[id])
export function AlbumCard({ id, name, artist, image }: Props) {
  return (
    <Link
      href={`/album/${id}`}
      className="group block cursor-pointer rounded-md bg-[#181818] p-3 transition hover:bg-[#282828]"
    >
      <div className="relative mb-3">
        <div className="relative aspect-square w-full overflow-hidden rounded shadow-lg">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-700">
              <Music size={32} className="text-neutral-400" />
            </div>
          )}
        </div>
        <span className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-primary text-black opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Play size={18} className="ml-0.5" fill="currentColor" />
        </span>
      </div>
      <p className="truncate text-sm font-semibold">{name}</p>
      <p className="mt-1 truncate text-xs text-neutral-400">{artist}</p>
    </Link>
  );
}