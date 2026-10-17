import { NextRequest, NextResponse } from 'next/server';

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
    } = payload;

    // Structured logging for telemetry observation
    if (process.env.NODE_ENV === 'development') {
      console.log(`[WIQN AUTOCAPTURE] [${eventType}] exp=${experimentId} vis=${visitorId} path=${page} el=${element || '-'}`);
    }

    // In a live environment with DATABASE_URL set, events are persisted to PostgreSQL:
    // await prisma.experimentEvent.create({ data: { ... } });

    return NextResponse.json(
      {
        received: true,
        experimentId: experimentId || 'unknown',
        eventType: eventType || 'UNKNOWN',
        timestamp: timestamp || new Date().toISOString(),
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
    console.error('Error processing autocapture beacon:', error);
    return NextResponse.json(
      { error: 'Invalid beacon payload' },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
