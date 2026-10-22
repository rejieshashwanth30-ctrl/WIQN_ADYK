import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Phone,
  Mail,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const metadata: Metadata = {
  title: 'Contact WIQN',
  description:
    'Contact WIQN and ADYK Multi Venture Company for questions, feedback, partnerships, and product inquiries.',
};

export default function ContactPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#050505', color: '#f4f4f5' }}>
      {/* Background Architectural Mesh & Subtle Lighting */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(circle at 50% 12%, rgba(255, 255, 255, 0.04) 0%, rgba(5, 5, 5, 0) 65%)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)',
        }}
      />

      <Navigation />

      <main style={{ position: 'relative', zIndex: 1, paddingBottom: '72px' }}>
        {/* ==================================================================
            HERO: CONTACT WIQN / LET'S TALK
            ================================================================== */}
        <section
          style={{
            paddingTop: 'clamp(96px, 14vh, 136px)',
            paddingBottom: 'clamp(36px, 6vh, 56px)',
            paddingLeft: '20px',
            paddingRight: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>
            {/* Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.14em',
                  color: 'var(--color-silver-200)',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                GET IN TOUCH
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#ffffff',
                marginBottom: '14px',
              }}
            >
              Let&apos;s Talk.
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
                color: 'var(--color-silver-300)',
                lineHeight: 1.6,
                maxWidth: '620px',
                margin: '0 auto',
                textWrap: 'balance',
              }}
            >
              Have a question, partnership idea, feedback, or want to learn more about WIQN? Get in touch with us.
            </p>
          </div>
        </section>

        {/* ==================================================================
            DIRECT INTERACTIVE CONTACT CARDS
            ================================================================== */}
        <section
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            padding: '0 20px',
            marginBottom: '56px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Phone Card */}
            <div
              style={{
                padding: '24px 22px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Phone size={18} color="#ffffff" />
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-gray-500)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    PHONE
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1875rem',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    8870605699
                  </div>
                  <p
                    style={{
                      fontSize: '0.78125rem',
                      color: 'var(--color-gray-400)',
                      marginTop: '4px',
                    }}
                  >
                    Direct telephone inquiry & support
                  </p>
                </div>
              </div>

              <a
                href="tel:8870605699"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background-color 150ms ease, border-color 150ms ease',
                }}
              >
                <span>Call Us</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Email Card */}
            <div
              style={{
                padding: '24px 22px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Mail size={18} color="#ffffff" />
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-gray-500)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    EMAIL
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      wordBreak: 'break-all',
                    }}
                  >
                    adykcompany.in@gmail.com
                  </div>
                  <p
                    style={{
                      fontSize: '0.78125rem',
                      color: 'var(--color-gray-400)',
                      marginTop: '4px',
                    }}
                  >
                    Official email inquiries & partnership proposals
                  </p>
                </div>
              </div>

              <a
                href="mailto:adykcompany.in@gmail.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background-color 150ms ease, border-color 150ms ease',
                }}
              >
                <span>Email Us</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* LinkedIn Card */}
            <div
              style={{
                padding: '24px 22px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LinkedInIcon size={18} />
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-gray-500)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    LINKEDIN
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.0625rem',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    Rejiesh Ashwanth V
                  </div>
                  <p
                    style={{
                      fontSize: '0.78125rem',
                      color: 'var(--color-gray-400)',
                      marginTop: '4px',
                    }}
                  >
                    CEO & Co-Founder, ADYK Multi Venture Company
                  </p>
                </div>
              </div>

              <a
                href="https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background-color 150ms ease, border-color 150ms ease',
                }}
              >
                <span>View LinkedIn</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Instagram Card */}
            <div
              style={{
                padding: '24px 22px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InstagramIcon size={18} />
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-gray-500)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    INSTAGRAM
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.0625rem',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    @buildby.adyk
                  </div>
                  <p
                    style={{
                      fontSize: '0.78125rem',
                      color: 'var(--color-gray-400)',
                      marginTop: '4px',
                    }}
                  >
                    Product updates & company announcements
                  </p>
                </div>
              </div>

              <a
                href="https://www.instagram.com/buildby.adyk"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background-color 150ms ease, border-color 150ms ease',
                }}
              >
                <span>Visit Instagram</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* ==================================================================
            COMPANY & FOUNDER ATTRIBUTION CARD
            ================================================================== */}
        <section
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            padding: '0 20px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              padding: 'clamp(28px, 4vw, 36px)',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.015)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={20} color="var(--color-silver-200)" />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  color: 'var(--color-silver-200)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                CORPORATE ATTRIBUTION & LAUNCH
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '4px',
                  }}
                >
                  ADYK Multi Venture Company
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', lineHeight: 1.5 }}>
                  The launching and operating parent venture behind WIQN. Building technology platforms that empower builders to make evidence-based product decisions.
                </p>
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '4px',
                  }}
                >
                  Leadership
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', lineHeight: 1.5 }}>
                  <strong style={{ color: '#ffffff' }}>REJIESH ASHWANTH</strong>
                  <br />
                  CEO & Co-Founder, ADYK Multi Venture Company
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            QUICK CTA: READY TO VALIDATE
            ================================================================== */}
        <section
          style={{
            maxWidth: '880px',
            margin: '0 auto',
            padding: '0 20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              padding: 'clamp(28px, 4vw, 40px)',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              Ready to test your product idea?
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-silver-300)',
                maxWidth: '440px',
              }}
            >
              Launch an experiment today and discover the behavioral truth with real users.
            </p>
            <Link
              href="/experiments/new"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                fontSize: '0.84375rem',
                fontWeight: 600,
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#000000',
                textDecoration: 'none',
              }}
            >
              <span>Start Validating</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
