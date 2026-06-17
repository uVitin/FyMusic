import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const likesRouter = Router();

// Validação do corpo ao curtir uma faixa
const likeSchema = z.object({
  trackId: z.union([z.string(), z.number()]).transform(String),
  title: z.string(),
  artist: z.string(),
  album: z.string(),
  image: z.string().nullable().optional(),
  preview: z.string(),
  duration: z.number().int(),
});

// Converte o registro do banco no formato de Track que o frontend usa
function toTrack(lt: {
  trackId: string;
  title: string;
  artist: string;
  album: string;
  image: string | null;
  preview: string;
  duration: number;
}) {
  return {
    id: Number(lt.trackId),
    title: lt.title,
    artist: lt.artist,
    album: lt.album,
    image: lt.image,
    preview: lt.preview,
    duration: lt.duration,
  };
}

// GET /likes — lista as faixas curtidas do usuário logado
likesRouter.get("/", async (req, res) => {
  const likes = await prisma.likedTrack.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });
  return res.json(likes.map(toTrack));
});

// POST /likes — curte uma faixa
likesRouter.post("/", async (req, res) => {
  const parsed = likeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { trackId, image, ...rest } = parsed.data;
  const userId = req.userId!;

  // upsert evita erro se a faixa já estiver curtida (idempotente)
  await prisma.likedTrack.upsert({
    where: { userId_trackId: { userId, trackId } },
    create: { userId, trackId, image: image ?? null, ...rest },
    update: {},
  });

  return res.status(201).json({ liked: true });
});

// DELETE /likes/:trackId — descurte uma faixa
likesRouter.delete("/:trackId", async (req, res) => {
  await prisma.likedTrack.deleteMany({
    where: { userId: req.userId, trackId: req.params.trackId },
  });
  return res.json({ liked: false });
});