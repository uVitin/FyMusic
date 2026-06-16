import { PrismaClient } from "@prisma/client";

// Instância única do PrismaClient reutilizada em toda a aplicação.
// Em desenvolvimento, o "watch" reinicia o processo várias vezes; guardar
// a instância em globalThis evita abrir conexões demais com o banco.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}