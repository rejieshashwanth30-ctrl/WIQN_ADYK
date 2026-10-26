'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/homepage/HeroSection';
import { WiqnFeaturesSection } from '@/components/homepage/WiqnFeaturesSection';
import { HowWiqnWorksSection } from '@/components/homepage/HowWiqnWorksSection';
import { WhyWiqnSection } from '@/components/homepage/WhyWiqnSection';
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

      {/* Main Content Sections: Exact 8-section compact visual UX architecture */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* 01 — HERO */}
        <HeroSection />

        {/* 02 — WIQN FEATURES (Visual Feature Map & Decision Indicator) */}
        <WiqnFeaturesSection />

        {/* 03 — HOW WIQN WORKS (Desktop Horizontal Flow & Mobile Grouped Flow) */}
        <HowWiqnWorksSection />

        {/* 04 — WHY WIQN (Don't Just Build. Prove It.) */}
        <WhyWiqnSection />

        {/* 05 — ABOUT WIQN (Compact + Better Decisions) */}
        <AboutWiqnSection />

        {/* 06 — BUILT BY (Rejiesh Ashwanth V Only) */}
        <CompanyLeadershipSection />

        {/* 07 — CONTACT (Dineshraj S Founder + Rejiesh + Phone + Email + Instagram) */}
        <ContactSection />

        {/* 08 — FINAL CTA */}
        <FinalCtaSection />
      </main>

      {/* Light Theme Footer */}
      <Footer theme="light" />
    </div>
  );
}
