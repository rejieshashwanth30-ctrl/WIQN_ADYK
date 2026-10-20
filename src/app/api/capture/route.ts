import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/db';
import { EventType } from '@prisma/client';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Wiqn-Key',
    },
  });
}

// Map client event strings to valid Prisma EventType enum values
function normalizeEventType(rawType: string): EventType {
  const upper = (rawType || '').toUpperCase();
  switch (upper) {
    case 'PAGE_VIEW':
      return EventType.PAGE_VIEW;
    case 'CLICK':
      return EventType.CLICK;
    case 'SCROLL_DEPTH':
      return EventType.SCROLL_DEPTH;
    case 'FORM_START':
      return EventType.FORM_START;
    case 'FORM_SUBMIT':
      return EventType.FORM_SUBMIT;
    case 'TIME_ON_PAGE':
      return EventType.TIME_ON_PAGE;
    case 'ENGAGEMENT_MILESTONE':
      return EventType.ENGAGEMENT_MILESTONE;
    case 'EXIT':
      return EventType.EXIT;
    default:
      return EventType.CUSTOM;
  }
}

export async function POST(req: NextRequest) {
  try {
    let payload;
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else {
      const text = await req.text();
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { raw: text };
      }
    }

    const {
      experimentId,
      prototypeId,
      visitorId,
      sessionId,
      eventType,
      page,
      timestamp,
      element,
      elementText,
      referrer,
      device,
    } = payload;

    if (!experimentId || !visitorId || !sessionId) {
      return NextResponse.json(
        { error: 'Missing mandatory tracking parameters (experimentId, visitorId, sessionId)' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // 1. Validate that the experiment exists in Neon and is active
    const experiment = await withDbRetry(() =>
      prisma.experiment.findUnique({
        where: { id: experimentId },
      })
    );

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment does not exist in registry' },
        { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (experiment.status === 'ARCHIVED' || experiment.status === 'PAUSED') {
      return NextResponse.json(
        { error: 'Experiment is paused or archived. Telemetry capture suspended.' },
        { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // 2. Ensure anonymous visitor record exists in Neon
    const visitor = await withDbRetry(() =>
      prisma.visitor.upsert({
        where: {
          experimentId_visitorId: {
            experimentId: experiment.id,
            visitorId: visitorId,
          },
        },
        update: {
          lastSeenAt: new Date(),
          browser: device?.userAgent?.substring(0, 100),
        },
        create: {
          experimentId: experiment.id,
          visitorId: visitorId,
          deviceType: device?.width && device.width < 768 ? 'mobile' : 'desktop',
          browser: device?.userAgent?.substring(0, 100),
        },
      })
    );

    // Extract duration if present in payload or metadata
    const durationSeconds = typeof payload.durationSeconds === 'number'
      ? payload.durationSeconds
      : (payload.metadata && typeof payload.metadata.durationSeconds === 'number' ? payload.metadata.durationSeconds : undefined);

    // 3. Ensure session record exists in Neon and update duration
    const existingSession = await prisma.session.findUnique({
      where: { sessionId: sessionId },
    });

    let currentSessionSec = durationSeconds;
    if (!currentSessionSec && existingSession) {
      currentSessionSec = Math.max(0, Math.round((Date.now() - existingSession.startedAt.getTime()) / 1000));
    }

    await withDbRetry(() =>
      prisma.session.upsert({
        where: { sessionId: sessionId },
        update: {
          endedAt: new Date(),
          durationSec: currentSessionSec ? Math.max(existingSession?.durationSec || 0, currentSessionSec) : undefined,
        },
        create: {
          sessionId: sessionId,
          experimentId: experiment.id,
          visitorId: visitor.id,
          startedAt: new Date(),
          endedAt: new Date(),
          durationSec: currentSessionSec || 0,
          referrer: referrer || null,
        },
      })
    );

    // 4. Ingest telemetry event with metadata preserved
    const normalizedType = normalizeEventType(eventType);
    const mergedMetadata = {
      ...(payload.metadata || {}),
      ...(device ? { device } : {}),
      ...(durationSeconds ? { durationSeconds } : {}),
    };

    const recordedEvent = await withDbRetry(() =>
      prisma.experimentEvent.create({
        data: {
          experimentId: experiment.id,
          sessionId: sessionId,
          visitorId: visitor.id,
          eventType: normalizedType,
          element: element || null,
          elementText: elementText || null,
          page: page || '/',
          referrer: referrer || null,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
          metadata: Object.keys(mergedMetadata).length > 0 ? mergedMetadata : undefined,
        },
      })
    );

    return NextResponse.json(
      {
        success: true,
        received: true,
        eventId: recordedEvent.id,
        experimentId: experiment.id,
        eventType: normalizedType,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error ingesting telemetry beacon into Neon:', error);
    return NextResponse.json(
      { error: 'Internal ingest error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
