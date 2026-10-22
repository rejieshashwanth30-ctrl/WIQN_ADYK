'use client';

import React, { useState, useEffect } from 'react';

const STAGES = [
  { id: 'problem', label: '01 Idea', targetId: 'problem' },
  { id: 'loop', label: '02 Prototype', targetId: 'loop' },
  { id: 'evidence', label: '03 Users', targetId: 'evidence' },
  { id: 'qualitative', label: '04 Evidence', targetId: 'qualitative' },
  { id: 'decision', label: '05 Decision', targetId: 'decision' },
];

export const StickyValidationJourney: React.FC = () => {
  const [activeStage, setActiveStage] = useState<string>('problem');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show only after scrolling past the hero (e.g. 250px)
      const scrollY = window.scrollY;
      setVisible(scrollY > 240);

      // Check which section is in view
      const stages = ['decision', 'qualitative', 'evidence', 'loop', 'problem'];
      for (const stage of stages) {
        const el = document.getElementById(stage);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveStage(stage);
            return;
          }
        }
      }
      setActiveStage('problem');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <nav
      className="sticky-validation-journey"
      aria-label="Validation workflow progress"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          letterSpacing: '0.12em',
          color: '#a1a1aa',
          marginRight: '6px',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        WIQN LOOP
      </span>
      {STAGES.map((s, idx) => {
        const isActive = activeStage === s.id;
        return (
          <React.Fragment key={s.id}>
            {idx > 0 && (
              <span
                style={{
                  color: '#d4d4d8',
                  fontSize: '0.625rem',
                  userSelect: 'none',
                  padding: '0 2px',
                }}
              >
                →
              </span>
            )}
            <a
              href={`#${s.targetId}`}
              className={`sticky-step-pill ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span>{s.label}</span>
            </a>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
