import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const auth = await getCurrentUser();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    // Only fetch experiments owned by the authenticated application user
    const experiments = await prisma.experiment.findMany({
      where: {
        userId: auth.applicationUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        prototypes: true,
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

    const mapped = experiments.map((exp) => ({
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
        avgTimeOnPrototype: 0,
      },
    }));

    return NextResponse.json({
      status: 'success',
      data: mapped,
    });
  } catch (error) {
    console.error('Error fetching user experiments from Neon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
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

    // Securely associate with the authenticated application user ID (never trusted from body)
    const newExperiment = await prisma.experiment.create({
      data: {
        userId: auth.applicationUser.id,
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

    return NextResponse.json(
      {
        status: 'created',
        data: {
          id: newExperiment.id,
          name: newExperiment.name,
          productName: newExperiment.productName,
          keyHypothesis: newExperiment.keyHypothesis,
          status: newExperiment.status,
          createdAt: newExperiment.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to persist experiment to Neon:', error);
    return NextResponse.json({ error: 'Failed to create experiment' }, { status: 500 });
  }
}
