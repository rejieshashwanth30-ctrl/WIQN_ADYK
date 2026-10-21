import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      visitorId,
      sessionId,
      rating,
      category,
      confusing,
      improve,
      comment,
      device,
    } = body;

    // 1. Verify experiment exists and is active in Neon
    const experiment = await withDbRetry(() =>
      prisma.experiment.findUnique({
        where: { id },
      })
    );

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }

    // Experiment lifecycle policy:
    // ACTIVE, DRAFT, COMPLETED -> feedback allowed (active testers can still submit feedback)
    // PAUSED -> feedback blocked with clear explanation
    // ARCHIVED -> feedback blocked with clear explanation
    if (experiment.status === 'PAUSED') {
      return NextResponse.json(
        { error: 'This experiment is currently paused by the creator. Feedback is not being accepted at this time.', status: 'PAUSED' },
        { status: 403 }
      );
    }

    if (experiment.status === 'ARCHIVED') {
      return NextResponse.json(
        { error: 'This experiment has been archived. Feedback is closed.', status: 'ARCHIVED' },
        { status: 403 }
      );
    }

    // 2. Resolve or create anonymous Visitor record
    const effectiveVisitorId = visitorId || `v_anon_${Date.now().toString(36)}`;
    const visitor = await withDbRetry(() =>
      prisma.visitor.upsert({
        where: {
          experimentId_visitorId: {
            experimentId: experiment.id,
            visitorId: effectiveVisitorId,
          },
        },
        update: {
          lastSeenAt: new Date(),
        },
        create: {
          experimentId: experiment.id,
          visitorId: effectiveVisitorId,
          deviceType: device?.width && device.width < 768 ? 'mobile' : 'desktop',
        },
      })
    );

    // 3. Assemble full feedback comment from questions
    const parts: string[] = [];
    if (comment?.trim()) {
      parts.push(comment.trim());
    }
    if (confusing?.trim()) {
      parts.push(`What was confusing: ${confusing.trim()}`);
    }
    if (improve?.trim()) {
      parts.push(`What would you improve: ${improve.trim()}`);
    }

    const fullComment = parts.join(' | ') || 'Anonymous tester feedback response.';

    // 4. Build response entries
    const responsesData: Array<{ questionKey: string; answerValue: string }> = [];
    if (confusing?.trim()) {
      responsesData.push({
        questionKey: 'confusing',
        answerValue: confusing.trim(),
      });
    }
    if (improve?.trim()) {
      responsesData.push({
        questionKey: 'improve',
        answerValue: improve.trim(),
      });
    }

    // 5. Persist to Neon with visitorId (guarantees "Tester feedback" classification)
    const feedback = await withDbRetry(() =>
      prisma.feedback.create({
        data: {
          experimentId: experiment.id,
          visitorId: visitor.id,
          prompt: 'Public Tester Session',
          category: category ? category.trim().toLowerCase() : 'usability',
          rating: typeof rating === 'number' && rating >= 1 && rating <= 5 ? rating : null,
          comment: fullComment,
          responses: responsesData.length > 0 ? { create: responsesData } : undefined,
        },
      })
    );

    // Also record feedback submission event for telemetry
    if (sessionId) {
      try {
        await withDbRetry(() =>
          prisma.experimentEvent.create({
            data: {
              experimentId: experiment.id,
              sessionId: sessionId,
              visitorId: visitor.id,
              eventType: 'FORM_SUBMIT',
              element: 'tester_feedback_form',
              elementText: 'Submit Feedback',
              page: `/test/${experiment.id}`,
              metadata: { feedbackId: feedback.id, rating: rating || null },
            },
          })
        );
      } catch (e) {
        // Non-blocking telemetry error
      }
    }

    return NextResponse.json({
      status: 'success',
      message: 'Feedback received. Thank you for testing!',
      feedbackId: feedback.id,
    });
  } catch (error) {
    console.error('Error recording public tester feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error recording feedback' },
      { status: 500 }
    );
  }
}
