import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserContext, verifyExperimentOwnership } from '@/lib/auth';
import { prisma, withDbRetry } from '@/lib/db';
import { ExperimentStatus, TestingMode } from '@prisma/client';
import {
  computeBehavioralAnalytics,
  formatElementLabel,
  formatVisitorLabel,
  formatSessionLabel,
  formatEventType,
} from '@/lib/behavioralAnalytics';

interface RouteContext {
  params: Promise<{ id: string }>;
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

    // 1. Fetch real events, sessions, and visitors from Neon PostgreSQL
    const [allEvents, sessions, visitors] = await withDbRetry(() =>
      Promise.all([
        prisma.experimentEvent.findMany({
          where: { experimentId: experiment.id },
          orderBy: { timestamp: 'desc' },
          take: 1000,
        }),
        prisma.session.findMany({
          where: { experimentId: experiment.id },
          select: { sessionId: true, visitorId: true, durationSec: true, startedAt: true, endedAt: true },
        }),
        prisma.visitor.findMany({
          where: { experimentId: experiment.id },
        }),
      ])
    );

    // 2. Compute comprehensive behavioral analytics
    const behavioral = computeBehavioralAnalytics({
      events: allEvents,
      sessions,
      visitors,
      feedback: experiment.feedback || [],
      experiment: {
        name: experiment.name,
        productName: experiment.productName,
        keyHypothesis: experiment.keyHypothesis,
        learningGoal: experiment.learningGoal,
      },
    });

    const totalVisitors = behavioral.metrics.totalVisitors;
    const totalEvents = behavioral.metrics.totalEvents;
    const isSufficientEvidence = behavioral.metrics.isSufficientEvidence;
    const avgDuration = behavioral.metrics.avgDurationSec;

    // 3. Build empirical facts (Preserved for backwards compatibility with existing UI)
    const empiricalFacts: Array<{
      id: string;
      title: string;
      statement: string;
      evidence: string;
      confidence: 'LOW' | 'MODERATE' | 'HIGH';
      limitations: string;
    }> = [];

    if (totalVisitors === 0) {
      empiricalFacts.push({
        id: 'fact_volume',
        title: 'Visitor Activity So Far',
        statement: 'No one has visited your prototype yet.',
        evidence: '0 prototype visits recorded.',
        confidence: 'HIGH',
        limitations: 'Share your prototype link with testers or verify that the tracking code is added.',
      });
    } else {
      const visitorWord = totalVisitors === 1 ? '1 person' : `${totalVisitors} people`;
      const actionWord = totalEvents === 1 ? '1 action' : `${totalEvents} actions`;
      empiricalFacts.push({
        id: 'fact_volume',
        title: 'Visitor Activity So Far',
        statement: `${visitorWord} visited your prototype and took ${actionWord}.`,
        evidence: `Automatically tracked from real prototype visits (${Object.entries(behavioral.eventBreakdown)
          .map(([t, c]) => `${c} ${t.toLowerCase().replace('_', ' ')}`)
          .join(', ')}).`,
        confidence: totalVisitors >= 10 ? 'HIGH' : 'LOW',
        limitations: totalVisitors < 5 ? `Early testing: Only ${totalVisitors} visitor(s) recorded so far. Share with more people to see clearer patterns.` : 'Initial testing cohort.',
      });
    }

    if (behavioral.clickDistribution.elements.length > 0) {
      const top = behavioral.clickDistribution.elements[0];
      empiricalFacts.push({
        id: 'fact_top_element',
        title: 'Most-Clicked Element',
        statement: `Visitors clicked on "${top.label}" ${top.totalClicks} time(s) (${top.percentage}% of all clicks) across ${top.uniqueVisitors} visitor(s).`,
        evidence: `Real click events recorded on this button or link.`,
        confidence: totalEvents >= 20 ? 'HIGH' : 'MODERATE',
        limitations: 'A click shows curiosity or engagement, but does not guarantee satisfaction or purchase intent.',
      });
    }

    if (experiment._count.feedback === 0) {
      empiricalFacts.push({
        id: 'fact_feedback',
        title: 'Tester Feedback So Far',
        statement: 'No one has submitted feedback yet.',
        evidence: '0 feedback submissions recorded.',
        confidence: 'HIGH',
        limitations: 'You can add your own testing observations or ask testers for their thoughts.',
      });
    } else {
      empiricalFacts.push({
        id: 'fact_feedback',
        title: 'Tester Feedback So Far',
        statement: `${experiment._count.feedback} feedback note(s) have been recorded.`,
        evidence: `Saved in your tester feedback log.`,
        confidence: 'HIGH',
        limitations: 'Individual feedback notes highlight specific viewpoints and should be weighed alongside general activity.',
      });
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
          visitorsCount: totalVisitors,
          sessionsCount: behavioral.metrics.totalSessions,
          interactionsCount: totalEvents,
          feedbackCount: experiment._count.feedback,
          avgTimeOnPrototype: avgDuration,
        },
        prototypes: experiment.prototypes,
        insights: experiment.insights,
        decisions: experiment.decisions,
        feedback: experiment.feedback,
        telemetrySummary: {
          totalEvents,
          totalVisitors,
          totalSessions: behavioral.metrics.totalSessions,
          totalClicks: behavioral.metrics.totalClicks,
          eventBreakdown: behavioral.eventBreakdown,
          topInteractions: behavioral.clickDistribution.elements.map((item) => ({
            element: item.element,
            label: item.label,
            count: item.totalClicks,
            uniqueVisitors: item.uniqueVisitors,
            sessionsCount: item.sessionsCount,
            avgClicksPerVisitor: item.avgClicksPerVisitor,
            percentage: item.percentage,
          })),
          avgDuration,
          medianDuration: behavioral.metrics.medianDurationSec,
          firstEventAt: allEvents[allEvents.length - 1]?.timestamp.toISOString() || null,
          lastEventAt: allEvents[0]?.timestamp.toISOString() || null,
          isSufficientEvidence,
          evidenceRequirements: {
            minVisitors: 5,
            minEvents: 20,
            currentVisitors: totalVisitors,
            currentEvents: totalEvents,
            visitorProgressPercent: Math.min(100, Math.round((totalVisitors / 5) * 100)),
            eventProgressPercent: Math.min(100, Math.round((totalEvents / 20) * 100)),
          },
          empiricalFacts,
          behavioral, // Complete structured behavioral analytics
          recentEvents: allEvents.slice(0, 50).map((e) => ({
            id: e.id,
            eventType: e.eventType,
            displayType: formatEventType(e.eventType),
            element: e.element,
            elementText: e.elementText,
            label: e.eventType === 'CLICK' ? formatElementLabel(e.element, e.elementText) : (e.elementText || e.page),
            page: e.page,
            referrer: e.referrer || null,
            timestamp: e.timestamp.toISOString(),
            visitorId: e.visitorId,
            visitorLabel: formatVisitorLabel(e.visitorId),
            sessionId: e.sessionId,
            sessionLabel: formatSessionLabel(e.sessionId),
            metadata: e.metadata || null,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching experiment detail:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const authResult = await getAuthenticatedUserContext(req);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = await params;
    const { status: authStatus, error, experiment } = await verifyExperimentOwnership(id, authResult.applicationUser.id);

    if (error || !experiment) {
      return NextResponse.json({ error }, { status: authStatus });
    }

    const body = await req.json().catch(() => ({}));
    const updateData: Record<string, any> = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.productName !== undefined) updateData.productName = body.productName.trim();
    if (body.problem !== undefined) updateData.problem = body.problem.trim();
    if (body.targetAudience !== undefined) updateData.targetAudience = body.targetAudience.trim();
    if (body.productIdea !== undefined) updateData.productIdea = body.productIdea.trim();
    if (body.keyHypothesis !== undefined) updateData.keyHypothesis = body.keyHypothesis.trim();
    if (body.learningGoal !== undefined) updateData.learningGoal = body.learningGoal.trim();

    if (body.prototypeUrl !== undefined) {
      const url = body.prototypeUrl.trim();
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return NextResponse.json({ error: 'Prototype URL must use HTTP or HTTPS' }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: 'Invalid prototype URL format' }, { status: 400 });
      }
      updateData.prototypeUrl = url;
    }

    if (body.testingMode !== undefined) {
      const validModes: TestingMode[] = ['PRIVATE', 'CARDEX_ALPHA'];
      if (!validModes.includes(body.testingMode)) {
        return NextResponse.json({ error: `Invalid testingMode: ${body.testingMode}` }, { status: 400 });
      }
      updateData.testingMode = body.testingMode;
    }

    if (body.status !== undefined) {
      const validStatuses: ExperimentStatus[] = ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: `Invalid experiment status: ${body.status}` }, { status: 400 });
      }
      updateData.status = body.status;
    }

    const updated = await withDbRetry(() =>
      prisma.experiment.update({
        where: { id: experiment.id },
        data: updateData,
      })
    );

    return NextResponse.json({
      status: 'success',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating experiment in Neon:', error);
    return NextResponse.json({ error: 'Failed to update experiment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const authResult = await getAuthenticatedUserContext(req);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = await params;
    const { status: authStatus, error, experiment } = await verifyExperimentOwnership(id, authResult.applicationUser.id);

    if (error || !experiment) {
      return NextResponse.json({ error }, { status: authStatus });
    }

    await withDbRetry(() =>
      prisma.experiment.delete({
        where: { id: experiment.id },
      })
    );

    return NextResponse.json({
      status: 'success',
      message: 'Experiment deleted successfully',
      deletedId: experiment.id,
    });
  } catch (error) {
    console.error('Error deleting experiment from Neon:', error);
    return NextResponse.json({ error: 'Failed to delete experiment' }, { status: 500 });
  }
}

