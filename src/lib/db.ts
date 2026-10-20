import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Normalizes PostgreSQL connection string for maximum compatibility across
 * Vercel serverless functions, Neon transaction poolers, and local development.
 * Automatically removes incompatible SCRAM channel binding options and normalizes SSL mode.
 */
export function getSanitizedDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;

  let cleaned = raw
    .replace(/[?&]channel_binding=require/g, '')
    .replace('sslmode=verify-full', 'sslmode=require');

  if (!cleaned.includes('sslmode=')) {
    cleaned += (cleaned.includes('?') ? '&' : '?') + 'sslmode=require';
  }

  // Ensure connect_timeout is configured for serverless resilience
  if (!cleaned.includes('connect_timeout=')) {
    cleaned += '&connect_timeout=15';
  }

  return cleaned;
}

function createPrismaClient(): PrismaClient {
  const sanitizedUrl = getSanitizedDatabaseUrl();
  const options: any = {
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  };

  if (sanitizedUrl) {
    options.datasources = {
      db: {
        url: sanitizedUrl,
      },
    };
  }

  return new PrismaClient(options);
}

// Singleton instantiation reused across warm serverless functions
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Cache on globalThis for both dev and serverless environments to prevent connection exhaustion
globalForPrisma.prisma = prisma;

/**
 * Safe database retry wrapper for transient connection pool resets (e.g. Neon idle timeouts)
 */
export async function withDbRetry<T>(operation: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || '';
      const isConnectionError =
        msg.includes('Closed') ||
        msg.includes('connection') ||
        msg.includes('Connection') ||
        msg.includes('timeout') ||
        err?.code === 'P1001' || // Can't reach database server
        err?.code === 'P1017' || // Server has closed the connection
        err?.code === 'P2024';   // Timed out fetching a new connection from the pool

      if (isConnectionError && attempt < maxRetries) {
        console.warn(`[WIQN DB] Transient connection error (attempt ${attempt + 1}/${maxRetries + 1}), retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
