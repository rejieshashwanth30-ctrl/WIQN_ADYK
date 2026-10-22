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
  let raw = process.env.DATABASE_URL;

  // Canonical fallback if DATABASE_URL is unset, empty, or points to deprecated Prisma Data Proxy / Accelerate
  const CANONICAL_NEON_URL =
    'postgresql://neondb_owner:npg_NvejApK02Wyt@ep-crimson-water-b57gv6za-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';

  if (!raw || typeof raw !== 'string' || raw.includes('db.prisma.io') || raw.includes('accelerate.prisma-data.net')) {
    raw = CANONICAL_NEON_URL;
  }

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

    // 5. Set adequate connection_limit for serverless functions (5 allows concurrent query operations without pool starvation)
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      if (!parsed.searchParams.has('connection_limit')) {
        parsed.searchParams.set('connection_limit', '5');
      }
    }

    // 6. Ensure default schema is set to wiqn for consistent search path
    if (!parsed.searchParams.has('schema')) {
      parsed.searchParams.set('schema', 'wiqn');
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
    if (!fallback.includes('schema=')) {
      fallback += '&schema=wiqn';
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
 * Safe database retry wrapper for transient connection pool resets and Neon cold wakeups
 */
export async function withDbRetry<T>(operation: () => Promise<T>, maxRetries = 4): Promise<T> {
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
        msg.includes('ECONNRESET') ||
        msg.includes('ETIMEDOUT') ||
        msg.includes('ECONNREFUSED') ||
        msg.includes('EPIPE') ||
        msg.includes('prepared statement') ||
        err?.code === 'P1001' || // Can't reach database server
        err?.code === 'P1002' || // Database server reached but timed out
        err?.code === 'P1008' || // Operations timed out
        err?.code === 'P1017' || // Server has closed the connection
        err?.code === 'P2024' || // Timed out fetching a new connection from the pool
        err?.code === 'P2028';   // Transaction API error

      if (isConnectionError && attempt < maxRetries) {
        const backoffMs = Math.min(2500, Math.round(350 * Math.pow(2, attempt)));
        console.warn(`[WIQN DB] Transient Neon connection error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${backoffMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }

      // Self-healing: if a missing schema or table error is encountered, run safe idempotent schema initialization once
      const isMissingTableError =
        err?.code === 'P2021' ||
        err?.code === '42P01' ||
        msg.includes('does not exist') ||
        msg.includes('wiqn.users') ||
        msg.includes('relation "wiqn.');

      if (isMissingTableError && attempt === 0) {
        console.warn(`[WIQN DB] Missing table detected (${msg.slice(0, 120)}). Triggering automatic schema repair...`);
        try {
          const { ensureWiqnSchema } = await import('@/lib/wiqn-schema');
          await ensureWiqnSchema(prisma);
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        } catch (repairErr: any) {
          console.error('[WIQN DB] Automatic schema repair failed:', repairErr?.message || repairErr);
        }
      }

      throw err;
    }
  }
  throw lastError;
}
