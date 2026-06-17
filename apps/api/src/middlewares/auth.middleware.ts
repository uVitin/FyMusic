import { type Request, type Response, type NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

// Middleware que protege rotas: exige um access token válido no header
// "Authorization: Bearer <token>". Se válido, anexa o id do usuário em req.userId.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}