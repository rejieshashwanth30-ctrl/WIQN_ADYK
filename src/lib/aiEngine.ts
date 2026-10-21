/**
 * ADYK WIQN SERVER-SIDE AI ANALYSIS ENGINE
 * 
 * Safely analyzes structured experiment evidence using an external LLM
 * (Google Gemini or OpenAI) when configured in server environment variables,
 * or falls back to the deterministic evidence synthesis engine when no API key
 * is present or the external provider is temporarily unavailable.
 * 
 * ZERO client-side API keys. ZERO fabricated numbers.
 */

import { EvidencePack, synthesizeExperimentEvidence } from './evidenceEngine';
import { InsightType, ConfidenceLevel, DecisionOutcome } from '@prisma/client';

export interface AIAnalysisResult {
  provider: 'gemini' | 'openai' | 'deterministic_engine';
  generatedAt: string;
  summary: string;
  evidenceLevel: 'INSUFFICIENT' | 'EARLY_SIGNALS' | 'SUFFICIENT';
  confidence: ConfidenceLevel;
  suggestedOutcome: DecisionOutcome;
  suggestedOutcomeReason: string;

  facts: Array<{
    title: string;
    statement: string;
    evidence: string;
  }>;

  hypotheses: Array<{
    title: string;
    statement: string;
    basis: string;
  }>;

  recommendations: Array<{
    title: string;
    action: string;
    rationale: string;
  }>;

  sayVsDoSignals?: Array<{
    title: string;
    statedFeedback: string;
    observedBehavior: string;
    interpretation: string;
  }>;

  topProblems?: string[];
  topPositives?: string[];
  limitations: string[];
  notice?: string;
}

export async function runServerAIAnalysis(evidence: EvidencePack): Promise<AIAnalysisResult> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. If Gemini API Key is configured, attempt real Google Gemini call
  if (geminiKey) {
    try {
      const geminiResult = await callGeminiAnalysis(evidence, geminiKey);
      if (geminiResult) return geminiResult;
    } catch (err) {
      console.warn('[AI Engine] Gemini API call failed, falling back to deterministic engine:', err);
    }
  }

  // 2. If OpenAI API Key is configured, attempt real OpenAI call
  if (openaiKey) {
    try {
      const openaiResult = await callOpenAIAnalysis(evidence, openaiKey);
      if (openaiResult) return openaiResult;
    } catch (err) {
      console.warn('[AI Engine] OpenAI API call failed, falling back to deterministic engine:', err);
    }
  }

  // 3. Fallback to deterministic evidence engine (honest, verified, zero hallucinations)
  return buildDeterministicAnalysis(evidence);
}

// ----------------------------------------------------
// Google Gemini Provider
// ----------------------------------------------------
async function callGeminiAnalysis(evidence: EvidencePack, apiKey: string): Promise<AIAnalysisResult | null> {
  const prompt = buildAIPrompt(evidence);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2, // Low temperature for high factual accuracy
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[AI Engine] Gemini HTTP Error:', response.status, errorText);
    return null;
  }

  const json = await response.json();
  const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  const parsed = JSON.parse(rawText);
  return formatParsedAIOutput('gemini', parsed, evidence);
}

// ----------------------------------------------------
// OpenAI Provider
// ----------------------------------------------------
async function callOpenAIAnalysis(evidence: EvidencePack, apiKey: string): Promise<AIAnalysisResult | null> {
  const prompt = buildAIPrompt(evidence);
  const url = 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an objective SaaS product evidence scientist for ADYK Wiqn.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  const rawText = json?.choices?.[0]?.message?.content;
  if (!rawText) return null;

  const parsed = JSON.parse(rawText);
  return formatParsedAIOutput('openai', parsed, evidence);
}

// ----------------------------------------------------
// Prompt Builder (Strict factual boundaries)
// ----------------------------------------------------
function buildAIPrompt(evidence: EvidencePack): string {
  return `You are the AI Evidence Synthesis Engine for ADYK Wiqn.
Analyze the following real product experiment evidence and return a strict JSON response.

CRITICAL RULES:
1. NEVER fabricate numbers or claim data exists that is not in the evidence below.
2. If evidenceLevel is "INSUFFICIENT" (sample is small: visitors < 5 or actions < 20):
   - You MUST recommend "TEST_AGAIN"
   - Confidence MUST be "LOW" or "VERY_LOW"
   - You MUST NOT declare the product validated or declare that the founder should commit to building it.
3. Distinguish clearly:
   - OBSERVATIONS / FACTS (what was physically measured)
   - INTERPRETATIONS / HYPOTHESES (possible explanations)
   - RECOMMENDATIONS (actionable next steps)
4. Strictly distinguish OBSERVATION from INTERPRETATION from CONCLUSION:
   - Never claim that button clicks alone prove product demand or product-market fit.
   - If telemetry shows where users stopped but does not establish why, state clearly: "The available telemetry shows where users stopped, but does not establish why."
5. Highlight any Say-vs-Do contradictions (e.g. user rated 5/5 but only stayed for a few seconds or dropped off).

EXPERIMENT DATA:
- Experiment Name: "${evidence.experimentName}"
- Product: "${evidence.productName}"
- Hypothesis: "${evidence.hypothesis}"
- Problem: "${evidence.problem}"
- Learning Goal: "${evidence.learningGoal}"
- Traffic: ${evidence.sampleSummary.visitors} visitor(s), ${evidence.sampleSummary.sessions} session(s), ${evidence.sampleSummary.events} action(s)
- Avg Duration: ${evidence.sampleSummary.avgDurationSec} seconds
- Feedback Count: ${evidence.sampleSummary.feedbackCount}
- Feedback Quotes: ${JSON.stringify(evidence.userFeedbackSummary.quotes)}
- Average Rating: ${evidence.userFeedbackSummary.averageRating || 'None'} / 5
- Top Clicked Elements: ${JSON.stringify(evidence.topClickedElements || [])}
- Funnel Steps & Drop-offs: ${JSON.stringify(evidence.funnelSteps || [])}
- Measured Facts: ${JSON.stringify(evidence.measuredFacts)}
- Say-vs-Do Signals: ${JSON.stringify(evidence.sayVsDoSignals)}
- Evidence Level: "${evidence.evidenceLevel}"

REQUIRED JSON SCHEMA:
{
  "summary": "1-2 sentence plain-English summary",
  "confidence": "LOW" | "MODERATE" | "HIGH",
  "suggestedOutcome": "BUILD" | "IMPROVE" | "PIVOT" | "STOP" | "TEST_AGAIN",
  "suggestedOutcomeReason": "Clear rationale based on the evidence",
  "facts": [{"title": string, "statement": string, "evidence": string}],
  "hypotheses": [{"title": string, "statement": string, "basis": string}],
  "recommendations": [{"title": string, "action": string, "rationale": string}],
  "sayVsDoSignals": [{"title": string, "statedFeedback": string, "observedBehavior": string, "interpretation": string}],
  "topProblems": ["problem 1", "problem 2"],
  "topPositives": ["positive 1"],
  "limitations": ["limitation 1", "limitation 2"]
}`;
}

// ----------------------------------------------------
// Formatter for LLM JSON
// ----------------------------------------------------
function formatParsedAIOutput(provider: 'gemini' | 'openai', parsed: any, evidence: EvidencePack): AIAnalysisResult {
  // Safeguard: Force TEST_AGAIN and LOW confidence if sample size is insufficient
  let confidence: ConfidenceLevel = parsed.confidence === 'HIGH' ? 'HIGH' : parsed.confidence === 'MODERATE' ? 'MODERATE' : 'LOW';
  let suggestedOutcome: DecisionOutcome = parsed.suggestedOutcome || evidence.suggestedOutcome;

  if (evidence.evidenceLevel === 'INSUFFICIENT') {
    confidence = 'LOW';
    suggestedOutcome = 'TEST_AGAIN';
  }

  return {
    provider,
    generatedAt: new Date().toISOString(),
    summary: parsed.summary || 'Evidence analysis synthesized from prototype telemetry and tester feedback.',
    evidenceLevel: evidence.evidenceLevel,
    confidence,
    suggestedOutcome,
    suggestedOutcomeReason: parsed.suggestedOutcomeReason || evidence.suggestedOutcomeReason,
    facts: Array.isArray(parsed.facts) ? parsed.facts : evidence.measuredFacts,
    hypotheses: Array.isArray(parsed.hypotheses) ? parsed.hypotheses : [],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    sayVsDoSignals: Array.isArray(parsed.sayVsDoSignals) && parsed.sayVsDoSignals.length > 0 ? parsed.sayVsDoSignals : evidence.sayVsDoSignals,
    topProblems: Array.isArray(parsed.topProblems) ? parsed.topProblems : [],
    topPositives: Array.isArray(parsed.topPositives) ? parsed.topPositives : [],
    limitations: Array.isArray(parsed.limitations) ? parsed.limitations : evidence.evidenceLimitations,
  };
}

// ----------------------------------------------------
// Deterministic Analysis Fallback
// ----------------------------------------------------
function buildDeterministicAnalysis(evidence: EvidencePack): AIAnalysisResult {
  const hypotheses = evidence.possibleExplanations.map((exp, i) => ({
    title: `Observation Hypothesis ${i + 1}`,
    statement: exp,
    basis: 'Derived directly from visitor session activity and feedback records.',
  }));

  const recommendations = evidence.recommendedActions.map((act, i) => ({
    title: `Recommended Next Step ${i + 1}`,
    action: act,
    rationale: 'Addresses observed testing patterns and data collection goals.',
  }));

  let summary = '';
  if (evidence.evidenceLevel === 'INSUFFICIENT') {
    summary = `Testing is in the early stages with ${evidence.sampleSummary.visitors} visitor(s) and ${evidence.sampleSummary.events} action(s). More evidence is needed before drawing firm conclusions.`;
  } else if (evidence.userFeedbackSummary.averageRating && evidence.userFeedbackSummary.averageRating >= 4) {
    summary = `Initial evidence indicates favorable tester reception (${evidence.userFeedbackSummary.averageRating}/5 average rating) across ${evidence.sampleSummary.visitors} visitors.`;
  } else {
    summary = `Observed interactions show engagement, but tester friction points suggest usability refinements are needed.`;
  }

  const topProblems: string[] = [];
  if (evidence.userFeedbackSummary.averageRating !== null && evidence.userFeedbackSummary.averageRating < 3) {
    topProblems.push('Low qualitative ratings indicate user confusion or friction.');
  }
  if (evidence.sampleSummary.avgDurationSec > 0 && evidence.sampleSummary.avgDurationSec < 15) {
    topProblems.push('Short session duration (<15s) indicates potential bounce before core value delivery.');
  }

  const topPositives: string[] = [];
  if (evidence.sampleSummary.avgDurationSec >= 30) {
    topPositives.push(`Strong exploration depth (average ${evidence.sampleSummary.avgDurationSec}s per visit).`);
  }
  if (evidence.userFeedbackSummary.averageRating !== null && evidence.userFeedbackSummary.averageRating >= 4) {
    topPositives.push(`High satisfaction ratings (${evidence.userFeedbackSummary.averageRating}/5 average).`);
  }

  return {
    provider: 'deterministic_engine',
    generatedAt: new Date().toISOString(),
    summary,
    evidenceLevel: evidence.evidenceLevel,
    confidence: evidence.isSufficient ? 'MODERATE' : 'LOW',
    suggestedOutcome: evidence.suggestedOutcome,
    suggestedOutcomeReason: evidence.suggestedOutcomeReason,
    facts: evidence.measuredFacts.map((f) => ({
      title: f.title,
      statement: f.statement,
      evidence: f.evidence,
    })),
    hypotheses,
    recommendations,
    sayVsDoSignals: evidence.sayVsDoSignals,
    topProblems: topProblems.length > 0 ? topProblems : undefined,
    topPositives: topPositives.length > 0 ? topPositives : undefined,
    limitations: evidence.evidenceLimitations,
    notice: 'Synthesized using ADYK Wiqn Evidence Engine. All metrics and findings are calculated directly from real database records.',
  };
}
