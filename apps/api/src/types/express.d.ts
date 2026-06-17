// Estende o tipo Request do Express para incluir o userId que o
// middleware de autenticação anexa após validar o token.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};