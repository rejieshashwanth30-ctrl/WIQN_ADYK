'use client';

import React, { useState } from 'react';
import {
  FileText,
  Globe,
  Users,
  Activity,
  MessageSquare,
  Sparkles,
  Target,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface SurfaceTab {
  id: string;
  label: string;
  badge: string;
  headline: string;
  description: string;
  icon: any;
  mockup: React.ReactNode;
}

export const ProductExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('experiment');

  const SURFACES: SurfaceTab[] = [
    {
      id: 'experiment',
      label: '01 Experiment',
      badge: 'FOUNDATION',
      headline: 'Formulate falsifiable hypotheses & define test parameters.',
      description:
        'State explicit assumptions, designate the target user profile, and specify what interaction criteria will prove or disprove your value proposition.',
      icon: FileText,
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a' }}>EXPERIMENT CONFIGURATION</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#09090b' }}>
                Onboarding Self-Serve Flow Validation
              </div>
            </div>
            <span style={{ backgroundColor: '#f4f4f5', border: '1px solid #e4e4e7', padding: '4px 10px', borderRadius: '4px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              STATUS: ACTIVE
            </span>
          </div>

          <div style={{ backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '4px', padding: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', marginBottom: '4px' }}>FALSIFIABLE HYPOTHESIS:</div>
            <div style={{ fontSize: '0.8125rem', color: '#09090b', lineHeight: 1.5 }}>
              &quot;If we replace manual domain DNS configuration with automated cloud verification, initial setup completion will exceed 65% with zero drop-off on the verification step.&quot;
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            <div style={{ border: '1px solid #e4e4e7', borderRadius: '4px', padding: '10px 12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a' }}>TARGET COHORT</span>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#09090b' }}>Technical Founders &amp; Devs</div>
            </div>
            <div style={{ border: '1px solid #e4e4e7', borderRadius: '4px', padding: '10px 12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a' }}>PROTOTYPE URL</span>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#09090b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                https://staging.app.io/v2
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'prototype',
      label: '02 Prototype Sandbox',
      badge: 'INTERACTION',
      headline: 'Interactive tester sandbox with zero setup friction.',
      description:
        'Testers explore your live web application or prototype in an isolated frame. Autocapture starts instantly without intrusive extensions or permissions.',
      icon: Globe,
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f4f4f5', padding: '8px 14px', borderRadius: '4px', border: '1px solid #e4e4e7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#09090b', fontWeight: 600 }}>SANDBOX ACTIVE // AUTOCAPTURE RUNNING</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a' }}>1-CLICK TESTER LINK</span>
          </div>

          <div style={{ border: '1px solid #e4e4e7', borderRadius: '4px', padding: '24px 20px', backgroundColor: '#fafafa', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <Globe size={22} color="#09090b" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: '#09090b', marginBottom: '4px' }}>
              https://staging.app.io/v2-preview
            </div>
            <p style={{ fontSize: '0.75rem', color: '#71717a', maxWidth: '380px', margin: '0 auto' }}>
              Testers interact directly with your live web application. Clicks, scroll progression, and route navigation are recorded seamlessly.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'activity',
      label: '03 Visitor Activity',
      badge: 'TELEMETRY',
      headline: 'Observe authentic sessions, viewports & exploration paths.',
      description:
        'Track tester session durations, screen dimensions, and exploration completion states in real time without vanity counters.',
      icon: Users,
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#09090b' }}>
              SESSION LEDGER
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a' }}>
              CHRONOLOGICAL LOG
            </span>
          </div>

          {[
            { id: 'Tester #12', device: 'Desktop · 1920×1080', duration: '4m 32s', status: 'Completed Flow', path: 'Home → Pricing → Checkout' },
            { id: 'Tester #11', device: 'Mobile · 390×844', duration: '2m 14s', status: 'Dropoff at Form', path: 'Home → Feature Specs → Form' },
            { id: 'Tester #10', device: 'Desktop · 1440×900', duration: '6m 08s', status: 'Completed Flow', path: 'Home → Workspace → Invite' },
          ].map((sess, i) => (
            <div key={i} style={{ border: '1px solid #e4e4e7', borderRadius: '4px', padding: '10px 12px', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: '#09090b' }}>
                  {sess.id} <span style={{ color: '#a1a1aa', fontWeight: 400 }}>({sess.device})</span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#52525b', marginTop: '2px' }}>
                  Path: {sess.path}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#09090b', fontWeight: 600 }}>{sess.duration}</span>
                <div style={{ fontSize: '0.625rem', color: sess.status.includes('Dropoff') ? '#e11d48' : '#10b981', fontWeight: 500 }}>
                  {sess.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'explorer',
      label: '04 Event Explorer',
      badge: 'EVENTS',
      headline: 'Deep inspection of individual autocaptured interaction events.',
      description:
        'Filter events by element target, event type, route, and timestamp down to millisecond accuracy for forensic UX analysis.',
      icon: Activity,
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#09090b' }}>
              EVENT TELEMETRY LOG
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a' }}>
              FILTER: ALL EVENTS
            </span>
          </div>

          {[
            { tag: 'click', time: '+00:12', el: 'button#btn-continue', meta: 'text: "Continue to Setup"' },
            { tag: 'scroll', time: '+00:19', el: 'window.scrollY', meta: 'reached: 75% scroll depth' },
            { tag: 'input', time: '+00:27', el: 'input#org-name', meta: 'field focus & text input' },
            { tag: 'click', time: '+00:41', el: 'a#pricing-toggle', meta: 'switched to Annual billing' },
          ].map((ev, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#fcfcfc', border: '1px solid #e4e4e7', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#a1a1aa' }}>{ev.time}</span>
                <span style={{ padding: '2px 6px', backgroundColor: '#f4f4f5', borderRadius: '2px', fontWeight: 600, color: '#09090b' }}>{ev.tag}</span>
                <span style={{ color: '#09090b', fontWeight: 500 }}>{ev.el}</span>
              </div>
              <span style={{ color: '#71717a' }}>{ev.meta}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'feedback',
      label: '05 Qualitative Feedback',
      badge: 'SIGNALS',
      headline: 'Capture subjective sentiment alongside objective behavior.',
      description:
        'Contextual prompts intercept friction points at critical moments. Review ratings, hesitation comments, and clarity feedback.',
      icon: MessageSquare,
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#09090b' }}>
              QUALITATIVE FEEDBACK SUBMISSIONS
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a' }}>
              3 RECENT REVIEWS
            </span>
          </div>

          {[
            { prompt: 'What was confusing about this prototype?', quote: '"The setup was easy, but I wasn\'t sure where to input my API key on the third step."', rating: '4/5', user: 'Tester #8' },
            { prompt: 'Would you pay for this solution?', quote: '"Yes, if it integrates with our existing GitHub Actions workflow without extra setup."', rating: '5/5', user: 'Tester #3' },
          ].map((fb, i) => (
            <div key={i} style={{ border: '1px solid #e4e4e7', borderRadius: '4px', padding: '12px 14px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a' }}>{fb.user} // RATING: {fb.rating}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#10b981' }}>VERIFIED TESTER</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#71717a', fontStyle: 'italic', marginBottom: '2px' }}>{fb.prompt}</div>
              <div style={{ fontSize: '0.8125rem', color: '#09090b', lineHeight: 1.4 }}>{fb.quote}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'ai-insights',
      label: '06 AI Insights',
      badge: 'SYNTHESIS',
      headline: 'Rigorous 3-tier synthesis of fact, interpretation & conclusion.',
      description:
        'Synthesizes telemetry drop-offs with user comments. Rigorously separates empirical interaction facts from AI-assisted hypotheses.',
      icon: Sparkles,
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ border: '1px solid #e4e4e7', borderRadius: '4px', padding: '10px 12px', borderLeft: '3px solid #09090b' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#09090b', fontWeight: 700 }}>FACT // OBSERVATION</span>
            <div style={{ fontSize: '0.78125rem', color: '#09090b', marginTop: '2px' }}>
              80% of testers visited pricing before signup; 0 clicked the secondary enterprise tier.
            </div>
          </div>
          <div style={{ border: '1px solid #e4e4e7', borderRadius: '4px', padding: '10px 12px', borderLeft: '3px solid #71717a' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#52525b', fontWeight: 700 }}>AI // INTERPRETATION</span>
            <div style={{ fontSize: '0.78125rem', color: '#09090b', marginTop: '2px' }}>
              Value proposition clarity is solid, but enterprise plan ambiguity causes hesitation at the CTA.
            </div>
          </div>
          <div style={{ border: '1px solid #e4e4e7', borderRadius: '4px', padding: '10px 12px', borderLeft: '3px solid #10b981' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#10b981', fontWeight: 700 }}>NEXT STEP // CONCLUSION</span>
            <div style={{ fontSize: '0.78125rem', color: '#09090b', marginTop: '2px' }}>
              Surface standard plan inclusions directly above checkout, or test simplified single-tier pricing.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'decision-engine',
      label: '07 Executive Decision',
      badge: 'VERDICT',
      headline: 'Structured roadmap verdicts backed by verifiable evidence.',
      description:
        'Commit to Build, Improve, Pivot, Stop, or Test Again with confidence. Export an immutable evidence audit trail for stakeholders.',
      icon: Target,
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a' }}>RECORDED VERDICT</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#09090b' }}>
                VERDICT: IMPROVE (HIGH CONFIDENCE)
              </div>
            </div>
            <span style={{ backgroundColor: '#09090b', color: '#ffffff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              COMMITTED
            </span>
          </div>

          <div style={{ backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '4px', padding: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#71717a' }}>FOUNDER RATIONALE &amp; EVIDENCE BASIS:</span>
            <div style={{ fontSize: '0.78125rem', color: '#09090b', lineHeight: 1.5, marginTop: '2px' }}>
              &quot;The core workflow demonstrated high retention, but onboarding hesitation around billing details warrants a minor UI adjustment before advancing to production engineering.&quot;
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#71717a' }}>
            <span>AUDIT LOG #EV-8921</span>
            <span>EXPORTABLE TO TEAM &amp; INVESTORS</span>
          </div>
        </div>
      ),
    },
  ];

  const currentSurface = SURFACES.find((s) => s.id === activeTab) || SURFACES[0];

  return (
    <section
      id="product"
      style={{
        padding: 'clamp(72px, 11vh, 128px) 20px',
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        borderBottom: '1px solid #e4e4e7',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>THE PRODUCT EXPERIENCE</span>
            </div>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.4vw, 3.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              color: '#09090b',
              marginBottom: '16px',
            }}
          >
            ENGINEERED FOR PRODUCT TRUTH.
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              color: '#52525b',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Explore the core surfaces of WIQN: from initial hypothesis setup to live telemetry, in-context feedback, AI-assisted synthesis, and the decision verdict.
          </p>
        </div>

        {/* Tab Selector (Horizontal scrollable on small screens) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '28px',
            borderBottom: '1px solid #e4e4e7',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {SURFACES.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: isSelected ? '#09090b' : 'transparent',
                  color: isSelected ? '#ffffff' : '#52525b',
                  border: isSelected ? '1px solid #09090b' : '1px solid transparent',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 600 : 500,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 160ms ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Surface Showcase Box */}
        <div
          className="editorial-card"
          style={{
            padding: 'clamp(24px, 4vw, 40px)',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '36px',
              alignItems: 'center',
            }}
          >
            {/* Left side: Surface Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.14em',
                  color: '#71717a',
                  fontWeight: 600,
                }}
              >
                CAPABILITY // {currentSurface.badge}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
                  fontWeight: 700,
                  color: '#09090b',
                  lineHeight: 1.25,
                }}
              >
                {currentSurface.headline}
              </h3>

              <p
                style={{
                  fontSize: '0.9375rem',
                  color: '#52525b',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {currentSurface.description}
              </p>

              <div style={{ paddingTop: '8px' }}>
                <Link
                  href="/experiments/new"
                  className="btn-primary-light"
                  style={{ alignSelf: 'flex-start', display: 'inline-flex' }}
                >
                  <span>Test in WIQN</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right side: Real UI Mockup Preview */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: '6px',
                padding: '20px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
              }}
            >
              {currentSurface.mockup}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
