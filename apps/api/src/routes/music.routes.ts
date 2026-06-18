import { Router } from "express";
import { deezerFetch } from "../lib/deezer";

export const musicRouter = Router();

// --- Tipos crus da Deezer (só o que usamos) ---
type DeezerArtist = { name: string };
type DeezerAlbumRef = { title: string; cover_medium: string };
type DeezerAlbum = {
  id: number;
  title: string;
  cover_medium: string;
  artist: DeezerArtist;
};
type DeezerTrack = {
  id: number;
  title: string;
  duration: number;
  preview: string; // URL do MP3 de 30s
  artist: DeezerArtist;
  album: DeezerAlbumRef;
};

// --- Tipos "limpos" que devolvemos pro frontend ---
type Album = { id: number; name: string; artist: string; image: string | null };
type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  image: string | null;
  preview: string;
  duration: number;
};

type DeezerAlbumTrack = {
  id: number;
  title: string;
  duration: number;
  preview: string;
  artist: DeezerArtist;
};

type DeezerAlbumFull = {
  id: number;
  title: string;
  cover_medium: string;
  artist: DeezerArtist;
  tracks: { data: DeezerAlbumTrack[] };
};

function toAlbum(a: DeezerAlbum): Album {
  return {
    id: a.id,
    name: a.title,
    artist: a.artist?.name ?? "",
    image: a.cover_medium ?? null,
  };
}

function toTrack(t: DeezerTrack): Track {
  return {
    id: t.id,
    title: t.title,
    artist: t.artist?.name ?? "",
    album: t.album?.title ?? "",
    image: t.album?.cover_medium ?? null,
    preview: t.preview,
    duration: t.duration,
  };
}

// GET /music/home — álbuns populares (para a home)
musicRouter.get("/home", async (_req, res) => {
  const data = await deezerFetch<{ data: DeezerAlbum[] }>("/chart/0/albums?limit=20");
  res.json(data.data.map(toAlbum));
});

// GET /music/search?q=termo — busca faixas
musicRouter.get("/search", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q) {
    return res.status(400).json({ error: "Informe o parâmetro 'q'" });
  }

  const data = await deezerFetch<{ data: DeezerTrack[] }>(
    `/search?q=${encodeURIComponent(q)}&limit=25`
  );
  res.json(data.data.map(toTrack));
});

// GET /music/album/:id — detalhes de um álbum + suas faixas
musicRouter.get("/album/:id", async (req, res) => {
  const data = await deezerFetch<DeezerAlbumFull>(`/album/${req.params.id}`);
  const image = data.cover_medium ?? null;

  const tracks: Track[] = (data.tracks?.data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    artist: t.artist?.name ?? data.artist?.name ?? "",
    album: data.title,
    image, // a capa do álbum vale para todas as faixas
    preview: t.preview,
    duration: t.duration,
  }));

  res.json({
    id: data.id,
    name: data.title,
    artist: data.artist?.name ?? "",
    image,
    tracks,
  });
});