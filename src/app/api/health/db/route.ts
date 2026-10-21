import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/db';
import { ensureWiqnSchema } from '@/lib/wiqn-schema';

export const dynamic = 'force-dynamic';

const EXPECTED_WIQN_TABLES = [
  'users',
  'projects',
  'experiments',
  'prototypes',
  'visitors',
  'sessions',
  'experiment_events',
  'feedback',
  'feedback_responses',
  'insights',
  'decisions',
  'cardex_publications',
];

function maskHost(rawUrl?: string): string {
  if (!rawUrl) return 'NOT_CONFIGURED';
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname;
    if (host.length <= 8) return '***';
    return `${host.slice(0, 6)}...${host.slice(-10)}`;
  } catch {
    return 'MASKED_INVALID_URL';
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1. Safe connection & environment info
    const dbUrl = process.env.DATABASE_URL;
    const maskedHost = maskHost(dbUrl);

    // 2. Query schemas in DB
    const schemasRaw: any[] = await withDbRetry(() =>
      prisma.$queryRawUnsafe(`SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;`)
    );
    const schemas = schemasRaw.map((s) => s.schema_name);
    const hasWiqnSchema = schemas.includes('wiqn');

    // 3. Query tables in wiqn schema
    const tablesRaw: any[] = await withDbRetry(() =>
      prisma.$queryRawUnsafe(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'wiqn'
        ORDER BY table_name;
      `)
    );
    const existingWiqnTables = tablesRaw.map((t) => t.table_name);
    const missingTables = EXPECTED_WIQN_TABLES.filter((t) => !existingWiqnTables.includes(t));

    // 4. If wiqn schema or tables missing and repair requested, auto-repair
    const shouldRepair = req.nextUrl.searchParams.get('repair') === 'true' || missingTables.length > 0;
    let repairResult = null;
    if (shouldRepair && missingTables.length > 0) {
      repairResult = await ensureWiqnSchema(prisma);
    }

    // 5. Test Prisma User query
    let userCount = -1;
    let prismaUserQueryOk = false;
    let prismaError = null;

    try {
      userCount = await withDbRetry(() => prisma.user.count());
      prismaUserQueryOk = true;
    } catch (uErr: any) {
      prismaError = uErr?.message || String(uErr);
    }

    const isHealthy = hasWiqnSchema && missingTables.length === 0 && prismaUserQueryOk;

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      database: {
        host: maskedHost,
        hasWiqnSchema,
        existingWiqnTablesCount: existingWiqnTables.length,
        expectedWiqnTablesCount: EXPECTED_WIQN_TABLES.length,
        existingTables: existingWiqnTables,
        missingTables,
        prismaUserQueryOk,
        userCount: prismaUserQueryOk ? userCount : undefined,
        prismaError: prismaError ? prismaError.slice(0, 200) : undefined,
        repairAttempted: shouldRepair,
        repairResult,
      },
      timestamp: new Date().toISOString(),
    }, { status: isHealthy ? 200 : 503 });
  } catch (err: any) {
    console.error('[DATABASE HEALTH CHECK] Error:', err);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database health check failed',
        error: err?.message ? err.message.slice(0, 150) : 'Unknown database error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = await ensureWiqnSchema(prisma);
    const userCount = await withDbRetry(() => prisma.user.count()).catch(() => -1);
    return NextResponse.json({
      success: result.success,
      repaired: true,
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
