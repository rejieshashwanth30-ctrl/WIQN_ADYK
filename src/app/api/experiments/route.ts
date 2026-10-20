import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserContext } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authResult = await getAuthenticatedUserContext(req);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Only fetch experiments owned by the authenticated application user
    const experiments = await prisma.experiment.findMany({
      where: {
        userId: authResult.applicationUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        prototypes: true,
        sessions: {
          select: {
            durationSec: true,
            startedAt: true,
            endedAt: true,
          },
        },
        _count: {
          select: {
            visitors: true,
            sessions: true,
            events: true,
            feedback: true,
          },
        },
      },
    });

    const mapped = experiments.map((exp) => {
      let totalDuration = 0;
      let durationCount = 0;
      (exp.sessions || []).forEach((s) => {
        let dur = s.durationSec;
        if ((!dur || dur <= 0) && s.endedAt && s.startedAt) {
          dur = Math.round((s.endedAt.getTime() - s.startedAt.getTime()) / 1000);
        }
        if (dur && dur > 0) {
          totalDuration += dur;
          durationCount++;
        }
      });
      const avgDuration = durationCount > 0 ? Math.round(totalDuration / durationCount) : 0;

      return {
        id: exp.id,
        name: exp.name,
        productName: exp.productName,
        problem: exp.problem,
        targetAudience: exp.targetAudience,
        productIdea: exp.productIdea,
        keyHypothesis: exp.keyHypothesis,
        learningGoal: exp.learningGoal,
        prototypeUrl: exp.prototypeUrl,
        testingMode: exp.testingMode,
        status: exp.status,
        createdAt: exp.createdAt.toISOString(),
        updatedAt: exp.updatedAt.toISOString(),
        metrics: {
          visitorsCount: exp._count.visitors,
          sessionsCount: exp._count.sessions,
          interactionsCount: exp._count.events,
          feedbackCount: exp._count.feedback,
          avgTimeOnPrototype: avgDuration,
        },
      };
    });

    return NextResponse.json({
      status: 'success',
      data: mapped,
    });
  } catch (error) {
    console.error('Error fetching user experiments from Neon:', error);
    return NextResponse.json({ error: 'Internal server error fetching experiments' }, { status: 500 });
  }
}

function isValidPrototypeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await getAuthenticatedUserContext(req);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await req.json();
    const {
      name,
      productName,
      problem,
      targetAudience,
      productIdea,
      keyHypothesis,
      learningGoal,
      prototypeUrl,
      testingMode,
      status,
    } = body;

    if (!name?.trim() || !productName?.trim() || !keyHypothesis?.trim() || !prototypeUrl?.trim()) {
      return NextResponse.json(
        { error: 'Missing mandatory experiment fields (name, productName, keyHypothesis, prototypeUrl)' },
        { status: 400 }
      );
    }

    if (!isValidPrototypeUrl(prototypeUrl)) {
      return NextResponse.json(
        { error: 'Invalid prototype URL. Must be a valid HTTP or HTTPS web address.' },
        { status: 400 }
      );
    }

    // Securely associate exclusively with authenticated application user ID (IDOR prevention)
    const targetUserId = authResult.applicationUser.id;

    const newExperiment = await prisma.experiment.create({
      data: {
        userId: targetUserId,
        name: name.trim(),
        productName: productName.trim(),
        problem: (problem || '').trim(),
        targetAudience: (targetAudience || '').trim(),
        productIdea: (productIdea || '').trim(),
        keyHypothesis: keyHypothesis.trim(),
        learningGoal: (learningGoal || '').trim(),
        prototypeUrl: prototypeUrl.trim(),
        testingMode: testingMode === 'CARDEX_ALPHA' ? 'CARDEX_ALPHA' : 'PRIVATE',
        status: status || 'ACTIVE',
        prototypes: {
          create: {
            url: prototypeUrl.trim(),
            version: '1.0.0',
          },
        },
      },
      include: {
        prototypes: true,
      },
    });

    const experimentPayload = {
      id: newExperiment.id,
      name: newExperiment.name,
      productName: newExperiment.productName,
      keyHypothesis: newExperiment.keyHypothesis,
      status: newExperiment.status,
      createdAt: newExperiment.createdAt.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        status: 'created',
        experiment: experimentPayload,
        data: experimentPayload,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to persist experiment to Neon:', error);
    return NextResponse.json({ error: 'Failed to create experiment in database' }, { status: 500 });
  }
}

