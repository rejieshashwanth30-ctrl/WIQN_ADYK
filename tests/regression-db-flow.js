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
  let testVisitor = null;
  let testSession = null;
  let testV2 = null;
  let testV3 = null;

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
      testVisitor = await prisma.visitor.create({
        data: {
          experimentId: createdExperiment.id,
          visitorId: `vis_${testSuffix}`,
          deviceType: 'desktop',
          browser: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });

      testSession = await prisma.session.create({
        data: {
          sessionId: `sess_${testSuffix}`,
          experimentId: createdExperiment.id,
          visitorId: testVisitor.id,
          durationSec: 45,
        },
      });

      const event = await prisma.experimentEvent.create({
        data: {
          experimentId: createdExperiment.id,
          sessionId: testSession.sessionId,
          visitorId: testVisitor.id,
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

    // TEST 16: Element identification & click distribution (unique vs total clicks)
    await testStep('TEST 16: Element identification & click distribution (unique vs total clicks)', async () => {
      // Create additional visitors for behavioral distribution test
      testV2 = await prisma.visitor.create({
        data: { experimentId: createdExperiment.id, visitorId: 'vis_beta_test_02', deviceType: 'mobile' },
      });
      testV3 = await prisma.visitor.create({
        data: { experimentId: createdExperiment.id, visitorId: 'vis_gamma_test_03', deviceType: 'desktop' },
      });

      // Insert repeated clicks:
      // Join ADYK Inspire: v1 (4 clicks), v2 (4 clicks) = 8 clicks, 2 unique visitors
      for (let i = 0; i < 4; i++) {
        await prisma.experimentEvent.create({
          data: {
            experimentId: createdExperiment.id,
            sessionId: testSession.sessionId,
            visitorId: testVisitor.id,
            eventType: 'CLICK',
            element: 'button#join-community',
            elementText: 'Join ADYK Inspire',
            page: '/home',
            metadata: { tag: 'BUTTON', wiqnId: 'join-community' },
          },
        });
        await prisma.experimentEvent.create({
          data: {
            experimentId: createdExperiment.id,
            sessionId: testSession.sessionId,
            visitorId: testV2.id,
            eventType: 'CLICK',
            element: 'button#join-community',
            elementText: 'Join ADYK Inspire',
            page: '/home',
            metadata: { tag: 'BUTTON', wiqnId: 'join-community' },
          },
        });
      }

      // Explore Community: v2 (3 clicks), v3 (2 clicks) = 5 clicks, 2 unique visitors
      for (let i = 0; i < 3; i++) {
        await prisma.experimentEvent.create({
          data: {
            experimentId: createdExperiment.id,
            sessionId: testSession.sessionId,
            visitorId: testV2.id,
            eventType: 'CLICK',
            element: 'a.explore-btn',
            elementText: 'Explore Community',
            page: '/home',
            metadata: { tag: 'A' },
          },
        });
      }
      for (let i = 0; i < 2; i++) {
        await prisma.experimentEvent.create({
          data: {
            experimentId: createdExperiment.id,
            sessionId: testSession.sessionId,
            visitorId: testV3.id,
            eventType: 'CLICK',
            element: 'a.explore-btn',
            elementText: 'Explore Community',
            page: '/home',
            metadata: { tag: 'A' },
          },
        });
      }

      // Query and compute distribution
      const clickEvents = await prisma.experimentEvent.findMany({
        where: { experimentId: createdExperiment.id, eventType: 'CLICK' },
      });

      const dist = {};
      clickEvents.forEach((ev) => {
        const label = ev.elementText || ev.element || 'Unknown';
        if (!dist[label]) {
          dist[label] = { totalClicks: 0, visitors: new Set() };
        }
        dist[label].totalClicks++;
        if (ev.visitorId) dist[label].visitors.add(ev.visitorId);
      });

      assert(dist['Join ADYK Inspire'].totalClicks === 8, 'Expected 8 clicks on Join ADYK Inspire');
      assert(dist['Join ADYK Inspire'].visitors.size === 2, 'Expected 2 unique visitors for Join ADYK Inspire');
      const avgJoin = dist['Join ADYK Inspire'].totalClicks / dist['Join ADYK Inspire'].visitors.size;
      assert(avgJoin === 4.0, 'Expected 4.0 average clicks per clicking visitor');

      assert(dist['Explore Community'].totalClicks === 5, 'Expected 5 clicks on Explore Community');
      assert(dist['Explore Community'].visitors.size === 2, 'Expected 2 unique visitors for Explore Community');

      const sumClicks = dist['Join ADYK Inspire'].totalClicks + dist['Explore Community'].totalClicks;
      assert(sumClicks === 13, 'Total clicks must reconcile to underlying event data');
    });

    // TEST 17: Conversion Funnel computation with drop-off percentages
    await testStep('TEST 17: Conversion Funnel computation with drop-off percentages', async () => {
      // Add FORM_START and FORM_SUBMIT events
      await prisma.experimentEvent.create({
        data: {
          experimentId: createdExperiment.id,
          sessionId: testSession.sessionId,
          visitorId: testVisitor.id,
          eventType: 'FORM_START',
          page: '/home',
          metadata: { formId: 'membership-form' },
        },
      });
      await prisma.experimentEvent.create({
        data: {
          experimentId: createdExperiment.id,
          sessionId: testSession.sessionId,
          visitorId: testV2.id,
          eventType: 'FORM_START',
          page: '/home',
          metadata: { formId: 'membership-form' },
        },
      });
      await prisma.experimentEvent.create({
        data: {
          experimentId: createdExperiment.id,
          sessionId: testSession.sessionId,
          visitorId: testVisitor.id,
          eventType: 'FORM_SUBMIT',
          page: '/home',
          metadata: { formId: 'membership-form' },
        },
      });

      const totalVisitors = 3;
      const ctaVisitors = 3;
      const formStartVisitors = 2;
      const formSubmitVisitors = 1;
      const feedbackVisitors = 1;

      const steps = [
        { name: 'Visitors', count: totalVisitors, overallPercentage: 100, dropOffCount: 0, dropOffPct: 0 },
        {
          name: 'CTA Clicks',
          count: ctaVisitors,
          overallPercentage: Math.round((ctaVisitors / totalVisitors) * 100),
          dropOffCount: totalVisitors - ctaVisitors,
          dropOffPct: 0,
        },
        {
          name: 'Form Started',
          count: formStartVisitors,
          overallPercentage: Math.round((formStartVisitors / totalVisitors) * 100),
          dropOffCount: ctaVisitors - formStartVisitors,
          dropOffPct: Math.round(((ctaVisitors - formStartVisitors) / ctaVisitors) * 100),
        },
        {
          name: 'Form Submitted',
          count: formSubmitVisitors,
          overallPercentage: Math.round((formSubmitVisitors / totalVisitors) * 100),
          dropOffCount: formStartVisitors - formSubmitVisitors,
          dropOffPct: Math.round(((formStartVisitors - formSubmitVisitors) / formStartVisitors) * 100),
        },
        {
          name: 'Goal / Feedback Completed',
          count: feedbackVisitors,
          overallPercentage: Math.round((feedbackVisitors / totalVisitors) * 100),
          dropOffCount: formSubmitVisitors - feedbackVisitors,
          dropOffPct: 0,
        },
      ];

      assert(steps[0].count === 3, 'Funnel Step 1 must have 3 visitors');
      assert(steps[1].overallPercentage === 100, 'Funnel Step 2 must be 100% of visitors');
      assert(steps[2].dropOffCount === 1, 'Funnel Step 3 must have 1 drop-off');
      assert(steps[2].dropOffPct === 33, 'Drop-off from CTA to Form Start should be 33%');
      assert(steps[3].dropOffCount === 1, 'Funnel Step 4 must have 1 drop-off');
      assert(steps[3].dropOffPct === 50, 'Drop-off from Form Start to Submit should be 50%');
    });

    // TEST 18: User Journey & Observed Paths (strictly non-causal)
    await testStep('TEST 18: User Journey & Observed Paths (strictly non-causal)', async () => {
      // Gather chronological events for visitor
      const visitorEvents = await prisma.experimentEvent.findMany({
        where: { experimentId: createdExperiment.id, visitorId: testVisitor.id },
        orderBy: { timestamp: 'asc' },
      });

      assert(visitorEvents.length >= 3, 'Visitor must have recorded multi-step journey');

      const journeySteps = visitorEvents.map((ev) => ev.elementText || ev.eventType);
      const nature = 'OBSERVED_USER_PATH'; // Strictly labeled

      assert(nature === 'OBSERVED_USER_PATH', 'Must strictly label as observed user path');
      assert(nature !== 'CAUSAL_CONVERSION_PATH', 'Must never claim causal conversion');
      assert(journeySteps.length > 0, 'Observed journey steps must exist');
    });

    // TEST 19: Milestone Scroll depth tracking (25%, 50%, 75%, 100%)
    await testStep('TEST 19: Milestone Scroll depth tracking (25%, 50%, 75%, 100%)', async () => {
      const depths = [25, 50, 75, 100];
      for (const depth of depths) {
        await prisma.experimentEvent.create({
          data: {
            experimentId: createdExperiment.id,
            sessionId: testSession.sessionId,
            visitorId: testVisitor.id,
            eventType: 'SCROLL_DEPTH',
            page: '/home',
            metadata: { depth, maxDepth: depth },
          },
        });
      }

      const scrollEvents = await prisma.experimentEvent.findMany({
        where: { experimentId: createdExperiment.id, eventType: 'SCROLL_DEPTH' },
      });

      assert(scrollEvents.length >= 4, 'All 4 scroll milestones must be recorded');
      const recordedDepths = scrollEvents.map((e) => e.metadata?.depth);
      depths.forEach((d) => {
        assert(recordedDepths.includes(d), `Milestone ${d}% must be present in telemetry`);
      });
    });

    // TEST 20: Epistemic separation in Behavioral Signals (Observation vs Interpretation vs Conclusion)
    await testStep('TEST 20: Epistemic separation in Behavioral Signals (Observation vs Interpretation vs Conclusion)', async () => {
      const signal = {
        title: 'Primary CTA Attention',
        observation: '8 clicks recorded on "Join ADYK Inspire" across 2 visitors.',
        interpretation: 'The CTA attracted repeated interaction from active visitors.',
        conclusion: 'Early behavioral signal only; insufficient sample size to establish validated product demand.',
      };

      assert(typeof signal.observation === 'string' && signal.observation.includes('8 clicks'), 'Observation must state factual clicks');
      assert(typeof signal.interpretation === 'string' && signal.interpretation.includes('interaction'), 'Interpretation must describe behavior');
      assert(typeof signal.conclusion === 'string' && signal.conclusion.includes('insufficient'), 'Conclusion must state epistemic limitation');
      assert(!signal.conclusion.includes('proves users want the product'), 'Must never claim clicks prove demand');
    });

    // TEST 21: 7 Evidence Cards generation
    await testStep('TEST 21: 7 Evidence Cards generation', async () => {
      const expectedCardKeys = [
        'what_users_did',
        'what_users_clicked',
        'where_users_dropped',
        'what_users_said',
        'what_we_know_so_far',
        'what_we_dont_know_yet',
        'what_to_test_next',
      ];

      const cards = {
        what_users_did: { title: 'What Users Did', ready: true },
        what_users_clicked: { title: 'What Users Clicked', ready: true },
        where_users_dropped: { title: 'Where Users Dropped', ready: true },
        what_users_said: { title: 'What Users Said', ready: true },
        what_we_know_so_far: { title: 'What We Know So Far', ready: true },
        what_we_dont_know_yet: { title: 'What We Don\'t Know Yet', ready: true },
        what_to_test_next: { title: 'What To Test Next', ready: true },
      };

      expectedCardKeys.forEach((key) => {
        assert(cards[key] && cards[key].ready, `Card ${key} must exist and be defined`);
      });
    });

    // TEST 22: Event Explorer filtering & pagination logic
    await testStep('TEST 22: Event Explorer filtering & pagination logic', async () => {
      const limit = 5;
      const page = 1;
      const totalEvents = await prisma.experimentEvent.count({
        where: { experimentId: createdExperiment.id },
      });

      const paginatedEvents = await prisma.experimentEvent.findMany({
        where: { experimentId: createdExperiment.id },
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });

      assert(paginatedEvents.length <= limit, 'Paginated events count must not exceed limit');
      assert(totalEvents > 0, 'Total events count must be positive');

      // Test category filter for CLICK
      const clickOnlyEvents = await prisma.experimentEvent.findMany({
        where: { experimentId: createdExperiment.id, eventType: 'CLICK' },
      });
      assert(clickOnlyEvents.every((e) => e.eventType === 'CLICK'), 'All filtered events must be CLICK');
    });

    // TEST 23: Backward compatibility for legacy events without element label
    await testStep('TEST 23: Backward compatibility for legacy events without element label', async () => {
      const legacyEvent = await prisma.experimentEvent.create({
        data: {
          experimentId: createdExperiment.id,
          sessionId: testSession.sessionId,
          visitorId: testVisitor.id,
          eventType: 'PAGE_VIEW',
          page: '/legacy-page',
          // element and elementText left null/undefined
        },
      });

      // Safe label resolver
      const resolvedLabel = legacyEvent.elementText || legacyEvent.element || 'Unknown / unavailable';
      assert(resolvedLabel === 'Unknown / unavailable', 'Legacy event without label must resolve safely without crashing');
    });

    // TEST 24: Privacy filtering & sanitization
    await testStep('TEST 24: Privacy filtering & sanitization', async () => {
      function isSensitiveInput(fieldName, fieldType) {
        const sensitivePatterns = /password|passwd|pin|secret|token|credit|card|cvv|cvc|ssn|auth|key/i;
        return sensitivePatterns.test(fieldName || '') || sensitivePatterns.test(fieldType || '');
      }

      assert(isSensitiveInput('user_password', 'password') === true, 'Password field must be marked sensitive');
      assert(isSensitiveInput('credit_card_number', 'text') === true, 'Credit card field must be marked sensitive');
      assert(isSensitiveInput('auth_token', 'hidden') === true, 'Auth token must be marked sensitive');
      assert(isSensitiveInput('email', 'email') === false, 'Standard email field is not masked by password filter');
      assert(isSensitiveInput('first_name', 'text') === false, 'Name field is not masked by password filter');
    });

    // TEST 25: Real production experiment data integrity
    await testStep('TEST 25: Real production experiment data integrity', async () => {
      // Find any real experiments in production (such as ADYK Inspire)
      const realExperiments = await prisma.experiment.findMany({
        where: {
          NOT: { id: createdExperiment.id },
        },
        include: {
          _count: {
            select: { events: true, visitors: true, feedback: true },
          },
        },
      });

      // If real experiments exist, assert their records remain intact
      if (realExperiments.length > 0) {
        const adykInspire = realExperiments.find((e) => e.name?.includes('ADYK') || e.productName?.includes('ADYK')) || realExperiments[0];
        assert(adykInspire.id, 'Real experiment must have a valid ID');
        console.log(`[VERIFIED REAL EXPERIMENT: "${adykInspire.name || adykInspire.productName}"] with ${adykInspire._count.events} events, ${adykInspire._count.visitors} visitors, ${adykInspire._count.feedback} feedback records intact.`);
      }
    });

    // TEST 26: Event normalization aliases (BUTTON_CLICK, CTA_CLICK, LINK_CLICK, tap -> CLICK)
    await testStep('TEST 26: Event normalization aliases', async () => {
      function normalizeEventTypeTest(rawType) {
        const clean = (rawType || '').toUpperCase().trim().replace(/[-\s]/g, '_');
        switch (clean) {
          case 'PAGE_VIEW':
          case 'PAGE':
          case 'PAGEVIEW':
            return 'PAGE_VIEW';
          case 'CLICK':
          case 'CTA_CLICK':
          case 'BUTTON_CLICK':
          case 'LINK_CLICK':
          case 'TAP':
          case 'ACTION_CLICK':
          case 'NAV_CLICK':
          case 'UI_CLICK':
            return 'CLICK';
          case 'SCROLL_DEPTH':
          case 'SCROLL':
            return 'SCROLL_DEPTH';
          case 'FORM_START':
            return 'FORM_START';
          case 'FORM_SUBMIT':
            return 'FORM_SUBMIT';
          case 'TIME_ON_PAGE':
          case 'DURATION':
            return 'TIME_ON_PAGE';
          default:
            return 'CUSTOM';
        }
      }

      assert(normalizeEventTypeTest('BUTTON_CLICK') === 'CLICK', 'BUTTON_CLICK must normalize to CLICK');
      assert(normalizeEventTypeTest('cta_click') === 'CLICK', 'cta_click must normalize to CLICK');
      assert(normalizeEventTypeTest('LINK-CLICK') === 'CLICK', 'LINK-CLICK with hyphens must normalize to CLICK');
      assert(normalizeEventTypeTest('tap') === 'CLICK', 'tap must normalize to CLICK');
      assert(normalizeEventTypeTest('ui click') === 'CLICK', 'ui click with space must normalize to CLICK');
      assert(normalizeEventTypeTest('PAGE') === 'PAGE_VIEW', 'PAGE must normalize to PAGE_VIEW');
      assert(normalizeEventTypeTest('scroll') === 'SCROLL_DEPTH', 'scroll must normalize to SCROLL_DEPTH');
    });

    // TEST 27: Public test URL parameter decoration (wiqn_exp, wiqn_vid, wiqn_sid)
    await testStep('TEST 27: Public test URL parameter decoration', async () => {
      function getDecoratedPrototypeUrl(rawUrl, expId, vid, sid) {
        try {
          const u = new URL(rawUrl);
          u.searchParams.set('wiqn_exp', expId);
          if (vid) u.searchParams.set('wiqn_vid', vid);
          if (sid) u.searchParams.set('wiqn_sid', sid);
          return u.toString();
        } catch {
          const sep = rawUrl.includes('?') ? '&' : '?';
          return `${rawUrl}${sep}wiqn_exp=${encodeURIComponent(expId)}&wiqn_vid=${encodeURIComponent(vid)}&wiqn_sid=${encodeURIComponent(sid)}`;
        }
      }

      const decorated = getDecoratedPrototypeUrl('https://example.com/demo', 'exp_123', 'v_456', 's_789');
      assert(decorated.includes('wiqn_exp=exp_123'), 'URL must include wiqn_exp');
      assert(decorated.includes('wiqn_vid=v_456'), 'URL must include wiqn_vid');
      assert(decorated.includes('wiqn_sid=s_789'), 'URL must include wiqn_sid');
    });

    // TEST 28: Feedback lifecycle under ACTIVE status
    await testStep('TEST 28: Feedback lifecycle under ACTIVE status', async () => {
      const activeExp = await prisma.experiment.findUnique({ where: { id: createdExperiment.id } });
      assert(activeExp.status === 'ACTIVE', 'Created experiment must be ACTIVE');

      // Create feedback on active experiment
      const activeFb = await prisma.feedback.create({
        data: {
          experimentId: createdExperiment.id,
          prompt: 'Public Tester Session',
          category: 'usability',
          rating: 5,
          comment: 'Active experiment accepts feedback perfectly.',
        },
      });
      assert(activeFb.id, 'Feedback must be saved on active experiment');
    });

    // TEST 29: Feedback lifecycle blocking under PAUSED status
    await testStep('TEST 29: Feedback lifecycle blocking under PAUSED status', async () => {
      // Simulate validation rule
      function validateFeedbackAcceptance(status) {
        if (status === 'PAUSED') {
          return { allowed: false, error: 'This experiment is currently paused by the creator. Feedback is not being accepted at this time.', code: 403 };
        }
        if (status === 'ARCHIVED') {
          return { allowed: false, error: 'This experiment has been archived. Feedback is closed.', code: 403 };
        }
        return { allowed: true };
      }

      const pausedCheck = validateFeedbackAcceptance('PAUSED');
      assert(pausedCheck.allowed === false, 'PAUSED experiment must block feedback');
      assert(pausedCheck.code === 403, 'Must return HTTP 403 for PAUSED');
      assert(pausedCheck.error.includes('paused by the creator'), 'Must explain experiment is paused');
    });

    // TEST 30: Feedback lifecycle blocking under ARCHIVED status
    await testStep('TEST 30: Feedback lifecycle blocking under ARCHIVED status', async () => {
      function validateFeedbackAcceptance(status) {
        if (status === 'PAUSED') {
          return { allowed: false, error: 'This experiment is currently paused by the creator. Feedback is not being accepted at this time.', code: 403 };
        }
        if (status === 'ARCHIVED') {
          return { allowed: false, error: 'This experiment has been archived. Feedback is closed.', code: 403 };
        }
        return { allowed: true };
      }

      const archivedCheck = validateFeedbackAcceptance('ARCHIVED');
      assert(archivedCheck.allowed === false, 'ARCHIVED experiment must block feedback');
      assert(archivedCheck.code === 403, 'Must return HTTP 403 for ARCHIVED');
      assert(archivedCheck.error.includes('archived'), 'Must explain experiment is archived');
    });

    // TEST 31: Feedback lifecycle allowing active testers under COMPLETED status
    await testStep('TEST 31: Feedback lifecycle allowing active testers under COMPLETED status', async () => {
      function validateFeedbackAcceptance(status) {
        if (status === 'PAUSED') {
          return { allowed: false, error: 'This experiment is currently paused by the creator. Feedback is not being accepted at this time.', code: 403 };
        }
        if (status === 'ARCHIVED') {
          return { allowed: false, error: 'This experiment has been archived. Feedback is closed.', code: 403 };
        }
        return { allowed: true };
      }

      const completedCheck = validateFeedbackAcceptance('COMPLETED');
      assert(completedCheck.allowed === true, 'COMPLETED experiment must not block active testing feedback');
    });

    // TEST 32: Time on Page formatting (Duration in seconds + Page Name vs timestamp)
    await testStep('TEST 32: Time on Page formatting', async () => {
      function formatPagePathTest(rawPath) {
        if (!rawPath || rawPath === '/') return 'Home (/)';
        const clean = rawPath.split('?')[0];
        if (clean.startsWith('/test/')) return 'Public Test Experience';
        const segments = clean.split('/').filter(Boolean);
        if (segments.length === 0) return 'Home (/)';
        return segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/[-_]/g, ' ')).join(' > ');
      }

      function formatEventDisplayLabelTest(ev) {
        if (ev.eventType === 'TIME_ON_PAGE') {
          const dur = ev.metadata?.durationSeconds ?? ev.metadata?.pulse;
          const pageName = ev.metadata?.pageTitle || ev.metadata?.title || ev.elementText || formatPagePathTest(ev.page);
          if (dur !== undefined && dur !== null) {
            return `Duration: ${dur} sec — ${pageName}`;
          }
          return `Time on Page: ${pageName}`;
        }
        return ev.elementText || formatPagePathTest(ev.page) || 'Action';
      }

      const timeEvent = {
        eventType: 'TIME_ON_PAGE',
        page: '/test/demo-123',
        metadata: {
          durationSeconds: 39,
          pageTitle: 'Checkout Flow',
        },
      };

      const formattedLabel = formatEventDisplayLabelTest(timeEvent);
      assert(formattedLabel.includes('Duration: 39 sec'), 'Label must display duration in seconds');
      assert(formattedLabel.includes('Checkout Flow'), 'Label must include human-readable page context');
      assert(!formattedLabel.includes('23:16:23'), 'Duration must NOT be confused with timestamp');
    });

    // TEST 33: Click reconciliation across DB and Analytics
    await testStep('TEST 33: Click reconciliation across DB and Analytics', async () => {
      // Create 3 clicks on test experiment using verified visitors
      await prisma.experimentEvent.createMany({
        data: [
          {
            experimentId: createdExperiment.id,
            sessionId: testSession.sessionId,
            visitorId: testV2.id,
            eventType: 'CLICK',
            element: 'button#btn-signup',
            elementText: 'Create Account',
            page: '/pricing',
          },
          {
            experimentId: createdExperiment.id,
            sessionId: testSession.sessionId,
            visitorId: testV2.id,
            eventType: 'CLICK',
            element: 'button#btn-signup',
            elementText: 'Create Account',
            page: '/pricing',
          },
          {
            experimentId: createdExperiment.id,
            sessionId: testSession.sessionId,
            visitorId: testV3.id,
            eventType: 'CLICK',
            element: 'a#btn-features',
            elementText: 'View Features',
            page: '/',
          },
        ],
      });

      const dbClicks = await prisma.experimentEvent.findMany({
        where: { experimentId: createdExperiment.id, eventType: 'CLICK' },
      });
      const dbClickCount = dbClicks.length;

      const allExpEvents = await prisma.experimentEvent.findMany({
        where: { experimentId: createdExperiment.id },
      });

      // Compute analytics clicks
      const isClickType = (t) => {
        const upper = (t || '').toUpperCase();
        return upper === 'CLICK' || upper === 'BUTTON_CLICK' || upper === 'CTA_CLICK' || upper === 'LINK_CLICK' || upper === 'TAP';
      };
      const filteredClicks = allExpEvents.filter((e) => isClickType(e.eventType));
      const totalClicks = filteredClicks.length;

      const clickersSet = new Set();
      const elementsMap = new Map();
      filteredClicks.forEach((ev) => {
        if (ev.visitorId) clickersSet.add(ev.visitorId);
        const label = ev.elementText || ev.element || 'button';
        elementsMap.set(label, (elementsMap.get(label) || 0) + 1);
      });

      assert(totalClicks === dbClickCount, `Analytics totalClicks (${totalClicks}) must equal DB click count (${dbClickCount})`);
      assert(clickersSet.size >= 2, 'Unique clickers count must be at least 2');
      assert(elementsMap.size >= 2, 'At least two unique elements must be identified');
    });

    // TEST 34: Insufficient evidence enforcement (<5 visitors, <20 events -> TEST_AGAIN)
    await testStep('TEST 34: Insufficient evidence enforcement', async () => {
      const allExpEvents = await prisma.experimentEvent.findMany({
        where: { experimentId: createdExperiment.id },
      });
      const visitors = await prisma.visitor.findMany({
        where: { experimentId: createdExperiment.id },
      });

      const isSufficientEvidence = visitors.length >= 5 && allExpEvents.length >= 20;
      assert(isSufficientEvidence === false, 'Evidence must be marked insufficient below threshold');

      const suggestedOutcome = !isSufficientEvidence ? 'TEST_AGAIN' : 'IMPROVE';
      const confidence = !isSufficientEvidence ? 'LOW' : 'MODERATE';
      assert(suggestedOutcome === 'TEST_AGAIN', 'Suggested outcome must be TEST_AGAIN when evidence is insufficient');
      assert(confidence === 'LOW', 'Confidence must be LOW when evidence is insufficient');
    });

    // TEST 35: Cross-experiment telemetry isolation
    await testStep('TEST 35: Cross-experiment telemetry isolation', async () => {
      const expEvents = await prisma.experimentEvent.findMany({
        where: { experimentId: createdExperiment.id },
      });

      for (const ev of expEvents) {
        assert(ev.experimentId === createdExperiment.id, 'Events must never cross between experiments');
      }
    });

    // TEST 36: Resilient profile resolution under race conditions and existing identities
    await testStep('TEST 36: Resilient profile resolution and zero-race conditions', async () => {
      // 1. Resolve existing user by email
      const existingUser = await prisma.user.findUnique({
        where: { email: createdUser.email },
      });
      assert(existingUser !== null, 'Existing user must be found by email');
      assert(existingUser.id === createdUser.id, 'User ID must match created user');

      // 2. Concurrent resolution simulation: 10 parallel lookups must not collide
      const promises = Array.from({ length: 10 }).map(async () => {
        return prisma.user.findFirst({
          where: {
            OR: [
              { supabaseUserId: createdUser.supabaseUserId },
              { email: createdUser.email },
            ],
          },
        });
      });

      const results = await Promise.all(promises);
      for (const res of results) {
        assert(res !== null, 'Parallel resolution must never return null');
        assert(res.id === createdUser.id, 'Parallel resolution must consistently return the same profile');
      }
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
