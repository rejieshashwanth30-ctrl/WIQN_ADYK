'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, Play, Sparkles } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { OpeningExperience } from '@/components/OpeningExperience';
import { DynamicBackground } from '@/components/DynamicBackground';
import { HeroCanvas } from '@/components/HeroCanvas';
import { HowWiqnWorks } from '@/components/HowWiqnWorks';
import { ProductDifference } from '@/components/ProductDifference';
import { EditorialFeatures } from '@/components/EditorialFeatures';
import { CardexSection } from '@/components/CardexSection';
import { ScrollStory } from '@/components/ScrollStory';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [replayIntro, setReplayIntro] = useState(false);

  return (
    <main style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#050505' }}>
      {/* Cinematic Opening Sequence */}
      <OpeningExperience
        forcePlay={replayIntro}
        onComplete={() => setReplayIntro(false)}
      />

      {/* Dynamic Monochromatic Background System (8 Scroll States) */}
      <DynamicBackground />

      {/* Header Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '100px',
          paddingBottom: '60px',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Hero Left: Strategic Copy & Identity */}
            <div style={{ maxWidth: '640px' }}>
              {/* Eyebrow */}
              <div className="eyebrow" style={{ marginBottom: '18px' }}>
                <span className="eyebrow-dot" />
                <span>ADYK WIQN</span>
              </div>

              {/* Main Headline */}
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.75rem, 6.2vw, 5.25rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.98,
                  color: 'var(--color-white)',
                  marginBottom: '28px',
                }}
              >
                FROM IDEA TO
                <br />
                <span
                  style={{
                    display: 'inline-block',
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
                    paddingBottom: '2px',
                  }}
                >
                  EVIDENCE.
                </span>
              </h1>

              {/* Supporting Text */}
              <p
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'clamp(1.0625rem, 1.8vw, 1.25rem)',
                  color: 'var(--color-silver-300)',
                  lineHeight: 1.6,
                  marginBottom: '36px',
                  maxWidth: '560px',
                }}
              >
                Validate your product with real users, real behavior and real feedback before investing heavily in building it.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <Link href="/experiments/new" className="btn-primary">
                  <span>Start An Experiment</span>
                  <ArrowUpRight size={16} />
                </Link>

                <Link href="#overview" className="btn-secondary">
                  <span>Explore Wiqn</span>
                </Link>

                <button
                  onClick={() => setReplayIntro(true)}
                  aria-label="Replay opening sequence"
                  className="btn-ghost"
                  title="Replay cinematic introduction"
                >
                  <Play size={12} />
                  <span>Replay Intro</span>
                </button>
              </div>

              {/* Supporting Line */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.14em',
                  color: 'var(--color-gray-500)',
                  textTransform: 'uppercase',
                }}
              >
                <span>Build.</span>
                <span>•</span>
                <span>Test.</span>
                <span>•</span>
                <span>Learn.</span>
                <span>•</span>
                <span>Decide.</span>
              </div>
            </div>

            {/* Hero Right: Mathematical Evidence Canvas */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HeroCanvas />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.2em',
            color: 'var(--color-gray-500)',
            textTransform: 'uppercase',
          }}
        >
          <span>SCROLL TO OBSERVE</span>
          <ChevronDown size={14} />
        </div>
      </section>

      {/* Brand Philosophy Overview */}
      <section
        id="overview"
        style={{
          padding: '140px 0',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: '#070709',
        }}
      >
        <div className="container-editorial">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>
              <span className="eyebrow-dot" />
              <span>THE FIRST PRINCIPLE</span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: 'var(--color-white)',
                marginBottom: '28px',
              }}
            >
              BUILDING A PRODUCT DOES NOT
              <br />
              MEAN PEOPLE WANT IT.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '1.125rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.7,
                maxWidth: '720px',
                margin: '0 auto',
              }}
            >
              Wiqn helps founders move from speculative assumptions to empirical evidence.
              Know what to build before you build too much.
            </p>
          </div>

          {/* Approved Brand Quotes Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              marginTop: '64px',
            }}
          >
            <div
              style={{
                backgroundColor: '#0a0a0d',
                border: '1px solid var(--border-subtle)',
                padding: '32px 28px',
                borderRadius: '2px',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '12px' }}>
                SIGNAL // 01
              </div>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-white)', fontWeight: 500, lineHeight: 1.5 }}>
                &ldquo;Test what you build with real users.&rdquo;
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#0a0a0d',
                border: '1px solid var(--border-subtle)',
                padding: '32px 28px',
                borderRadius: '2px',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '12px' }}>
                SIGNAL // 02
              </div>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-white)', fontWeight: 500, lineHeight: 1.5 }}>
                &ldquo;Build less on assumptions. Learn more from evidence.&rdquo;
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#0a0a0d',
                border: '1px solid var(--border-subtle)',
                padding: '32px 28px',
                borderRadius: '2px',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', marginBottom: '12px' }}>
                SIGNAL // 03
              </div>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9375rem', color: 'var(--color-white)', fontWeight: 500, lineHeight: 1.5 }}>
                &ldquo;Turn real user behavior into better product decisions.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seven-Step Cycle */}
      <HowWiqnWorks />

      {/* The Product Difference */}
      <ProductDifference />

      {/* Editorial System Features */}
      <EditorialFeatures />

      {/* ADYK CARDEX Alpha Network */}
      <CardexSection />

      {/* Scroll Narrative Story */}
      <ScrollStory />

      {/* Footer */}
      <Footer />
    </main>
  );
}
