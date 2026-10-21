import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserContext, verifyExperimentOwnership } from '@/lib/auth';
import { prisma, withDbRetry } from '@/lib/db';
import { formatElementLabel, formatVisitorLabel, formatSessionLabel, formatEventType } from '@/lib/behavioralAnalytics';
import { Prisma } from '@prisma/client';

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
    const { status: authStatus, error, experiment } = await verifyExperimentOwnership(id, authResult.applicationUser.id);

    if (error || !experiment) {
      return NextResponse.json({ error }, { status: authStatus });
    }

    const { searchParams } = req.nextUrl;
    const filter = (searchParams.get('filter') || 'all').toLowerCase();
    const visitorIdFilter = searchParams.get('visitorId')?.trim();
    const sessionIdFilter = searchParams.get('sessionId')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(5, parseInt(searchParams.get('limit') || '25', 10) || 25));
    const skip = (page - 1) * limit;

    // Build Prisma where clause
    const whereClause: Prisma.ExperimentEventWhereInput = {
      experimentId: experiment.id,
    };

    if (visitorIdFilter) {
      whereClause.visitorId = visitorIdFilter;
    }

    if (sessionIdFilter) {
      whereClause.sessionId = sessionIdFilter;
    }

    // Apply category filters
    switch (filter) {
      case 'clicks':
        whereClause.eventType = 'CLICK';
        break;
      case 'pages':
        whereClause.eventType = 'PAGE_VIEW';
        break;
      case 'forms':
        whereClause.eventType = { in: ['FORM_START', 'FORM_SUBMIT'] };
        break;
      case 'scroll':
        whereClause.eventType = 'SCROLL_DEPTH';
        break;
      case 'sessions':
        whereClause.eventType = { in: ['TIME_ON_PAGE', 'ENGAGEMENT_MILESTONE', 'EXIT'] };
        break;
      case 'all':
      default:
        // No eventType filter
        break;
    }

    // Execute paginated query and total count in parallel
    const [events, totalFilteredCount, totalAllCount, clickCount, pageViewCount, formCount, scrollCount] = await withDbRetry(() =>
      Promise.all([
        prisma.experimentEvent.findMany({
          where: whereClause,
          orderBy: { timestamp: 'desc' },
          skip,
          take: limit,
        }),
        prisma.experimentEvent.count({ where: whereClause }),
        prisma.experimentEvent.count({ where: { experimentId: experiment.id } }),
        prisma.experimentEvent.count({ where: { experimentId: experiment.id, eventType: 'CLICK' } }),
        prisma.experimentEvent.count({ where: { experimentId: experiment.id, eventType: 'PAGE_VIEW' } }),
        prisma.experimentEvent.count({ where: { experimentId: experiment.id, eventType: { in: ['FORM_START', 'FORM_SUBMIT'] } } }),
        prisma.experimentEvent.count({ where: { experimentId: experiment.id, eventType: 'SCROLL_DEPTH' } }),
      ])
    );

    const totalPages = Math.ceil(totalFilteredCount / limit) || 1;

    const formattedEvents = events.map((ev) => ({
      id: ev.id,
      eventType: ev.eventType,
      displayType: formatEventType(ev.eventType),
      element: ev.element,
      elementText: ev.elementText,
      label: ev.eventType === 'CLICK' ? formatElementLabel(ev.element, ev.elementText) : (ev.elementText || ev.page),
      page: ev.page || '/',
      referrer: ev.referrer || null,
      timestamp: ev.timestamp.toISOString(),
      visitorId: ev.visitorId,
      visitorLabel: formatVisitorLabel(ev.visitorId),
      sessionId: ev.sessionId,
      sessionLabel: formatSessionLabel(ev.sessionId),
      metadata: ev.metadata || null,
    }));

    return NextResponse.json({
      status: 'success',
      data: {
        events: formattedEvents,
        pagination: {
          page,
          limit,
          totalCount: totalFilteredCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        counts: {
          all: totalAllCount,
          clicks: clickCount,
          pages: pageViewCount,
          forms: formCount,
          scroll: scrollCount,
        },
      },
    });
  } catch (err: any) {
    console.error('[API /api/experiments/[id]/events] Error:', err);
    return NextResponse.json({ error: 'Internal server error fetching experiment events' }, { status: 500 });
  }
}
