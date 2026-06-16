import jwt, { type SignOptions } from "jsonwebtoken";

// Segredos usados para assinar os tokens. Em produção, valores fortes via .env.
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

// Tempo de vida de cada token
const ACCESS_EXPIRES: SignOptions["expiresIn"] = "15m";
const REFRESH_EXPIRES: SignOptions["expiresIn"] = "7d";

// O que guardamos dentro do token: o id do usuário em "sub" (subject)
export type TokenPayload = { sub: string };

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
}