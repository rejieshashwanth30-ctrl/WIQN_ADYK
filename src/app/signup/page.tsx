'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { ArrowRight, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { getPublicAppUrl } from '@/lib/urls';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setResendNotice(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      // Ensure confirmation link redirects directly to Wiqn public application callback
      const origin = typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : getPublicAppUrl();
      const emailRedirectTo = `${origin}/auth/callback`;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo,
          data: {
            name: name.trim(),
            organization: org.trim() || undefined,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setSubmitting(false);
        return;
      }

      if (data?.session) {
        // Active session established immediately (e.g. if email confirmation is disabled)
        router.refresh();
        router.push('/dashboard');
      } else if (data?.user) {
        // Show dedicated "Check your email" confirmation screen
        setEmailSent(true);
        setSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete registration.');
      setSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim() || resending) return;
    setResending(true);
    setResendNotice(null);

    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : getPublicAppUrl();
      const emailRedirectTo = `${origin}/auth/callback`;

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo,
        },
      });

      if (error) {
        setResendNotice({ type: 'error', text: error.message });
      } else {
        setResendNotice({
          type: 'success',
          text: 'Confirmation email resent. Please check your inbox and spam folder.',
        });
      }
    } catch (err: any) {
      setResendNotice({ type: 'error', text: err?.message || 'Failed to resend confirmation email.' });
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050505',
        color: 'var(--color-off-white)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 24px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '440px', zIndex: 2 }}>
        {emailSent ? (
          <div
            style={{
              backgroundColor: '#0a0a0d',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '36px 32px',
              borderRadius: '2px',
              textAlign: 'center',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Link href="/" style={{ display: 'inline-block' }}>
                <BrandLogo size={42} showWordmark={true} wordmarkVariant="stacked" />
              </Link>
            </div>

            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: '#ffffff',
              }}
            >
              <Mail size={22} />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.14em',
                color: 'var(--color-silver-300)',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              CONFIRMATION REQUIRED
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '12px',
                letterSpacing: '-0.01em',
              }}
            >
              Check your email
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '0.875rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.6,
                marginBottom: '16px',
              }}
            >
              We&apos;ve sent a confirmation link to your email address:
            </p>

            <div
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                color: '#ffffff',
                backgroundColor: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '8px 16px',
                borderRadius: '2px',
                marginBottom: '18px',
                wordBreak: 'break-all',
              }}
            >
              {email}
            </div>

            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '0.8125rem',
                color: 'var(--color-silver-300)',
                lineHeight: 1.6,
                marginBottom: '26px',
              }}
            >
              Confirm your email to activate your Wiqn account and access your validation workspace.
            </p>

            {resendNotice && (
              <div
                style={{
                  backgroundColor: resendNotice.type === 'success' ? '#0a120e' : '#140c0c',
                  border: `1px solid ${resendNotice.type === 'success' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 100, 100, 0.3)'}`,
                  padding: '12px 14px',
                  borderRadius: '2px',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                  textAlign: 'left',
                  lineHeight: 1.45,
                }}
              >
                {resendNotice.text}
              </div>
            )}

            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', fontFamily: 'var(--font-mono)' }}>
                Didn&apos;t receive the email?
              </div>

              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resending}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '10px 20px', width: '100%', justifyContent: 'center' }}
              >
                <span>{resending ? 'Resending email...' : 'Resend confirmation email'}</span>
              </button>
            </div>

            <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
              <Link href="/login" style={{ fontSize: '0.8125rem', color: '#ffffff', textDecoration: 'underline' }}>
                Return to Sign In &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <Link href="/" style={{ display: 'inline-block', marginBottom: '18px' }}>
                <BrandLogo size={42} showWordmark={true} wordmarkVariant="stacked" />
              </Link>
              <div className="eyebrow" style={{ justifyContent: 'center' }}>
                <span>WORKSPACE REGISTRATION</span>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-white)',
                  marginTop: '4px',
                }}
              >
                Create Founder Account
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-300)', marginTop: '6px' }}>
                Provision a private research workspace for your ventures.
              </p>
            </div>

        {errorMessage && (
          <div
            style={{
              backgroundColor: '#0c0c0e',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '16px 18px',
              borderRadius: '2px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertCircle size={16} style={{ color: '#ffffff', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff', lineHeight: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                REGISTRATION NOTICE: {errorMessage}
              </div>
            </div>

            {errorMessage.toLowerCase().includes('rate limit') && (
              <div
                style={{
                  fontSize: '0.75rem',
                  lineHeight: 1.6,
                  color: 'var(--color-silver-300)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '10px',
                  marginTop: '2px',
                }}
              >
                <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                  Why this happens & 10-Second Fix:
                </div>
                <p style={{ margin: '0 0 6px 0' }}>
                  Supabase built-in mailer limits projects to 3–4 confirmation emails/hour. To enable instant registration without rate limits:
                </p>
                <ol style={{ margin: '0 0 8px 18px', padding: 0 }}>
                  <li>Go to your <strong>Supabase Dashboard &rarr; Authentication &rarr; Providers &rarr; Email</strong></li>
                  <li>Turn <strong>Confirm email</strong> to <strong>OFF</strong>, then click <strong>Save</strong></li>
                </ol>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <a
                    href="https://supabase.com/dashboard/project/_/auth/providers"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: '#ffffff',
                      textDecoration: 'underline',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Open Supabase Providers &rarr;
                  </a>
                  <Link
                    href="/login"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: 'var(--color-silver-300)',
                      textDecoration: 'underline',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Already Registered? Sign In &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#0a0a0d',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '36px 32px',
            borderRadius: '2px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-silver-300)',
                marginBottom: '8px',
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elena Vance"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '2px',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-silver-300)',
                marginBottom: '8px',
              }}
            >
              Venture / Organization
            </label>
            <input
              type="text"
              required
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="e.g. Sovereign Labs"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '2px',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-silver-300)',
                marginBottom: '8px',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="founder@venture.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '2px',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-silver-300)',
                marginBottom: '8px',
              }}
            >
              Master Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#121215',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '2px',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            <span>{submitting ? 'Provisioning...' : 'Create Workspace'}</span>
            <ArrowRight size={14} />
          </button>

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--color-gray-500)',
              textAlign: 'center',
            }}
          >
            SUPABASE IDENTITY &bull; NEON APPLICATION DATA
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8125rem', color: 'var(--color-silver-300)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#ffffff', textDecoration: 'underline' }}>
            Sign In
          </Link>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
