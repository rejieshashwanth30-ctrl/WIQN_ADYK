'use client';

import React from 'react';
import { Phone, Mail, ArrowUpRight } from 'lucide-react';

const LinkedInIcon = ({ size = 14 }: { size?: number }) => (
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

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
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

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      style={{
        padding: 'clamp(72px, 11vh, 128px) 20px',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div className="eyebrow-light">
              <span className="eyebrow-dot-light" />
              <span>08 // CONTACT</span>
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
              marginBottom: '14px',
            }}
          >
            Let&apos;s Talk.
          </h2>

          <p
            style={{
              fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
              color: '#52525b',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            Questions, feedback, partnerships, or experimentation inquiries? Connect directly with the ADYK leadership team.
          </p>
        </div>

        {/* Company & Leadership Directory Card */}
        <div
          className="editorial-card"
          style={{
            marginBottom: '20px',
            padding: 'clamp(22px, 3.5vw, 32px)',
            backgroundColor: '#fafafa',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              paddingBottom: '16px',
              marginBottom: '18px',
              borderBottom: '1px solid #e4e4e7',
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.14em',
                  color: '#71717a',
                  textTransform: 'uppercase',
                }}
              >
                COMPANY LEADERSHIP
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#09090b',
                  marginTop: '2px',
                }}
              >
                ADYK Multi Venture Company
              </h3>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Dineshraj S */}
            <div
              style={{
                padding: '20px',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: '#09090b',
                    marginBottom: '4px',
                  }}
                >
                  Dineshraj S
                </h4>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.71875rem',
                    color: '#52525b',
                    letterSpacing: '0.04em',
                  }}
                >
                  Founder — ADYK Multi Venture Company
                </div>
              </div>

              <a
                href="https://www.linkedin.com/in/dineshraj-s-758931390"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '3px',
                  backgroundColor: '#f4f4f5',
                  border: '1px solid #e4e4e7',
                  color: '#09090b',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                }}
                aria-label="View LinkedIn profile of Dineshraj S"
              >
                <LinkedInIcon size={13} />
                <span>LinkedIn</span>
                <ArrowUpRight size={11} />
              </a>
            </div>

            {/* Rejiesh Ashwanth V */}
            <div
              style={{
                padding: '20px',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: '#09090b',
                    marginBottom: '4px',
                  }}
                >
                  Rejiesh Ashwanth V
                </h4>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.71875rem',
                    color: '#52525b',
                    letterSpacing: '0.04em',
                  }}
                >
                  CEO &amp; Co-Founder — ADYK Multi Venture Company
                </div>
              </div>

              <a
                href="https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '3px',
                  backgroundColor: '#f4f4f5',
                  border: '1px solid #e4e4e7',
                  color: '#09090b',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                }}
                aria-label="View LinkedIn profile of Rejiesh Ashwanth V"
              >
                <LinkedInIcon size={13} />
                <span>LinkedIn</span>
                <ArrowUpRight size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* 3 Channels: Phone, Email, Instagram */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
          }}
        >
          {/* Phone */}
          <div
            className="editorial-card"
            style={{
              padding: '22px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              backgroundColor: '#ffffff',
            }}
          >
            <div>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: '#f4f4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  color: '#09090b',
                }}
              >
                <Phone size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase' }}>
                PHONE
              </span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 700, color: '#09090b' }}>
                8870605699
              </div>
              <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '2px', margin: 0 }}>
                Direct inquiry &amp; support
              </p>
            </div>
            <a
              href="tel:8870605699"
              className="btn-secondary-light"
              style={{ padding: '8px 14px', fontSize: '0.75rem' }}
            >
              <span>Call Us</span>
              <ArrowUpRight size={12} />
            </a>
          </div>

          {/* Email */}
          <div
            className="editorial-card"
            style={{
              padding: '22px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              backgroundColor: '#ffffff',
            }}
          >
            <div>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: '#f4f4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  color: '#09090b',
                }}
              >
                <Mail size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase' }}>
                EMAIL
              </span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84375rem', fontWeight: 600, color: '#09090b', wordBreak: 'break-all' }}>
                adykcompany.in@gmail.com
              </div>
              <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '2px', margin: 0 }}>
                Official correspondence
              </p>
            </div>
            <a
              href="mailto:adykcompany.in@gmail.com"
              className="btn-secondary-light"
              style={{ padding: '8px 14px', fontSize: '0.75rem' }}
            >
              <span>Email Us</span>
              <ArrowUpRight size={12} />
            </a>
          </div>

          {/* Instagram */}
          <div
            className="editorial-card"
            style={{
              padding: '22px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              backgroundColor: '#ffffff',
            }}
          >
            <div>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: '#f4f4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  color: '#09090b',
                }}
              >
                <InstagramIcon size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#71717a', textTransform: 'uppercase' }}>
                INSTAGRAM
              </span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 700, color: '#09090b' }}>
                @buildby.adyk
              </div>
              <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '2px', margin: 0 }}>
                Updates &amp; announcements
              </p>
            </div>
            <a
              href="https://www.instagram.com/buildby.adyk"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-light"
              style={{ padding: '8px 14px', fontSize: '0.75rem' }}
            >
              <span>Visit Instagram</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
