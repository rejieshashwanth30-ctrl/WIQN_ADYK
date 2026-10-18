'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface OpeningExperienceProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onComplete, forcePlay = false }) => {
  const [phase, setPhase] = useState<number>(0);
  // 0: Black screen with atmospheric glow
  // 1: Logo subtle appearance with light beam
  // 2: ADYK reveal
  // 3: WIQN reveal
  // 4: "FROM IDEA TO EVIDENCE." reveal
  // 5: Dissolve into homepage
  // 6: Unmounted
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    // Check if user already saw opening sequence in this session, unless forced
    const hasSeen = sessionStorage.getItem('__wiqn_intro_seen');
    if (hasSeen && !forcePlay) {
      setVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Sequence timing: ~2.8 seconds total
    const t1 = setTimeout(() => setPhase(1), 300);   // Logo subtle reveal
    const t2 = setTimeout(() => setPhase(2), 900);   // "ADYK"
    const t3 = setTimeout(() => setPhase(3), 1400);  // "WIQN"
    const t4 = setTimeout(() => setPhase(4), 1900);  // "FROM IDEA TO EVIDENCE."
    const t5 = setTimeout(() => setPhase(5), 2600);  // Smooth fade-out starts
    const t6 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('__wiqn_intro_seen', 'true');
      if (onComplete) onComplete();
    }, 3100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [forcePlay, onComplete]);

  const skipIntro = () => {
    setPhase(5);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('__wiqn_intro_seen', 'true');
      if (onComplete) onComplete();
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 5 ? 0 : 1,
        transition: 'opacity 550ms cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: phase === 5 ? 'none' : 'auto',
      }}
    >
      {/* Restrained radial light reveal */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 45%, transparent 70%)',
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.6)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'transform 1200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 900ms ease',
          pointerEvents: 'none',
        }}
      />

      {/* Centerpiece Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
          zIndex: 2,
        }}
      >
        {/* Supplied Official Mark */}
        <div
          style={{
            width: 'clamp(60px, 16vw, 84px)',
            height: 'clamp(60px, 16vw, 84px)',
            position: 'relative',
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.96)',
            transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#000000',
            boxShadow: '0 0 35px rgba(255, 255, 255, 0.05)',
          }}
        >
          <Image
            src="/brand/adyk-wiqn-logo.png"
            alt="ADYK Wiqn Mark"
            fill
            sizes="84px"
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Brand Hierarchy */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {/* ADYK */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.6875rem, 2vw, 0.8125rem)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-silver-300)',
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 500ms ease, transform 500ms ease',
            }}
          >
            ADYK
          </span>

          {/* WIQN */}
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 6vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: 'var(--color-white)',
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 500ms ease, transform 500ms ease',
            }}
          >
            WIQN
          </span>
        </div>

        {/* Primary Tagline */}
        <div
          style={{
            marginTop: '8px',
            opacity: phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.6875rem, 2.5vw, 0.875rem)',
              letterSpacing: 'clamp(0.12em, 2vw, 0.24em)',
              textTransform: 'uppercase',
              color: 'var(--color-silver-200)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '14px',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            FROM IDEA TO EVIDENCE.
          </p>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={skipIntro}
        style={{
          position: 'absolute',
          bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.18em',
          color: 'var(--color-gray-500)',
          background: 'none',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '8px 16px',
          borderRadius: '2px',
          cursor: 'pointer',
          transition: 'color 200ms ease, border-color 200ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-gray-500)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        }}
      >
        ESC / SKIP
      </button>
    </div>
  );
};
