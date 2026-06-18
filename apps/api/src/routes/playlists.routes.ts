import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const playlistsRouter = Router();

const createSchema = z.object({
  name: z.string().min(1, "Dê um nome à playlist").max(60),
});

const trackSchema = z.object({
  trackId: z.union([z.string(), z.number()]).transform(String),
  title: z.string(),
  artist: z.string(),
  album: z.string(),
  image: z.string().nullable().optional(),
  preview: z.string(),
  duration: z.number().int(),
});

// Converte um PlaylistTrack do banco no formato Track do frontend
function toTrack(pt: {
  trackId: string;
  title: string;
  artist: string;
  album: string;
  image: string | null;
  preview: string;
  duration: number;
}) {
  return {
    id: Number(pt.trackId),
    title: pt.title,
    artist: pt.artist,
    album: pt.album,
    image: pt.image,
    preview: pt.preview,
    duration: pt.duration,
  };
}

// GET /playlists — lista as playlists do usuário (com contagem de faixas)
playlistsRouter.get("/", async (req, res) => {
  const playlists = await prisma.playlist.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tracks: true } } },
  });
  return res.json(
    playlists.map((p) => ({
      id: p.id,
      name: p.name,
      trackCount: p._count.tracks,
    }))
  );
});

// POST /playlists — cria uma playlist
playlistsRouter.post("/", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const playlist = await prisma.playlist.create({
    data: { name: parsed.data.name, userId: req.userId! },
  });
  return res.status(201).json({ id: playlist.id, name: playlist.name });
});

// GET /playlists/:id — detalhes da playlist + faixas (só do dono)
playlistsRouter.get("/:id", async (req, res) => {
  const playlist = await prisma.playlist.findFirst({
    where: { id: req.params.id, userId: req.userId },
    include: { tracks: { orderBy: { addedAt: "asc" } } },
  });
  if (!playlist) {
    return res.status(404).json({ error: "Playlist não encontrada" });
  }
  return res.json({
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.tracks.map(toTrack),
  });
});

// DELETE /playlists/:id — apaga a playlist (só do dono)
playlistsRouter.delete("/:id", async (req, res) => {
  await prisma.playlist.deleteMany({
    where: { id: req.params.id, userId: req.userId },
  });
  return res.json({ deleted: true });
});

// POST /playlists/:id/tracks — adiciona uma faixa à playlist
playlistsRouter.post("/:id/tracks", async (req, res) => {
  const parsed = trackSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  // Garante que a playlist é do usuário logado
  const playlist = await prisma.playlist.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!playlist) {
    return res.status(404).json({ error: "Playlist não encontrada" });
  }

  const { trackId, image, ...rest } = parsed.data;
  await prisma.playlistTrack.upsert({
    where: { playlistId_trackId: { playlistId: playlist.id, trackId } },
    create: { playlistId: playlist.id, trackId, image: image ?? null, ...rest },
    update: {},
  });

  return res.status(201).json({ added: true });
});

// DELETE /playlists/:id/tracks/:trackId — remove uma faixa da playlist
playlistsRouter.delete("/:id/tracks/:trackId", async (req, res) => {
  const playlist = await prisma.playlist.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!playlist) {
    return res.status(404).json({ error: "Playlist não encontrada" });
  }
  await prisma.playlistTrack.deleteMany({
    where: { playlistId: playlist.id, trackId: req.params.trackId },
  });
  return res.json({ removed: true });
});