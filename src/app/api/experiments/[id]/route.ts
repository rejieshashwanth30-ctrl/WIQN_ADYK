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

    // Fetch recent events and compute empirical telemetry statistics
    const recentEvents = await prisma.experimentEvent.findMany({
      where: { experimentId: experiment.id },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    const eventBreakdown: Record<string, number> = {};
    const clickedElements: Record<string, number> = {};
    let totalDurationSeconds = 0;
    let durationCount = 0;

    recentEvents.forEach((ev) => {
      eventBreakdown[ev.eventType] = (eventBreakdown[ev.eventType] || 0) + 1;
      if (ev.element) {
        const key = ev.elementText ? `${ev.element} ("${ev.elementText}")` : ev.element;
        clickedElements[key] = (clickedElements[key] || 0) + 1;
      }
      if (ev.eventType === 'TIME_ON_PAGE' && ev.metadata && typeof (ev.metadata as any).durationSeconds === 'number') {
        totalDurationSeconds += (ev.metadata as any).durationSeconds;
        durationCount++;
      }
    });

    const topInteractions = Object.entries(clickedElements)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([element, count]) => ({
        element,
        count,
        percentage: experiment._count.events > 0 ? Math.round((count / experiment._count.events) * 1000) / 10 : 0,
      }));

    const totalVisitors = experiment._count.visitors;
    const totalEvents = experiment._count.events;
    const avgDuration = durationCount > 0 ? Math.round(totalDurationSeconds / durationCount) : 0;
    const isSufficientEvidence = totalVisitors >= 5 && totalEvents >= 20;

    // Build empirical facts directly from measured records (No fabricated AI claims)
    const empiricalFacts: Array<{
      id: string;
      title: string;
      statement: string;
      evidence: string;
      confidence: 'LOW' | 'MODERATE' | 'HIGH';
      limitations: string;
    }> = [];

    if (totalEvents > 0) {
      empiricalFacts.push({
        id: 'fact_volume',
        title: 'Telemetry Event Volume',
        statement: `Captured ${totalEvents} interaction event(s) across ${totalVisitors} unique visitor(s) and ${experiment._count.sessions} session(s).`,
        evidence: `Directly measured via Wiqn Autocapture. Event distribution: ${Object.entries(eventBreakdown)
          .map(([t, c]) => `${t}: ${c}`)
          .join(', ')}.`,
        confidence: totalVisitors >= 10 ? 'HIGH' : 'LOW',
        limitations: totalVisitors < 10 ? `Preliminary sample (${totalVisitors} visitor(s)). High variance expected until sample size reaches at least 50 visitors.` : 'Sample reflects recruited alpha cohort.',
      });

      if (topInteractions.length > 0) {
        const top = topInteractions[0];
        empiricalFacts.push({
          id: 'fact_top_element',
          title: 'Primary Interaction Focal Point',
          statement: `The most triggered element is ${top.element}, accounting for ${top.count} event(s) (${top.percentage}% of all captured interactions).`,
          evidence: `Telemetry event stream recorded ${top.count} discrete click triggers on this selector.`,
          confidence: totalEvents >= 20 ? 'HIGH' : 'MODERATE',
          limitations: 'Element position on mobile viewports has not been isolated from desktop.',
        });
      }
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
          sessionsCount: experiment._count.sessions,
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
          totalSessions: experiment._count.sessions,
          eventBreakdown,
          topInteractions,
          avgDuration,
          firstEventAt: recentEvents[recentEvents.length - 1]?.timestamp.toISOString() || null,
          lastEventAt: recentEvents[0]?.timestamp.toISOString() || null,
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
          recentEvents: recentEvents.slice(0, 15).map((e) => ({
            id: e.id,
            eventType: e.eventType,
            element: e.element,
            elementText: e.elementText,
            page: e.page,
            timestamp: e.timestamp.toISOString(),
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching experiment detail:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
