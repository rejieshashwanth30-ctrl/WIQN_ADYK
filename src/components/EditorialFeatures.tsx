'use client';

import React from 'react';
import { Layers, Activity, MessageSquareQuote, Cpu, Target, Compass, Sparkles } from 'lucide-react';

export const EditorialFeatures: React.FC = () => {
  return (
    <section id="features" style={{ position: 'relative', padding: '140px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '820px', marginBottom: '100px' }}>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>PRODUCT CAPABILITIES</span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: 'var(--color-white)',
              marginBottom: '20px',
            }}
          >
            SYSTEM ARCHITECTURE
            <br />
            BUILT FOR PRODUCT TRUTH.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: '1.0625rem',
              color: 'var(--color-silver-300)',
              lineHeight: 1.6,
            }}
          >
            Each module is engineered to extract unvarnished signal from real user sessions, without synthetic bias or decorative metrics.
          </p>
        </div>

        {/* Feature 1: Structured Experiments */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
            padding: '80px 0',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div className="eyebrow">
              <Layers size={14} style={{ color: 'var(--color-white)' }} />
              <span>FOUNDATION</span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--color-white)',
                marginBottom: '18px',
                lineHeight: 1.2,
              }}
            >
              Turn Assumptions Into Structured Experiments.
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '1rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.7,
                marginBottom: '28px',
              }}
            >
              Every product initiative begins with unexamined assumptions. Wiqn isolates your core hypothesis, specifies your target learning goal, and structures falsifiable success criteria before a single design asset is locked.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span className="badge">Falsifiable Hypotheses</span>
              <span className="badge">Target Audience Scoping</span>
              <span className="badge">Lifecycle State Gating</span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#0a0a0d',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '36px',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '20px', color: 'var(--color-gray-500)' }}>
              <span>SCHEMA // EXPERIMENT_SPEC</span>
              <span>STATE: ACTIVE</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--color-silver-200)' }}>
              <div><span style={{ color: 'var(--color-gray-500)' }}>01. HYPOTHESIS:</span> &quot;Self-hosted proxy setup reduces churn by 35%&quot;</div>
              <div><span style={{ color: 'var(--color-gray-500)' }}>02. METRIC_CRITERIA:</span> Conversion rate &gt;= 14.8% at Step 3</div>
              <div><span style={{ color: 'var(--color-gray-500)' }}>03. FALSIFICATION:</span> Dwell time &lt; 15s or error rate &gt; 5%</div>
              <div><span style={{ color: 'var(--color-gray-500)' }}>04. TESTING_CHANNEL:</span> CARDEX ALPHA (Technical cohort)</div>
            </div>
          </div>
        </div>

        {/* Feature 2: Autocapture & Behavior */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
            padding: '80px 0',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              order: 2,
              backgroundColor: '#0a0a0d',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '36px',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '20px', color: 'var(--color-gray-500)' }}>
              <span>BEACON_FEED // AUTOCAPTURE_TELEMETRY</span>
              <span style={{ color: '#ffffff' }}>● REALTIME</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--color-silver-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-white)' }}>[PAGE_VIEW]</span>
                <span style={{ color: 'var(--color-gray-500)' }}>path: /demo-checkout (148ms)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-silver-300)' }}>[INTERACT]</span>
                <span style={{ color: 'var(--color-gray-500)' }}>el: button#connect-wallet</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-silver-300)' }}>[HESITATE]</span>
                <span style={{ color: 'var(--color-gray-500)' }}>dwell: 6.8s over auth modal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>[DROP_OFF]</span>
                <span style={{ color: 'var(--color-gray-500)' }}>exit: window_closed (no error)</span>
              </div>
            </div>
          </div>

          <div style={{ order: 1 }}>
            <div className="eyebrow">
              <Activity size={14} style={{ color: 'var(--color-white)' }} />
              <span>TELEMETRY</span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--color-white)',
                marginBottom: '18px',
                lineHeight: 1.2,
              }}
            >
              Autocapture User Behavior Without Manual Tagging.
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '1rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.7,
                marginBottom: '28px',
              }}
            >
              Never wire custom tracking code onto every button again. A lightweight snippet automatically tracks page views, interactive elements, form submit milestones, and dwell times while respecting user privacy and excluding sensitive credentials.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span className="badge">Zero Custom Selectors</span>
              <span className="badge">Non-Intrusive Beacon</span>
              <span className="badge">Dwell & Exit Analysis</span>
            </div>
          </div>
        </div>

        {/* Feature 3: AI Insights Architecture */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
            padding: '80px 0',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div className="eyebrow">
              <Cpu size={14} style={{ color: 'var(--color-white)' }} />
              <span>SYNTHESIS</span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--color-white)',
                marginBottom: '18px',
                lineHeight: 1.2,
              }}
            >
              Structured Intelligence, Not A Chatbot.
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '1rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.7,
                marginBottom: '28px',
              }}
            >
              Wiqn rejects conversational chat interfaces for product decisions. Instead, intelligence is distilled into five strict categorical pillars: verified Facts, testable Hypotheses, actionable Recommendations, empirical Confidence, and explicit statistical Limitations.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span className="badge">Facts vs Hypotheses</span>
              <span className="badge">Confidence Ratings</span>
              <span className="badge">Explicit Limitations</span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#0a0a0d',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '36px',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ borderLeft: '2px solid #ffffff', paddingLeft: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: '#ffffff', textTransform: 'uppercase' }}>
                01 // FACT
              </div>
              <div style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: 'var(--color-silver-200)', marginTop: '4px' }}>
                64.2% of users initiated checkout, but 41% abandoned at the authorization modal.
              </div>
            </div>

            <div style={{ borderLeft: '2px solid var(--color-silver-300)', paddingLeft: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-silver-300)', textTransform: 'uppercase' }}>
                02 // HYPOTHESIS
              </div>
              <div style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: 'var(--color-silver-200)', marginTop: '4px' }}>
                Users perceive real financial debit risk because simulated zero-gas cues are absent.
              </div>
            </div>

            <div style={{ borderLeft: '2px solid var(--color-gray-500)', paddingLeft: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                03 // LIMITATION
              </div>
              <div style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
                Cohort sampled predominantly from desktop Chrome. Mobile Safari behavior unmeasured.
              </div>
            </div>
          </div>
        </div>

        {/* Feature 4: Defensible Decisions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
            padding: '80px 0',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              order: 2,
              backgroundColor: '#0a0a0d',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '36px',
              borderRadius: '2px',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-gray-500)', marginBottom: '20px' }}>
              DECISION_MATRIX // OUTCOME
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-silver-300)' }}>BUILD</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>Proceed to production</div>
              </div>
              <div style={{ padding: '16px', border: '1px solid #ffffff', backgroundColor: 'var(--color-white)', color: '#000000' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700 }}>IMPROVE</div>
                <div style={{ fontSize: '0.6875rem', color: '#333333', marginTop: '4px' }}>Resolve trust friction</div>
              </div>
              <div style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-silver-300)' }}>PIVOT</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>Shift value premise</div>
              </div>
              <div style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-silver-300)' }}>STOP</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>Preserve runway</div>
              </div>
            </div>
          </div>

          <div style={{ order: 1 }}>
            <div className="eyebrow">
              <Target size={14} style={{ color: 'var(--color-white)' }} />
              <span>EXECUTIVE GOVERNANCE</span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--color-white)',
                marginBottom: '18px',
                lineHeight: 1.2,
              }}
            >
              Defensible Decisions: Build, Improve, Pivot, Stop.
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '1rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.7,
                marginBottom: '28px',
              }}
            >
              Founders fail when they treat AI summaries as absolute truth or proceed blindly on personal confirmation bias. Wiqn requires explicit evidence mapping for every product milestone: committing code, iterating copy, shifting architecture, or gracefully killing unviable concepts.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span className="badge">5 Explicit Outcomes</span>
              <span className="badge">Reasoning Audit Trail</span>
              <span className="badge">Action Gate Criteria</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
