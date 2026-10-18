'use client';

import React, { useEffect, useState } from 'react';

export type BackgroundState = 
  | 'intro'
  | 'hero'
  | 'problem'
  | 'workflow'
  | 'analytics'
  | 'insights'
  | 'decision'
  | 'cta';

interface DynamicBackgroundProps {
  currentState?: BackgroundState;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ currentState }) => {
  const [activeState, setActiveState] = useState<BackgroundState>(currentState || 'hero');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (currentState) {
      setActiveState(currentState);
      return;
    }

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollPos / docHeight : 0;
      setScrollY(scrollPos);

      // Map scroll progress to visual states
      if (progress < 0.12) {
        setActiveState('hero');
      } else if (progress < 0.28) {
        setActiveState('problem');
      } else if (progress < 0.44) {
        setActiveState('workflow');
      } else if (progress < 0.60) {
        setActiveState('analytics');
      } else if (progress < 0.76) {
        setActiveState('insights');
      } else if (progress < 0.88) {
        setActiveState('decision');
      } else {
        setActiveState('cta');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentState]);

  // Dynamic parameters for the 8 states
  const getStateStyles = () => {
    switch (activeState) {
      case 'intro':
        return {
          bg: '#050505',
          radialGlow: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)',
          gridOpacity: 0.015,
        };
      case 'hero':
        return {
          bg: '#050505',
          radialGlow: 'radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 45%, transparent 70%)',
          gridOpacity: 0.03,
        };
      case 'problem':
        return {
          bg: '#0a0a0c',
          radialGlow: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.04) 0%, transparent 65%)',
          gridOpacity: 0.045,
        };
      case 'workflow':
        return {
          bg: '#08080a',
          radialGlow: 'radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.035) 0%, transparent 60%)',
          gridOpacity: 0.05,
        };
      case 'analytics':
        return {
          bg: '#070709',
          radialGlow: 'radial-gradient(circle at 50% 60%, rgba(255, 255, 255, 0.04) 0%, transparent 60%)',
          gridOpacity: 0.04,
        };
      case 'insights':
        return {
          bg: '#0a0a0d',
          radialGlow: 'radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.045) 0%, transparent 60%)',
          gridOpacity: 0.035,
        };
      case 'decision':
        return {
          bg: '#050505',
          radialGlow: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.07) 0%, transparent 65%)',
          gridOpacity: 0.06,
        };
      case 'cta':
      default:
        return {
          bg: '#030304',
          radialGlow: 'radial-gradient(circle at 50% 85%, rgba(255, 255, 255, 0.05) 0%, transparent 60%)',
          gridOpacity: 0.02,
        };
    }
  };

  const config = getStateStyles();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: config.bg,
        transition: 'background-color 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Dynamic atmospheric radial illumination */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: config.radialGlow,
          transition: 'background-image 1000ms ease, opacity 800ms ease',
          opacity: 1,
        }}
      />

      {/* Architectural grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: config.gridOpacity,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 85%)',
          transform: `translateY(${(-scrollY * 0.05) % 48}px)`,
          transition: 'opacity 800ms ease',
        }}
      />

      {/* State indicator for technical observability */}
      <div
        style={{
          position: 'fixed',
          bottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
          left: 'max(16px, env(safe-area-inset-left, 16px))',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.22)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        STATE // {activeState.toUpperCase()}
      </div>
    </div>
  );
};
