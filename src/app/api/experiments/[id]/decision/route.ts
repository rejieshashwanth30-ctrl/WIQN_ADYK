import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, verifyExperimentOwnership } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { DecisionOutcome, ConfidenceLevel } from '@prisma/client';

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
    const { outcome, evidenceSummary, reasoning, confidence, recommendedNextStep, limitations } = body;

    if (!outcome || !evidenceSummary || !reasoning) {
      return NextResponse.json(
        { error: 'Missing mandatory decision fields (outcome, evidenceSummary, reasoning)' },
        { status: 400 }
      );
    }

    // Validate enum outcome
    const validOutcomes: DecisionOutcome[] = ['BUILD', 'IMPROVE', 'PIVOT', 'STOP', 'TEST_AGAIN'];
    if (!validOutcomes.includes(outcome as DecisionOutcome)) {
      return NextResponse.json({ error: `Invalid decision outcome: ${outcome}` }, { status: 400 });
    }

    // Validate confidence
    const validConfidence: ConfidenceLevel[] = ['VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'];
    const resolvedConfidence = validConfidence.includes(confidence as ConfidenceLevel)
      ? (confidence as ConfidenceLevel)
      : ConfidenceLevel.MODERATE;

    // Data-integrity safeguard: Downgrade confidence if sample size is insufficient
    let finalConfidence = resolvedConfidence;
    let appendedLimitations = limitations || '';

    const eventCount = experiment._count.events;
    const visitorCount = experiment._count.visitors;

    if (visitorCount < 5 || eventCount < 20) {
      if (finalConfidence === 'HIGH' || finalConfidence === 'VERY_HIGH') {
        finalConfidence = ConfidenceLevel.LOW;
        const limitationNote = `[DATA INTEGRITY NOTICE: Sample size (${visitorCount} visitors, ${eventCount} events) is below minimum threshold (5 visitors, 20 events). Confidence downgraded to LOW.]`;
        appendedLimitations = appendedLimitations ? `${appendedLimitations} | ${limitationNote}` : limitationNote;
      }
    }

    // Persist to Neon PostgreSQL
    const decision = await prisma.decision.create({
      data: {
        experimentId: experiment.id,
        outcome: outcome as DecisionOutcome,
        evidenceSummary: evidenceSummary.trim(),
        reasoning: reasoning.trim(),
        confidence: finalConfidence,
        recommendedNextStep: (recommendedNextStep || 'Continue gathering interaction telemetry.').trim(),
        limitations: appendedLimitations ? appendedLimitations.trim() : null,
      },
    });

    return NextResponse.json({
      status: 'success',
      decision,
    });
  } catch (err: any) {
    console.error('Error recording executive decision:', err);
    return NextResponse.json({ error: 'Internal server error saving decision' }, { status: 500 });
  }
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

    const decisions = await prisma.decision.findMany({
      where: { experimentId: experiment.id },
      orderBy: { decidedAt: 'desc' },
    });

    return NextResponse.json({
      status: 'success',
      decisions,
    });
  } catch (err) {
    console.error('Error fetching decisions:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
