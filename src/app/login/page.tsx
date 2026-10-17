'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setSubmitting(false);
        return;
      }

      if (data?.user) {
        // Refresh session context and route to dashboard
        router.refresh();
        router.push(redirectTarget);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during authentication.');
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

      {/* Error Notification */}
      {errorMessage && (
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
            AUTHENTICATION ERROR: {errorMessage}
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-gray-500)' }}>
              ENCRYPTED
            </span>
          </div>
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
