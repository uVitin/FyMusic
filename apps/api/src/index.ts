import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.routes";

// Carrega as variáveis do arquivo .env para process.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middlewares globais ---
// cors(): permite que o frontend (em outra porta) chame esta API
app.use(cors());
// express.json(): faz o parse do corpo das requisições em JSON
app.use(express.json());

// --- Rotas ---
// Health check: rota simples para confirmar que a API está no ar
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "FyMusic API rodando 🎵" });
});

// Rotas de autenticação (cadastro, login)
app.use("/auth", authRouter);

// --- Inicialização do servidor ---
app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});