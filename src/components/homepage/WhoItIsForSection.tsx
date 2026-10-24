'use client';

import React from 'react';
import { Rocket, Laptop, Users, Code2 } from 'lucide-react';

const AUDIENCES = [
  {
    icon: Rocket,
    role: 'FOUNDERS',
    subtitle: 'Early-Stage Ventures',
    desc: 'Validate startup assumptions with real users before spending scarce runway and engineering hours building features nobody adopts.',
  },
  {
    icon: Laptop,
    role: 'INDIE HACKERS',
    subtitle: 'Solo Creators',
    desc: 'Quickly test interactive MVPs and landing page workflows to find genuine customer pull without heavy analytics overhead.',
  },
  {
    icon: Users,
    role: 'PRODUCT TEAMS',
    subtitle: 'Scale & Growth Teams',
    desc: 'Substitute internal debates and executive opinions with verifiable behavioral telemetry and contextual tester feedback.',
  },
  {
    icon: Code2,
    role: 'DEVELOPERS',
    subtitle: 'Full-Stack Engineers',
    desc: 'Put prototypes in front of real users to confirm UX ergonomics and interaction flows before writing production backend schemas.',
  },
];

export const WhoItIsForSection: React.FC = () => {
  return (
    <section
      id="built-for"
      style={{
        padding: 'clamp(72px, 11vh, 128px) 20px',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>05 // BUILT FOR</span>
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
            BUILT FOR PEOPLE WHO BUILD.
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              color: '#52525b',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Whether you are launching your first startup or shipping features at scale, WIQN gives you empirical evidence to build what matters.
          </p>
        </div>

        {/* 4 Clean Minimal Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {AUDIENCES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                className="editorial-card"
                style={{
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '4px',
                    backgroundColor: '#f4f4f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#09090b',
                  }}
                >
                  <Icon size={18} />
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: '#09090b',
                      marginBottom: '2px',
                    }}
                  >
                    {item.role}
                  </h3>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: '#71717a',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.subtitle}
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '0.84375rem',
                    color: '#52525b',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
