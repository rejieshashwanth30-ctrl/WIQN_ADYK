'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { ArrowRight, AlertCircle, CheckCircle, KeyRound, LogIn } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams?.get('email') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isExistingAccount, setIsExistingAccount] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsExistingAccount(false);

    // 1. Email format validation
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 2. Password minimum security validation
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // 3. Confirm password validation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();

      // Sign up directly with email + password (instant session flow)
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password, // Password is passed exactly as entered
        options: {
          data: {
            name: name.trim() || cleanEmail.split('@')[0],
          },
        },
      });

      if (error) {
        console.error('[WIQN AUTH] Signup failed:', error.message, 'Code:', error.code, 'Status:', error.status);
        const msg = error.message.toLowerCase();
        const code = (error.code || '').toLowerCase();
        const status = Number(error.status) || 0;

        const isExisting =
          code === 'user_already_exists' ||
          code === 'email_exists' ||
          msg.includes('already registered') ||
          msg.includes('already exists') ||
          msg.includes('user already exists') ||
          status === 422;

        if (isExisting) {
          // If the account already exists, try signing in with the provided password immediately
          const { data: autoSignInData, error: autoSignInError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

          if (!autoSignInError && autoSignInData?.session) {
            setSuccessMessage('Account recognized. Signing you into your workspace...');
            try {
              await fetch('/api/auth/sync-profile', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${autoSignInData.session.access_token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                  name: name.trim() || cleanEmail.split('@')[0],
                }),
              });
            } catch {}
            router.refresh();
            setTimeout(() => {
              router.push('/dashboard');
            }, 300);
            return;
          }

          setIsExistingAccount(true);
          setErrorMessage('An account with this email already exists.');
          setSubmitting(false);
          return;
        }

        if (
          msg.includes('rate limit') ||
          code === 'over_email_send_rate_limit' ||
          status === 429
        ) {
          setErrorMessage('Email rate limit reached. Please wait a moment or sign in to your existing account.');
        } else if (msg.includes('password') || code === 'weak_password') {
          setErrorMessage(error.message || 'Password must meet the minimum security requirements (at least 6 characters).');
        } else if (msg.includes('valid email') || msg.includes('invalid email')) {
          setErrorMessage('Please enter a valid email address.');
        } else {
          setErrorMessage(error.message || 'Unable to create your account. Please check your details and try again.');
        }

        setSubmitting(false);
        return;
      }

      // Check for Supabase anti-enumeration empty identities (which indicates user already exists when confirmation is enabled)
      const identities = data?.user?.identities;
      if (data?.user && Array.isArray(identities) && identities.length === 0) {
        // User already exists in Supabase
        const { data: autoSignInData, error: autoSignInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!autoSignInError && autoSignInData?.session) {
          setSuccessMessage('Account recognized. Signing you into your workspace...');
          try {
            await fetch('/api/auth/sync-profile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${autoSignInData.session.access_token}`,
              },
              credentials: 'include',
              body: JSON.stringify({
                name: name.trim() || cleanEmail.split('@')[0],
              }),
            });
          } catch {}
          router.refresh();
          setTimeout(() => {
            router.push('/dashboard');
          }, 300);
          return;
        }

        setIsExistingAccount(true);
        setErrorMessage('An account with this email already exists.');
        setSubmitting(false);
        return;
      }

      // Check if session was returned or immediately sign in to establish active session
      let session = data?.session;
      if (!session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!signInError && signInData?.session) {
          session = signInData.session;
        } else if (signInError) {
          console.error('[WIQN AUTH] Post-signup session establishment error:', signInError.message);
          const sMsg = signInError.message.toLowerCase();
          if (sMsg.includes('email not confirmed')) {
            setErrorMessage(
              'Account created! Please check your inbox to confirm your email, or sign in once verified.'
            );
            setSubmitting(false);
            return;
          }
        }
      }

      // Synchronize application profile into Neon PostgreSQL
      if (session?.access_token) {
        try {
          const syncRes = await fetch('/api/auth/sync-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              name: name.trim() || email.trim().split('@')[0],
            }),
          });

          if (!syncRes.ok) {
            console.warn('[WIQN AUTH] Profile sync status non-ok, retrying once:', syncRes.status);
            await new Promise((resolve) => setTimeout(resolve, 300));
            await fetch('/api/auth/sync-profile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              credentials: 'include',
              body: JSON.stringify({
                name: name.trim() || email.trim().split('@')[0],
              }),
            }).catch((err) => console.warn('[WIQN AUTH] Profile sync retry warning:', err));
          }
        } catch (syncErr: any) {
          console.warn('[WIQN AUTH] Profile sync network notice (will self-heal on dashboard):', syncErr?.message || syncErr);
        }
      }

      // Show success state and redirect directly to dashboard
      setSuccessMessage('Account created successfully. Preparing your workspace...');
      router.refresh();

      setTimeout(() => {
        router.push('/dashboard');
      }, 400);
    } catch (err: any) {
      console.error('[WIQN AUTH] Unexpected signup exception:', err?.message || err);
      const raw = (err?.message || String(err || '')).toLowerCase();
      if (raw.includes('failed to fetch') || raw.includes('networkerror') || raw.includes('fetch failed')) {
        setErrorMessage('Unable to connect to the authentication service. Please check your internet connection or try again.');
      } else {
        setErrorMessage(err?.message || 'Something went wrong while creating your account. Please try again.');
      }
      setSubmitting(false);
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
            Provision your private research workspace. Instant access.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div
            style={{
              backgroundColor: '#0c1610',
              border: '1px solid rgba(34, 197, 94, 0.45)',
              padding: '16px 18px',
              borderRadius: '2px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.08)',
            }}
          >
            <CheckCircle size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                {successMessage}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-silver-300)', marginTop: '2px' }}>
                Redirecting to your dashboard...
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: '#121215',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '16px 18px',
              borderRadius: '2px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertCircle size={16} style={{ color: '#ffffff', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff', lineHeight: 1.5 }}>
                REGISTRATION NOTICE: {errorMessage}
              </div>
            </div>

            {/* Smart 1-click action buttons when account already exists */}
            {isExistingAccount && (
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '4px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  flexWrap: 'wrap',
                }}
              >
                <Link
                  href={`/login?email=${encodeURIComponent(email.trim())}`}
                  className="btn-primary"
                  style={{
                    fontSize: '0.6875rem',
                    padding: '8px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <LogIn size={13} />
                  <span>Sign In to Existing Account</span>
                  <ArrowRight size={12} />
                </Link>

                <Link
                  href={`/auth/reset-password?email=${encodeURIComponent(email.trim())}`}
                  className="btn-secondary"
                  style={{
                    fontSize: '0.6875rem',
                    padding: '8px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <KeyRound size={13} />
                  <span>Reset Password</span>
                </Link>
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
              Full Name <span style={{ color: 'var(--color-gray-500)' }}>(Optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elena Vance"
              disabled={submitting || !!successMessage}
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
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              disabled={submitting || !!successMessage}
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
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={submitting || !!successMessage}
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
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={submitting || !!successMessage}
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
            disabled={submitting || !!successMessage}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            <span>{submitting ? 'Creating your account...' : 'Create Account'}</span>
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
          <Link
            href={`/login${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ''}`}
            style={{ color: '#ffffff', textDecoration: 'underline' }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--color-gray-500)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            LOADING...
          </div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
