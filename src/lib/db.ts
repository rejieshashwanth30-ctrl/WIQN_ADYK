import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Safe initialization allowing building without an active PostgreSQL instance
let client: PrismaClient;

try {
  client =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }
} catch {
  // Fallback stub for environments where Prisma engine has not yet connected
  client = {} as PrismaClient;
}

export const prisma = client;
