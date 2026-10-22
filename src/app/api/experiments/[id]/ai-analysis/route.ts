import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserContext, verifyExperimentOwnership } from '@/lib/auth';
import { prisma, withDbRetry } from '@/lib/db';
import { synthesizeExperimentEvidence } from '@/lib/evidenceEngine';
import { runServerAIAnalysis } from '@/lib/aiEngine';
import { InsightType, ConfidenceLevel } from '@prisma/client';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const authResult = await getAuthenticatedUserContext(req);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = await params;
    const { status, error, experiment } = await verifyExperimentOwnership(id, authResult.applicationUser.id);

    if (error || !experiment) {
      return NextResponse.json({ error }, { status });
    }

    // 1. Fetch real database records
    const [events, sessions, feedback] = await withDbRetry(() =>
      Promise.all([
        prisma.experimentEvent.findMany({
          where: { experimentId: experiment.id },
          orderBy: { timestamp: 'desc' },
          take: 300,
        }),
        prisma.session.findMany({
          where: { experimentId: experiment.id },
        }),
        prisma.feedback.findMany({
          where: { experimentId: experiment.id },
          orderBy: { createdAt: 'desc' },
        }),
      ])
    );

    // Compute duration
    let totalDur = 0;
    let durCount = 0;
    sessions.forEach((s) => {
      let dur = s.durationSec;
      if ((!dur || dur <= 0) && s.endedAt && s.startedAt) {
        dur = Math.round((s.endedAt.getTime() - s.startedAt.getTime()) / 1000);
      }
      if (dur && dur > 0) {
        totalDur += dur;
        durCount++;
      }
    });
    const avgDuration = durCount > 0 ? Math.round(totalDur / durCount) : 0;

    // 2. Synthesize structured evidence pack
    const evidencePack = synthesizeExperimentEvidence({
      experiment: {
        id: experiment.id,
        name: experiment.name,
        productName: experiment.productName,
        keyHypothesis: experiment.keyHypothesis,
        problem: experiment.problem,
        learningGoal: experiment.learningGoal,
      },
      metrics: {
        visitorsCount: experiment._count.visitors,
        sessionsCount: experiment._count.sessions,
        interactionsCount: experiment._count.events,
        feedbackCount: experiment._count.feedback,
        avgTimeOnPrototype: avgDuration,
      },
      events,
      sessions,
      feedback,
    });

    // 3. Run server-side AI analysis
    const analysis = await runServerAIAnalysis(evidencePack);

    // 4. Persist structured insights to Neon PostgreSQL
    // Delete previous automated insights for this experiment to keep it clean and current
    await withDbRetry(() =>
      prisma.insight.deleteMany({
        where: { experimentId: experiment.id },
      })
    );

    // Insert new insights
    const insightEntries: Array<{
      experimentId: string;
      type: InsightType;
      statement: string;
      evidence: string;
      confidence: ConfidenceLevel;
      limitations: string | null;
    }> = [];

    // Fact insights
    for (const fact of analysis.facts.slice(0, 3)) {
      insightEntries.push({
        experimentId: experiment.id,
        type: 'FACT' as InsightType,
        statement: fact.statement,
        evidence: fact.evidence,
        confidence: analysis.confidence,
        limitations: analysis.limitations[0] || null,
      });
    }

    // Recommendation insights
    for (const rec of analysis.recommendations.slice(0, 2)) {
      insightEntries.push({
        experimentId: experiment.id,
        type: 'RECOMMENDATION' as InsightType,
        statement: rec.action,
        evidence: rec.rationale,
        confidence: analysis.confidence,
        limitations: analysis.limitations[0] || null,
      });
    }

    if (insightEntries.length > 0) {
      await withDbRetry(() =>
        prisma.insight.createMany({
          data: insightEntries,
        })
      );
    }

    return NextResponse.json({
      status: 'success',
      data: analysis,
      evidencePack,
    });
  } catch (err: any) {
    console.error('Error executing AI analysis:', err);
    return NextResponse.json(
      { error: 'AI analysis service temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const authResult = await getAuthenticatedUserContext(req);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = await params;
    const { status, error, experiment } = await verifyExperimentOwnership(id, authResult.applicationUser.id);

    if (error || !experiment) {
      return NextResponse.json({ error }, { status });
    }

    const insights = await withDbRetry(() =>
      prisma.insight.findMany({
        where: { experimentId: experiment.id },
        orderBy: { createdAt: 'desc' },
      })
    );

    return NextResponse.json({
      status: 'success',
      insights,
    });
  } catch (err: any) {
    console.error('Error fetching experiment insights:', err);
    return NextResponse.json({ error: 'Internal server error fetching insights' }, { status: 500 });
  }
}
