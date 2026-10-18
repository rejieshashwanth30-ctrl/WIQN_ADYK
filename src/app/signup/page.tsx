'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 2. Password minimum security validation
    if (!password || password.length < 6) {
      setErrorMessage('Password must meet the minimum security requirements.');
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

      // Sign up directly with email + password (no confirmation email flow)
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim() || email.trim().split('@')[0],
          },
        },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (
          msg.includes('already registered') ||
          msg.includes('already exists') ||
          msg.includes('user already exists') ||
          error.status === 422
        ) {
          setErrorMessage('An account with this email already exists. Please log in.');
        } else if (msg.includes('password')) {
          setErrorMessage('Password must meet the minimum security requirements.');
        } else if (msg.includes('valid email') || msg.includes('invalid email')) {
          setErrorMessage('Please enter a valid email address.');
        } else {
          setErrorMessage('Unable to create account. Please check your details and try again.');
        }
        setSubmitting(false);
        return;
      }

      // Check if session was returned or immediately sign in to establish active session
      let session = data?.session;
      if (!session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (!signInError && signInData?.session) {
          session = signInData.session;
        } else if (signInError) {
          const sMsg = signInError.message.toLowerCase();
          if (sMsg.includes('email not confirmed')) {
            setErrorMessage(
              "Account created, but email confirmation is active in your Supabase project. Disable 'Confirm Email' in Supabase Authentication settings to enable instant registration."
            );
            setSubmitting(false);
            return;
          }
        }
      }

      // Show success state and route directly to dashboard
      setSuccessMessage('Account created successfully.');
      router.refresh();

      setTimeout(() => {
        router.push('/dashboard');
      }, 400);
    } catch {
      setErrorMessage('An unexpected error occurred during account creation.');
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
              REGISTRATION NOTICE: {errorMessage}
            </div>
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
          <Link href="/login" style={{ color: '#ffffff', textDecoration: 'underline' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
