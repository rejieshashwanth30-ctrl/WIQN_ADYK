'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get('redirect') || '/dashboard';
  const isResetSuccess = searchParams?.get('reset') === 'success';
  const isVerified = searchParams?.get('verified') === 'true';
  const rawError = searchParams?.get('error');

  const initialError = rawError
    ? rawError === 'auth_exchange_failed'
      ? 'The authentication link has expired or is invalid. Please sign in.'
      : 'Email or password is incorrect.'
    : null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side empty field validation
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('[WIQN AUTH] Login failed:', error.message, 'Code:', error.code, 'Status:', error.status);
        const msg = error.message.toLowerCase();

        if (
          msg.includes('invalid login credentials') ||
          msg.includes('invalid credentials') ||
          error.code === 'invalid_credentials'
        ) {
          setErrorMessage('Email or password is incorrect. Please check your credentials.');
        } else if (msg.includes('email not confirmed')) {
          setErrorMessage(
            "Email confirmation is active in your Supabase project. Disable 'Confirm Email' in Supabase Authentication settings to enable instant login."
          );
        } else if (msg.includes('rate limit') || error.status === 429) {
          setErrorMessage('Too many sign-in attempts. Please wait a moment and try again.');
        } else {
          setErrorMessage('Unable to sign in. Please check your credentials and try again.');
        }
        setSubmitting(false);
        return;
      }

      if (data?.session) {
        // Synchronize authenticated profile with Neon application data
        try {
          await fetch('/api/auth/sync-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.session.access_token}`,
            },
            credentials: 'include',
            body: JSON.stringify({}),
          });
        } catch (syncErr) {
          console.warn('[WIQN AUTH] Post-login profile sync warning:', syncErr);
        }

        router.refresh();
        router.push(redirectTarget);
      } else {
        router.refresh();
        router.push(redirectTarget);
      }
    } catch (err: any) {
      console.error('[WIQN AUTH] Unexpected login error:', err?.message || err);
      setErrorMessage('Unable to sign in right now. Please check your internet connection.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', zIndex: 2 }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <Link href="/" style={{ display: 'inline-block', marginBottom: '18px' }}>
          <BrandLogo size={42} showWordmark={true} wordmarkVariant="stacked" />
        </Link>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>
          <span>FOUNDER ACCESS</span>
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
          Sign In to Wiqn
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-300)', marginTop: '6px' }}>
          Enter your credentials to access your validation registry.
        </p>
      </div>

      {/* Password Reset Success Notification */}
      {isResetSuccess && (
        <div
          style={{
            backgroundColor: '#0c1610',
            border: '1px solid rgba(34, 197, 94, 0.45)',
            padding: '16px 18px',
            borderRadius: '2px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.08)',
          }}
        >
          <CheckCircle size={18} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '4px',
              }}
            >
              Password updated successfully.
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', lineHeight: 1.5 }}>
              Your new password is now active. Please sign in to continue.
            </div>
          </div>
        </div>
      )}

      {/* Verification Notice (if user arrived from legacy callback) */}
      {isVerified && !isResetSuccess && (
        <div
          style={{
            backgroundColor: '#0c1610',
            border: '1px solid rgba(34, 197, 94, 0.45)',
            padding: '16px 18px',
            borderRadius: '2px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <CheckCircle size={18} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '4px',
              }}
            >
              Email verified successfully.
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', lineHeight: 1.5 }}>
              Your Wiqn account is ready. Sign in to continue.
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && !isResetSuccess && !isVerified && (
        <div
          style={{
            backgroundColor: '#121215',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '14px 16px',
            borderRadius: '2px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <AlertCircle size={16} style={{ color: '#ffffff', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff', lineHeight: 1.5 }}>
            AUTHENTICATION NOTICE: {errorMessage}
          </div>
        </div>
      )}

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#0a0a0d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '36px 32px',
          borderRadius: '2px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
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
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="founder@venture.com"
            disabled={submitting}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-silver-300)',
              }}
            >
              Password
            </label>
            <Link
              href="/auth/reset-password"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--color-silver-300)',
                textDecoration: 'none',
              }}
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            disabled={submitting}
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
          <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
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
          SUPABASE AUTH &bull; HTTP-ONLY SECURE SESSIONS
        </div>
      </form>

      {/* Footer Link */}
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8125rem', color: 'var(--color-silver-300)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" style={{ color: '#ffffff', textDecoration: 'underline' }}>
          Create Workspace
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
      <Suspense fallback={<div style={{ color: 'var(--color-gray-500)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>INITIALIZING FOUNDER ACCESS...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
