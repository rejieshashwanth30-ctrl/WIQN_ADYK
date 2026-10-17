import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const experiment = await prisma.experiment.findUnique({
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
    });

    if (!experiment) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
    }

    if (experiment.status === 'ARCHIVED' || experiment.status === 'PAUSED') {
      return NextResponse.json(
        {
          error: 'This testing session has concluded or is paused.',
          status: experiment.status,
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
