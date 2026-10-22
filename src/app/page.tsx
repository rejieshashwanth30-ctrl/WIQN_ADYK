'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { StickyValidationJourney } from '@/components/homepage/StickyValidationJourney';
import { HeroSection } from '@/components/homepage/HeroSection';
import { TheProblemSection } from '@/components/homepage/TheProblemSection';
import { ValidationLoopSection } from '@/components/homepage/ValidationLoopSection';
import { BehavioralEvidenceSection } from '@/components/homepage/BehavioralEvidenceSection';
import { QualitativeSignalsSection } from '@/components/homepage/QualitativeSignalsSection';
import { AiInterpretationSection } from '@/components/homepage/AiInterpretationSection';
import { DecisionFrameworkSection } from '@/components/homepage/DecisionFrameworkSection';
import { ProductExperienceSection } from '@/components/homepage/ProductExperienceSection';
import { WhoItIsForSection } from '@/components/homepage/WhoItIsForSection';
import { CompanyLeadershipSection } from '@/components/homepage/CompanyLeadershipSection';
import { ContactSection } from '@/components/homepage/ContactSection';
import { FinalCtaSection } from '@/components/homepage/FinalCtaSection';

export default function HomePage() {
  return (
    <div className="wiqn-light-homepage">
      {/* Subtle architectural grid pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 85%)',
        }}
      />

      {/* Light Theme Navigation Header */}
      <Navigation theme="light" />

      {/* Desktop Sticky Validation Journey Indicator */}
      <StickyValidationJourney />

      {/* Main Content Sections */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Section 01: Hero */}
        <HeroSection />

        {/* Section 02: The Problem */}
        <TheProblemSection />

        {/* Section 03: The Validation Loop */}
        <ValidationLoopSection />

        {/* Section 04: Behavioral Evidence */}
        <BehavioralEvidenceSection />

        {/* Section 05: Qualitative Signals */}
        <QualitativeSignalsSection />

        {/* Section 06: AI Interpretation */}
        <AiInterpretationSection />

        {/* Section 07: Decision Framework */}
        <DecisionFrameworkSection />

        {/* Section 08: Product Experience */}
        <ProductExperienceSection />

        {/* Section 09: Who It Is For */}
        <WhoItIsForSection />

        {/* Company Leadership & Built By */}
        <CompanyLeadershipSection />

        {/* Contact & Inquiries */}
        <ContactSection />

        {/* Section 10: Final CTA */}
        <FinalCtaSection />
      </main>

      {/* Light Theme Footer */}
      <Footer theme="light" />
    </div>
  );
}
