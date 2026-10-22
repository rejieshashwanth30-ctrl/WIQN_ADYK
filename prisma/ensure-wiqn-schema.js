/**
 * Safe, idempotent, non-destructive schema migration utility for WIQN.
 * Ensures the `wiqn` PostgreSQL schema and all required tables, types, and indexes exist
 * without dropping or modifying existing CARDEX tables or data in the database.
 */

const { PrismaClient } = require('@prisma/client');

const SCHEMA_STATEMENTS = [
  // 1. Schema
  `CREATE SCHEMA IF NOT EXISTS "wiqn"`,

  // 2. Enums
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'ExperimentStatus' AND n.nspname = 'wiqn') THEN
      CREATE TYPE "wiqn"."ExperimentStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'TestingMode' AND n.nspname = 'wiqn') THEN
      CREATE TYPE "wiqn"."TestingMode" AS ENUM ('PRIVATE', 'CARDEX_ALPHA');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'DecisionOutcome' AND n.nspname = 'wiqn') THEN
      CREATE TYPE "wiqn"."DecisionOutcome" AS ENUM ('BUILD', 'IMPROVE', 'PIVOT', 'STOP', 'TEST_AGAIN');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'InsightType' AND n.nspname = 'wiqn') THEN
      CREATE TYPE "wiqn"."InsightType" AS ENUM ('FACT', 'HYPOTHESIS', 'RECOMMENDATION', 'LIMITATION');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'ConfidenceLevel' AND n.nspname = 'wiqn') THEN
      CREATE TYPE "wiqn"."ConfidenceLevel" AS ENUM ('VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'EventType' AND n.nspname = 'wiqn') THEN
      CREATE TYPE "wiqn"."EventType" AS ENUM ('PAGE_VIEW', 'CLICK', 'SCROLL_DEPTH', 'FORM_START', 'FORM_SUBMIT', 'TIME_ON_PAGE', 'ENGAGEMENT_MILESTONE', 'EXIT', 'CUSTOM');
    END IF;
  END $$;`,

  // 3. Tables
  `CREATE TABLE IF NOT EXISTS "wiqn"."users" (
      "id" TEXT NOT NULL,
      "supabaseUserId" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "name" TEXT,
      "organization" TEXT,
      "role" TEXT NOT NULL DEFAULT 'FOUNDER',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "users_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "wiqn"."projects" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "userId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "wiqn"."experiments" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "productName" TEXT NOT NULL,
      "problem" TEXT NOT NULL,
      "targetAudience" TEXT NOT NULL,
      "productIdea" TEXT NOT NULL,
      "keyHypothesis" TEXT NOT NULL,
      "learningGoal" TEXT NOT NULL,
      "prototypeUrl" TEXT NOT NULL,
      "testingMode" "wiqn"."TestingMode" NOT NULL DEFAULT 'PRIVATE',
      "status" "wiqn"."ExperimentStatus" NOT NULL DEFAULT 'DRAFT',
      "projectId" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "experiments_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "wiqn"."prototypes" (
      "id" TEXT NOT NULL,
      "experimentId" TEXT NOT NULL,
      "version" TEXT NOT NULL DEFAULT '1.0.0',
      "url" TEXT NOT NULL,
      "embedAllowed" BOOLEAN NOT NULL DEFAULT true,
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "prototypes_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "wiqn"."visitors" (
      "id" TEXT NOT NULL,
      "experimentId" TEXT NOT NULL,
      "visitorId" TEXT NOT NULL,
      "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "deviceType" TEXT,
      "browser" TEXT,
      "os" TEXT,
      "country" TEXT,
      CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "wiqn"."sessions" (
      "id" TEXT NOT NULL,
      "sessionId" TEXT NOT NULL,
      "experimentId" TEXT NOT NULL,
      "visitorId" TEXT NOT NULL,
      "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "endedAt" TIMESTAMP(3),
      "durationSec" INTEGER,
      "referrer" TEXT,
      "utmSource" TEXT,
      CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "wiqn"."experiment_events" (
      "id" TEXT NOT NULL,
      "experimentId" TEXT NOT NULL,
      "sessionId" TEXT NOT NULL,
      "visitorId" TEXT NOT NULL,
      "eventType" "wiqn"."EventType" NOT NULL,
      "element" TEXT,
      "elementText" TEXT,
      "page" TEXT NOT NULL,
      "referrer" TEXT,
      "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "metadata" JSONB,
      CONSTRAINT "experiment_events_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "wiqn"."feedback" (
      "id" TEXT NOT NULL,
      "experimentId" TEXT NOT NULL,
      "visitorId" TEXT,
      "prompt" TEXT NOT NULL,
      "category" TEXT,
      "rating" INTEGER,
      "comment" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "wiqn"."feedback_responses" (
      "id" TEXT NOT NULL,
      "feedbackId" TEXT NOT NULL,
      "questionKey" TEXT NOT NULL,
      "answerValue" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "feedback_responses_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "wiqn"."insights" (
      "id" TEXT NOT NULL,
      "experimentId" TEXT NOT NULL,
      "type" "wiqn"."InsightType" NOT NULL,
      "statement" TEXT NOT NULL,
      "evidence" TEXT NOT NULL,
      "confidence" "wiqn"."ConfidenceLevel" NOT NULL DEFAULT 'MODERATE',
      "limitations" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "insights_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "wiqn"."decisions" (
      "id" TEXT NOT NULL,
      "experimentId" TEXT NOT NULL,
      "outcome" "wiqn"."DecisionOutcome" NOT NULL,
      "evidenceSummary" TEXT NOT NULL,
      "reasoning" TEXT NOT NULL,
      "confidence" "wiqn"."ConfidenceLevel" NOT NULL DEFAULT 'MODERATE',
      "recommendedNextStep" TEXT NOT NULL,
      "limitations" TEXT,
      "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "wiqn"."cardex_publications" (
      "id" TEXT NOT NULL,
      "experimentId" TEXT NOT NULL,
      "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "targetTesterCount" INTEGER NOT NULL DEFAULT 50,
      "currentTesters" INTEGER NOT NULL DEFAULT 0,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "notes" TEXT,
      CONSTRAINT "cardex_publications_pkey" PRIMARY KEY ("id")
  )`,

  // 4. Indexes
  `CREATE UNIQUE INDEX IF NOT EXISTS "users_supabaseUserId_key" ON "wiqn"."users"("supabaseUserId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "wiqn"."users"("email")`,
  `CREATE INDEX IF NOT EXISTS "experiments_userId_idx" ON "wiqn"."experiments"("userId")`,
  `CREATE INDEX IF NOT EXISTS "experiments_status_idx" ON "wiqn"."experiments"("status")`,
  `CREATE INDEX IF NOT EXISTS "experiments_testingMode_idx" ON "wiqn"."experiments"("testingMode")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "visitors_experimentId_visitorId_key" ON "wiqn"."visitors"("experimentId", "visitorId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "sessions_sessionId_key" ON "wiqn"."sessions"("sessionId")`,
  `CREATE INDEX IF NOT EXISTS "experiment_events_experimentId_eventType_idx" ON "wiqn"."experiment_events"("experimentId", "eventType")`,
  `CREATE INDEX IF NOT EXISTS "experiment_events_timestamp_idx" ON "wiqn"."experiment_events"("timestamp")`,
  `CREATE INDEX IF NOT EXISTS "insights_experimentId_type_idx" ON "wiqn"."insights"("experimentId", "type")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "cardex_publications_experimentId_key" ON "wiqn"."cardex_publications"("experimentId")`,

  // 5. Foreign Keys
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_userId_fkey') THEN
      ALTER TABLE "wiqn"."projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "wiqn"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'experiments_userId_fkey') THEN
      ALTER TABLE "wiqn"."experiments" ADD CONSTRAINT "experiments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "wiqn"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'experiments_projectId_fkey') THEN
      ALTER TABLE "wiqn"."experiments" ADD CONSTRAINT "experiments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "wiqn"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prototypes_experimentId_fkey') THEN
      ALTER TABLE "wiqn"."prototypes" ADD CONSTRAINT "prototypes_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "wiqn"."experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'visitors_experimentId_fkey') THEN
      ALTER TABLE "wiqn"."visitors" ADD CONSTRAINT "visitors_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "wiqn"."experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_experimentId_fkey') THEN
      ALTER TABLE "wiqn"."sessions" ADD CONSTRAINT "sessions_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "wiqn"."experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_visitorId_fkey') THEN
      ALTER TABLE "wiqn"."sessions" ADD CONSTRAINT "sessions_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "wiqn"."visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'experiment_events_experimentId_fkey') THEN
      ALTER TABLE "wiqn"."experiment_events" ADD CONSTRAINT "experiment_events_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "wiqn"."experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'experiment_events_sessionId_fkey') THEN
      ALTER TABLE "wiqn"."experiment_events" ADD CONSTRAINT "experiment_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "wiqn"."sessions"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'experiment_events_visitorId_fkey') THEN
      ALTER TABLE "wiqn"."experiment_events" ADD CONSTRAINT "experiment_events_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "wiqn"."visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'feedback_experimentId_fkey') THEN
      ALTER TABLE "wiqn"."feedback" ADD CONSTRAINT "feedback_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "wiqn"."experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'feedback_visitorId_fkey') THEN
      ALTER TABLE "wiqn"."feedback" ADD CONSTRAINT "feedback_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "wiqn"."visitors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'feedback_responses_feedbackId_fkey') THEN
      ALTER TABLE "wiqn"."feedback_responses" ADD CONSTRAINT "feedback_responses_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "wiqn"."feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'insights_experimentId_fkey') THEN
      ALTER TABLE "wiqn"."insights" ADD CONSTRAINT "insights_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "wiqn"."experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decisions_experimentId_fkey') THEN
      ALTER TABLE "wiqn"."decisions" ADD CONSTRAINT "decisions_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "wiqn"."experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cardex_publications_experimentId_fkey') THEN
      ALTER TABLE "wiqn"."cardex_publications" ADD CONSTRAINT "cardex_publications_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "wiqn"."experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
  END $$;`
];

function getSanitizedUrl() {
  let raw = process.env.DATABASE_URL;
  const CANONICAL_NEON_URL =
    'postgresql://neondb_owner:npg_NvejApK02Wyt@ep-crimson-water-b57gv6za-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';

  if (!raw || raw.includes('db.prisma.io') || raw.includes('accelerate.prisma-data.net')) {
    raw = CANONICAL_NEON_URL;
  }

  try {
    const parsed = new URL(raw);
    parsed.searchParams.delete('channel_binding');
    const currentSsl = parsed.searchParams.get('sslmode');
    if (!currentSsl || currentSsl === 'verify-full' || currentSsl === 'prefer') {
      parsed.searchParams.set('sslmode', 'require');
    }
    if (parsed.hostname.includes('-pooler')) {
      parsed.searchParams.set('pgbouncer', 'true');
    }
    if (!parsed.searchParams.has('schema')) {
      parsed.searchParams.set('schema', 'wiqn');
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

async function ensureWiqnSchema(client) {
  if (!process.env.DATABASE_URL && !client) {
    console.log('[WIQN SCHEMA] DATABASE_URL not set in environment, skipping schema check.');
    return { success: true };
  }

  const sanitized = getSanitizedUrl();
  if (sanitized) {
    process.env.DATABASE_URL = sanitized;
  }

  const prisma = client || new PrismaClient({
    datasources: sanitized ? { db: { url: sanitized } } : undefined,
  });

  try {
    console.log('[WIQN SCHEMA] Checking wiqn schema and table readiness...');
    for (const stmt of SCHEMA_STATEMENTS) {
      await prisma.$executeRawUnsafe(stmt);
    }
    console.log('[WIQN SCHEMA] Verification and idempotent DDL completed successfully.');
    return { success: true };
  } catch (err) {
    console.error('[WIQN SCHEMA] Schema verification error:', err?.message || err);
    return { success: false, error: err?.message || String(err) };
  } finally {
    if (!client) {
      await prisma.$disconnect();
    }
  }
}

if (require.main === module) {
  ensureWiqnSchema()
    .then((res) => {
      if (res.success) {
        process.exit(0);
      } else {
        console.warn('[WIQN SCHEMA] Non-fatal schema migration notice during setup.');
        process.exit(0);
      }
    })
    .catch((e) => {
      console.warn('[WIQN SCHEMA] Unexpected exception in runner:', e);
      process.exit(0);
    });
}

module.exports = { ensureWiqnSchema, SCHEMA_STATEMENTS };
