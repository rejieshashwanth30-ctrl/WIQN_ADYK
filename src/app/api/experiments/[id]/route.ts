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

    // Build what we know so far directly from measured records (No fabricated claims)
    const empiricalFacts: Array<{
      id: string;
      title: string;
      statement: string;
      evidence: string;
      confidence: 'LOW' | 'MODERATE' | 'HIGH';
      limitations: string;
    }> = [];

    // 1. Visitor Activity Fact
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
        evidence: `Automatically tracked from real prototype visits (${Object.entries(eventBreakdown)
          .map(([t, c]) => `${c} ${t.toLowerCase().replace('_', ' ')}`)
          .join(', ')}).`,
        confidence: totalVisitors >= 10 ? 'HIGH' : 'LOW',
        limitations: totalVisitors < 5 ? `Early testing: Only ${totalVisitors} visitor(s) recorded so far. Share with more people to see clearer patterns.` : 'Initial testing cohort.',
      });
    }

    // 2. Most-Clicked Element Fact (if clicks exist)
    if (topInteractions.length > 0) {
      const top = topInteractions[0];
      empiricalFacts.push({
        id: 'fact_top_element',
        title: 'Most-Clicked Element',
        statement: `Visitors clicked on "${top.element}" ${top.count} time(s) (${top.percentage}% of all clicks).`,
        evidence: `Real click events recorded on this button or link.`,
        confidence: totalEvents >= 20 ? 'HIGH' : 'MODERATE',
        limitations: 'A click shows curiosity or engagement, but does not guarantee satisfaction or purchase intent.',
      });
    }

    // 3. Tester Feedback Fact
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
