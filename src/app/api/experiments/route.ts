import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // In production with PostgreSQL: return prisma.experiment.findMany()
  return NextResponse.json({
    status: 'success',
    data: [],
    message: 'Architecture ready for database connection.',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, productName, problem, targetAudience, productIdea, keyHypothesis, learningGoal, prototypeUrl, testingMode } = body;

    if (!name || !productName || !keyHypothesis) {
      return NextResponse.json(
        { error: 'Missing required validation thesis fields' },
        { status: 400 }
      );
    }

    const newExperiment = {
      id: `exp_${Date.now().toString(36)}`,
      name,
      productName,
      problem: problem || '',
      targetAudience: targetAudience || '',
      productIdea: productIdea || '',
      keyHypothesis,
      learningGoal: learningGoal || '',
      prototypeUrl: prototypeUrl || '',
      testingMode: testingMode || 'PRIVATE',
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        status: 'created',
        data: newExperiment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create experiment:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
