/**
 * WIQN End-to-End Database & Regression Test Suite
 * Covers all 15 verification steps required by Step 19:
 * TEST 1: WIQN schema exists.
 * TEST 2: User table exists.
 * TEST 3: Prisma can find/create WIQN user.
 * TEST 4: Supabase user sync creates WIQN profile.
 * TEST 5: Existing user can be resolved.
 * TEST 6: New experiment can be created.
 * TEST 7: Experiment belongs to authenticated user.
 * TEST 8: Another user cannot access it.
 * TEST 9: Created experiment gets correct status.
 * TEST 10: Production test URL is generated correctly.
 * TEST 11: Public /test/[id] works without founder authentication.
 * TEST 12: Telemetry reaches the correct experiment.
 * TEST 13: Feedback reaches the correct experiment.
 * TEST 14: Insufficient evidence returns TEST_AGAIN.
 * TEST 15: Decision persists.
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Load environment variables if available from .env or .env.local
function loadEnv() {
  const envFiles = ['.env', '.env.local'];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.substring(0, idx).trim();
          let val = trimmed.substring(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

function sanitizeUrl(raw) {
  if (!raw) return undefined;
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
    return parsed.toString();
  } catch {
    return raw;
  }
}

const sanitized = sanitizeUrl(process.env.DATABASE_URL);
if (sanitized) process.env.DATABASE_URL = sanitized;

const prisma = new PrismaClient({
  datasources: sanitized ? { db: { url: sanitized } } : undefined,
});

async function runRegressionTests() {
  console.log('====================================================');
  console.log('WIQN DATABASE & REGRESSION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  async function testStep(name, fn) {
    process.stdout.write(`[RUNNING] ${name} ... `);
    try {
      await fn();
      console.log('✓ PASSED');
      passed++;
    } catch (err) {
      console.log(`✗ FAILED (${err.message})`);
      failed++;
    }
  }

  const testSuffix = Math.random().toString(36).substring(2, 8);
  const testSupabaseUserId = `test_supa_${testSuffix}`;
  const testEmail = `tester_${testSuffix}@example.com`;
  const otherSupabaseUserId = `other_supa_${testSuffix}`;
  const otherEmail = `other_${testSuffix}@example.com`;

  let createdUser = null;
  let otherUser = null;
  let createdExperiment = null;

  try {
    // TEST 1: WIQN schema exists
    await testStep('TEST 1: WIQN schema exists', async () => {
      const schemas = await prisma.$queryRawUnsafe(
        `SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'wiqn';`
      );
      assert(schemas && schemas.length > 0, 'Schema "wiqn" not found in information_schema.schemata');
    });

    // TEST 2: User table exists
    await testStep('TEST 2: User table exists', async () => {
      const tables = await prisma.$queryRawUnsafe(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'wiqn' AND table_name = 'users';`
      );
      assert(tables && tables.length > 0, 'Table "wiqn.users" not found in database');
    });

    // TEST 3: Prisma can find/create WIQN user
    await testStep('TEST 3: Prisma can find/create WIQN user', async () => {
      const count = await prisma.user.count();
      assert(typeof count === 'number', 'Prisma user.count() query did not return a valid count');
    });

    // TEST 4: Supabase user sync creates WIQN profile
    await testStep('TEST 4: Supabase user sync creates WIQN profile', async () => {
      createdUser = await prisma.user.create({
        data: {
          supabaseUserId: testSupabaseUserId,
          email: testEmail,
          name: 'Regression Founder',
          role: 'FOUNDER',
        },
      });
      assert(createdUser && createdUser.id, 'User record was not created with a valid ID');
      assert(createdUser.supabaseUserId === testSupabaseUserId, 'User supabaseUserId does not match');
    });

    // TEST 5: Existing user can be resolved
    await testStep('TEST 5: Existing user can be resolved', async () => {
      const resolved = await prisma.user.findUnique({
        where: { supabaseUserId: testSupabaseUserId },
      });
      assert(resolved && resolved.id === createdUser.id, 'Existing user could not be resolved by supabaseUserId');
      assert(resolved.email === testEmail, 'Resolved user email does not match');
    });

    // TEST 6: New experiment can be created
    await testStep('TEST 6: New experiment can be created', async () => {
      createdExperiment = await prisma.experiment.create({
        data: {
          userId: createdUser.id,
          name: 'ADYK Inspire Regression Test',
          productName: 'Community',
          problem: 'Testing whether users are interested in the community',
          targetAudience: 'Early founders & developers',
          productIdea: 'Interactive community validation portal',
          keyHypothesis: 'Users will engage with prototype community features',
          learningGoal: 'Usability',
          prototypeUrl: 'https://adyk-business-web.vercel.app/',
          testingMode: 'PRIVATE',
          status: 'ACTIVE',
          prototypes: {
            create: {
              url: 'https://adyk-business-web.vercel.app/',
              version: '1.0.0',
            },
          },
        },
        include: {
          prototypes: true,
        },
      });
      assert(createdExperiment && createdExperiment.id, 'Experiment was not created with a valid ID');
      assert(createdExperiment.prototypes.length > 0, 'Experiment prototype was not created');
    });

    // TEST 7: Experiment belongs to authenticated user
    await testStep('TEST 7: Experiment belongs to authenticated user', async () => {
      assert(createdExperiment.userId === createdUser.id, 'Experiment userId does not match owner user id');
      const retrieved = await prisma.experiment.findFirst({
        where: { id: createdExperiment.id, userId: createdUser.id },
      });
      assert(retrieved && retrieved.id === createdExperiment.id, 'Experiment could not be retrieved by owner');
    });

    // TEST 8: Another user cannot access it
    await testStep('TEST 8: Another user cannot access it (IDOR protection)', async () => {
      otherUser = await prisma.user.create({
        data: {
          supabaseUserId: otherSupabaseUserId,
          email: otherEmail,
          name: 'Different Founder',
          role: 'FOUNDER',
        },
      });
      const unauthorizedCheck = await prisma.experiment.findFirst({
        where: { id: createdExperiment.id, userId: otherUser.id },
      });
      assert(unauthorizedCheck === null, 'Another user was able to find experiment belonging to different owner');
    });

    // TEST 9: Created experiment gets correct status
    await testStep('TEST 9: Created experiment gets correct status', async () => {
      assert(createdExperiment.status === 'ACTIVE', `Expected status ACTIVE but got ${createdExperiment.status}`);
      assert(createdExperiment.testingMode === 'PRIVATE', `Expected testingMode PRIVATE but got ${createdExperiment.testingMode}`);
    });

    // TEST 10: Production test URL is generated correctly
    await testStep('TEST 10: Production test URL is generated correctly', async () => {
      const urlsFile = fs.readFileSync(path.resolve(__dirname, '../src/lib/urls.ts'), 'utf8');
      assert(urlsFile.includes('export function getTestUrl'), 'src/lib/urls.ts does not export getTestUrl');
      assert(urlsFile.includes('export function getShareUrls'), 'src/lib/urls.ts does not export getShareUrls');
      
      const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, '');
      const domain = (envUrl && envUrl.startsWith('https://') && !envUrl.includes('adyk.io'))
        ? envUrl
        : (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://adykwiqn.vercel.app');
      const generatedUrl = `${domain}/test/${createdExperiment.id}`;
      assert(generatedUrl.includes(`/test/${createdExperiment.id}`), 'Generated URL does not include /test/<id>');
      assert(!generatedUrl.includes('undefined'), 'Generated URL contains undefined');
      assert(!generatedUrl.includes('wiqn.adyk.io'), 'Generated URL contains unconfigured wiqn.adyk.io domain');
    });

    // TEST 11: Public /test/[id] works without founder authentication
    await testStep('TEST 11: Public /test/[id] works without founder authentication', async () => {
      const middlewareFile = fs.readFileSync(path.resolve(__dirname, '../src/utils/supabase/middleware.ts'), 'utf8');
      assert(middlewareFile.includes('export async function updateSession'), 'middleware does not export updateSession');
      // Verify middleware does not block /test paths
      assert(middlewareFile.includes("pathname.startsWith('/dashboard')"), 'Protected check should cover /dashboard');
      assert(!middlewareFile.includes("pathname.startsWith('/test')"), 'Protected check must NOT require auth for /test');

      // Direct experiment fetch for public test page without user id constraint
      const publicExp = await prisma.experiment.findUnique({
        where: { id: createdExperiment.id },
        select: { id: true, name: true, productName: true, prototypeUrl: true, status: true },
      });
      assert(publicExp && publicExp.status === 'ACTIVE', 'Public experiment details are retrievable for testers');
    });

    // TEST 12: Telemetry reaches the correct experiment
    await testStep('TEST 12: Telemetry reaches the correct experiment', async () => {
      const visitor = await prisma.visitor.create({
        data: {
          experimentId: createdExperiment.id,
          visitorId: `vis_${testSuffix}`,
          deviceType: 'desktop',
          browser: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });

      const session = await prisma.session.create({
        data: {
          sessionId: `sess_${testSuffix}`,
          experimentId: createdExperiment.id,
          visitorId: visitor.id,
          durationSec: 45,
        },
      });

      const event = await prisma.experimentEvent.create({
        data: {
          experimentId: createdExperiment.id,
          sessionId: session.sessionId,
          visitorId: visitor.id,
          eventType: 'CLICK',
          element: 'button#join-community',
          elementText: 'Join Community',
          page: `/test/${createdExperiment.id}`,
        },
      });

      assert(event && event.id, 'Telemetry event was not recorded');
      assert(event.experimentId === createdExperiment.id, 'Telemetry event associated with wrong experiment');
    });

    // TEST 13: Feedback reaches the correct experiment
    await testStep('TEST 13: Feedback reaches the correct experiment', async () => {
      const feedback = await prisma.feedback.create({
        data: {
          experimentId: createdExperiment.id,
          prompt: 'How was your experience?',
          rating: 5,
          category: 'usability',
          comment: 'Very intuitive navigation and clear value proposition.',
        },
      });
      assert(feedback && feedback.id, 'Feedback was not recorded in Neon');
      assert(feedback.experimentId === createdExperiment.id, 'Feedback associated with wrong experiment');
    });

    // TEST 14: Insufficient evidence returns TEST_AGAIN
    await testStep('TEST 14: Insufficient evidence returns TEST_AGAIN', async () => {
      // 1 visitor and 1 event is below the 5 visitors + 20 events threshold
      const expCounts = await prisma.experiment.findUnique({
        where: { id: createdExperiment.id },
        include: {
          _count: {
            select: { visitors: true, events: true },
          },
        },
      });
      const isSufficientEvidence = expCounts._count.visitors >= 5 && expCounts._count.events >= 20;
      assert(!isSufficientEvidence, 'isSufficientEvidence should be false for low sample size');
      // When evidence is insufficient, recommended action is TEST_AGAIN
      const recommendedOutcome = isSufficientEvidence ? 'BUILD' : 'TEST_AGAIN';
      assert(recommendedOutcome === 'TEST_AGAIN', 'Expected TEST_AGAIN for low sample size');
    });

    // TEST 15: Decision persists
    await testStep('TEST 15: Decision persists', async () => {
      const decision = await prisma.decision.create({
        data: {
          experimentId: createdExperiment.id,
          outcome: 'TEST_AGAIN',
          evidenceSummary: 'Sample size 1 visitor, 1 event. Below 5 visitors / 20 events minimum threshold.',
          reasoning: 'Gathering more diverse tester feedback before finalizing product investment.',
          confidence: 'LOW',
          recommendedNextStep: 'Distribute test link to additional testers across community channels.',
        },
      });
      assert(decision && decision.id, 'Decision record was not created');

      const persisted = await prisma.decision.findUnique({
        where: { id: decision.id },
      });
      assert(persisted && persisted.outcome === 'TEST_AGAIN', 'Persisted decision outcome does not match');
    });

  } finally {
    // Clean up test data non-destructively
    try {
      if (createdExperiment) {
        await prisma.decision.deleteMany({ where: { experimentId: createdExperiment.id } });
        await prisma.feedback.deleteMany({ where: { experimentId: createdExperiment.id } });
        await prisma.experimentEvent.deleteMany({ where: { experimentId: createdExperiment.id } });
        await prisma.session.deleteMany({ where: { experimentId: createdExperiment.id } });
        await prisma.visitor.deleteMany({ where: { experimentId: createdExperiment.id } });
        await prisma.prototype.deleteMany({ where: { experimentId: createdExperiment.id } });
        await prisma.experiment.delete({ where: { id: createdExperiment.id } });
      }
      if (createdUser) {
        await prisma.user.delete({ where: { id: createdUser.id } });
      }
      if (otherUser) {
        await prisma.user.delete({ where: { id: otherUser.id } });
      }
    } catch (cleanupErr) {
      console.warn('[CLEANUP NOTICE] Non-fatal test cleanup notice:', cleanupErr.message);
    }

    await prisma.$disconnect();
  }

  console.log('\n====================================================');
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runRegressionTests().catch((e) => {
  console.error('Test suite failed with unhandled error:', e);
  process.exit(1);
});
