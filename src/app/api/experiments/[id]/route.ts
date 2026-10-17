import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, verifyExperimentOwnership } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const auth = await getCurrentUser();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const { id } = await params;
    const { status, error, experiment } = await verifyExperimentOwnership(id, auth.applicationUser.id);

    if (error || !experiment) {
      return NextResponse.json({ error }, { status });
    }

    return NextResponse.json({
      status: 'success',
      data: {
        id: experiment.id,
        name: experiment.name,
        productName: experiment.productName,
        problem: experiment.problem,
        targetAudience: experiment.targetAudience,
        productIdea: experiment.productIdea,
        keyHypothesis: experiment.keyHypothesis,
        learningGoal: experiment.learningGoal,
        prototypeUrl: experiment.prototypeUrl,
        testingMode: experiment.testingMode,
        status: experiment.status,
        createdAt: experiment.createdAt.toISOString(),
        updatedAt: experiment.updatedAt.toISOString(),
        metrics: {
          visitorsCount: experiment._count.visitors,
          sessionsCount: experiment._count.sessions,
          interactionsCount: experiment._count.events,
          feedbackCount: experiment._count.feedback,
          avgTimeOnPrototype: 0,
        },
        prototypes: experiment.prototypes,
        insights: experiment.insights,
        decisions: experiment.decisions,
        feedback: experiment.feedback,
      },
    });
  } catch (error) {
    console.error('Error fetching experiment detail:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
