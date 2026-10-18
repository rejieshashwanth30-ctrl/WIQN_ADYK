import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, verifyExperimentOwnership } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const auth = await getCurrentUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const { id } = await params;
    const { status, error, experiment } = await verifyExperimentOwnership(id, auth.applicationUser.id);

    if (error || !experiment) {
      return NextResponse.json({ error }, { status });
    }

    const body = await req.json();
    const { prompt, comment, rating, category, visitorId } = body;

    if (!prompt || !comment) {
      return NextResponse.json(
        { error: 'Missing mandatory feedback fields (prompt, comment)' },
        { status: 400 }
      );
    }

    // Persist real feedback into Neon
    const feedback = await prisma.feedback.create({
      data: {
        experimentId: experiment.id,
        prompt: prompt.trim(),
        comment: comment.trim(),
        rating: typeof rating === 'number' ? rating : null,
        category: category ? category.trim() : 'general',
        visitorId: visitorId || null,
      },
    });

    return NextResponse.json({
      status: 'success',
      feedback,
    });
  } catch (err) {
    console.error('Error logging feedback:', err);
    return NextResponse.json({ error: 'Internal server error saving feedback' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const auth = await getCurrentUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const { id } = await params;
    const { status, error, experiment } = await verifyExperimentOwnership(id, auth.applicationUser.id);

    if (error || !experiment) {
      return NextResponse.json({ error }, { status });
    }

    const feedback = await prisma.feedback.findMany({
      where: { experimentId: experiment.id },
      orderBy: { createdAt: 'desc' },
      include: {
        responses: true,
      },
    });

    return NextResponse.json({
      status: 'success',
      feedback,
    });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
