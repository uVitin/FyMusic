import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";

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

// POST /auth/register — cria um novo usuário
authRouter.post("/register", async (req, res) => {
  // 1. Valida o corpo da requisição
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, displayName, password } = parsed.data;

  // 2. Impede e-mails duplicados
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "E-mail já cadastrado" });
  }

  // 3. Criptografa a senha — NUNCA salvamos a senha pura
  const passwordHash = await bcrypt.hash(password, 10);

  // 4. Cria o usuário no banco
  const user = await prisma.user.create({
    data: { email, displayName, passwordHash },
  });

  // 5. Responde sem expor o hash da senha
  return res.status(201).json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  });
});

// POST /auth/login — valida credenciais
authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, password } = parsed.data;

  // Busca o usuário pelo e-mail
  const user = await prisma.user.findUnique({ where: { email } });
  // Mensagem genérica de propósito: não revela se o e-mail existe ou não
  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  // Compara a senha enviada com o hash armazenado
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  return res.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  });
});