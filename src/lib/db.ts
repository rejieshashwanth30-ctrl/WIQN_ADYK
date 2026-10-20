import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Normalizes PostgreSQL connection string for maximum compatibility across
 * Vercel serverless functions, Neon transaction poolers, and local development.
 * Uses WHATWG URL parsing to safely eliminate SCRAM channel_binding, ensure sslmode=require,
 * configure pgbouncer=true for Neon poolers, and set reliable connection timeouts.
 */
export function getSanitizedDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw || typeof raw !== 'string') return undefined;

  try {
    const parsed = new URL(raw);

    // 1. Remove unsupported channel_binding (SCRAM channel binding fails on connection poolers)
    parsed.searchParams.delete('channel_binding');

    // 2. Normalize sslmode to require (verify-full requires custom CA bundle not available on serverless)
    const currentSsl = parsed.searchParams.get('sslmode');
    if (!currentSsl || currentSsl === 'verify-full' || currentSsl === 'prefer') {
      parsed.searchParams.set('sslmode', 'require');
    }

    // 3. For Neon connection poolers (-pooler), ensure pgbouncer=true is enabled
    // This instructs Prisma to disable prepared statements, which are not supported in PgBouncer transaction mode.
    if (parsed.hostname.includes('-pooler')) {
      parsed.searchParams.set('pgbouncer', 'true');
    }

    // 4. Ensure resilient connection timeout for serverless cold starts & wakeups
    if (!parsed.searchParams.has('connect_timeout')) {
      parsed.searchParams.set('connect_timeout', '15');
    }

    // 5. Ensure connection_limit=1 for serverless functions to prevent pool exhaustion
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      if (!parsed.searchParams.has('connection_limit')) {
        parsed.searchParams.set('connection_limit', '1');
      }
    }

    return parsed.toString();
  } catch {
    // Safe fallback if raw string is somehow malformed
    let fallback = raw
      .replace(/[?&]channel_binding=[^&]+/g, '')
      .replace('sslmode=verify-full', 'sslmode=require');

    if (!fallback.includes('?')) {
      const ampersandIdx = fallback.indexOf('&');
      if (ampersandIdx !== -1) {
        fallback = fallback.substring(0, ampersandIdx) + '?' + fallback.substring(ampersandIdx + 1);
      }
    }

    if (!fallback.includes('sslmode=')) {
      fallback += (fallback.includes('?') ? '&' : '?') + 'sslmode=require';
    }
    if (!fallback.includes('connect_timeout=')) {
      fallback += '&connect_timeout=15';
    }
    if (fallback.includes('-pooler') && !fallback.includes('pgbouncer=')) {
      fallback += '&pgbouncer=true';
    }
    return fallback;
  }
}

function createPrismaClient(): PrismaClient {
  const sanitizedUrl = getSanitizedDatabaseUrl();

  // Synchronize process.env.DATABASE_URL so Prisma's query engine core also sees the sanitized URL
  if (sanitizedUrl) {
    process.env.DATABASE_URL = sanitizedUrl;
  }

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
        msg.includes('reach database') ||
        msg.includes('terminating connection') ||
        msg.includes('Connection reset') ||
        err?.code === 'P1001' || // Can't reach database server
        err?.code === 'P1017' || // Server has closed the connection
        err?.code === 'P2024';   // Timed out fetching a new connection from the pool

      if (isConnectionError && attempt < maxRetries) {
        console.warn(`[WIQN DB] Transient connection error (attempt ${attempt + 1}/${maxRetries + 1}), retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
