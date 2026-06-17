import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.routes";
import { musicRouter } from "./routes/music.routes";
import { likesRouter } from "./routes/likes.routes";
import { requireAuth } from "./middlewares/auth.middleware";

// Carrega as variáveis do arquivo .env para process.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middlewares globais ---
app.use(
  cors({
    origin: process.env.WEB_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// --- Rotas ---
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "FyMusic API rodando 🎵" });
});

// Rotas de autenticação (cadastro, login)
app.use("/auth", authRouter);

// Rotas de catálogo musical (proxy da Deezer): home e busca
app.use("/music", musicRouter);

// Rotas de favoritos (protegidas: exigem login)
app.use("/likes", requireAuth, likesRouter);

// --- Tratador de erros: devolve JSON em vez de página HTML ---
// (no Express 5, erros lançados em handlers async chegam aqui automaticamente)
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const message = err instanceof Error ? err.message : "Erro interno do servidor";
  res.status(500).json({ error: message });
});

// --- Inicialização do servidor ---
app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});