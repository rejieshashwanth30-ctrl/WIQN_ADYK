import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const experiment = await withDbRetry(() =>
      prisma.experiment.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          productName: true,
          problem: true,
          learningGoal: true,
          prototypeUrl: true,
          status: true,
          testingMode: true,
        },
      })
    );

    if (!experiment) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
    }

    if (experiment.status === 'PAUSED') {
      return NextResponse.json(
        {
          error: 'This experiment is currently paused by the creator.',
          status: 'PAUSED',
          name: experiment.name,
          productName: experiment.productName,
        },
        { status: 403 }
      );
    }

    if (experiment.status === 'ARCHIVED') {
      return NextResponse.json(
        {
          error: 'This experiment has been archived by the creator.',
          status: 'ARCHIVED',
          name: experiment.name,
          productName: experiment.productName,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: experiment,
    });
  } catch (error) {
    console.error('Error fetching public test experiment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
