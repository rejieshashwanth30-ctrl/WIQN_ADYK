'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/homepage/HeroSection';
import { ValidationLoopSection } from '@/components/homepage/ValidationLoopSection';
import { BehavioralEvidenceSection } from '@/components/homepage/BehavioralEvidenceSection';
import { TheProblemSection } from '@/components/homepage/TheProblemSection';
import { WhoItIsForSection } from '@/components/homepage/WhoItIsForSection';
import { AboutWiqnSection } from '@/components/homepage/AboutWiqnSection';
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

      {/* Main Content Sections: Exact 9-section compact architecture */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* 01 — Hero */}
        <HeroSection />

        {/* 02 — How WIQN Works */}
        <ValidationLoopSection />

        {/* 03 — What WIQN Measures */}
        <BehavioralEvidenceSection />

        {/* 04 — Why WIQN */}
        <TheProblemSection />

        {/* 05 — Built For */}
        <WhoItIsForSection />

        {/* 06 — About WIQN */}
        <AboutWiqnSection />

        {/* 07 — Built By (Rejiesh Ashwanth V) */}
        <CompanyLeadershipSection />

        {/* 08 — Contact (Dineshraj S & Rejiesh Ashwanth V) */}
        <ContactSection />

        {/* 09 — Final CTA */}
        <FinalCtaSection />
      </main>

      {/* Light Theme Footer */}
      <Footer theme="light" />
    </div>
  );
}
