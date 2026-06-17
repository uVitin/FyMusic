import { Router, type Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { requireAuth } from "../middlewares/auth.middleware";

export const authRouter = Router();

// --- Validação de entrada com Zod ---
const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  displayName: z.string().min(2, "Nome muito curto"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

// Nome e opções do cookie que guarda o refresh token
const REFRESH_COOKIE = "refreshToken";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true, // JS do navegador não consegue ler -> protege contra XSS
    secure: process.env.NODE_ENV === "production", // só HTTPS em produção
    sameSite: "lax", // proteção básica contra CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em milissegundos
    path: "/",
  });
}

// POST /auth/register — cria um novo usuário e já autentica
authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, displayName, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "E-mail já cadastrado" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, displayName, passwordHash },
  });

  const accessToken = signAccessToken(user.id);
  setRefreshCookie(res, signRefreshToken(user.id));

  return res.status(201).json({
    user: { id: user.id, email: user.email, displayName: user.displayName },
    accessToken,
  });
});

// POST /auth/login — valida credenciais e autentica
authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const accessToken = signAccessToken(user.id);
  setRefreshCookie(res, signRefreshToken(user.id));

  return res.json({
    user: { id: user.id, email: user.email, displayName: user.displayName },
    accessToken,
  });
});

// GET /auth/me — retorna o usuário logado (rota protegida pelo middleware)
authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }
  return res.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  });
});

// POST /auth/refresh — gera um novo access token a partir do cookie de refresh
authRouter.post("/refresh", (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) {
    return res.status(401).json({ error: "Refresh token ausente" });
  }
  try {
    const payload = verifyRefreshToken(token);
    const accessToken = signAccessToken(payload.sub);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: "Refresh token inválido ou expirado" });
  }
});

// POST /auth/logout — limpa o cookie de refresh
authRouter.post("/logout", (_req, res) => {
  res.clearCookie(REFRESH_COOKIE, { path: "/" });
  return res.json({ message: "Logout efetuado" });
});