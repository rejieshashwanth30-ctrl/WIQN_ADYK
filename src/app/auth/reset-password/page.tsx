'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { ArrowRight, AlertCircle, CheckCircle, KeyRound, Mail } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { getPublicAppUrl } from '@/lib/urls';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams?.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Check if the user is visiting with an established recovery session
    supabase.auth.getSession().then(({ data }: any) => {
      if (data?.session) {
        setIsRecoverySession(true);
      }
      setCheckingSession(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setIsRecoverySession(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 1. Request password reset email
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();
      const origin =
        typeof window !== 'undefined' && window.location.origin
          ? window.location.origin
          : getPublicAppUrl();

      // Ensure redirect lands safely on Wiqn application callback, NEVER Vercel
      const redirectTo = `${origin}/auth/callback?next=/auth/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) {
        // Do not leak whether the email exists
        setInfoMessage('If an account exists with this email, a password reset link has been sent.');
      } else {
        setInfoMessage('If an account exists with this email, a password reset link has been sent.');
      }
    } catch {
      setInfoMessage('If an account exists with this email, a password reset link has been sent.');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Set new password (after following recovery link)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Password must meet the minimum security requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMessage('Unable to update password. Please request a new recovery link.');
        setSubmitting(false);
        return;
      }

      // Sign out recovery session and redirect to login with success flag
      await supabase.auth.signOut();
      router.push('/login?reset=success');
    } catch {
      setErrorMessage('Unable to update password. Please request a new recovery link.');
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--color-gray-500)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
        VERIFYING SESSION...
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px', zIndex: 2 }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <Link href="/" style={{ display: 'inline-block', marginBottom: '18px' }}>
          <BrandLogo size={42} showWordmark={true} wordmarkVariant="stacked" />
        </Link>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>
          <span>FOUNDER SECURITY</span>
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
          {isRecoverySession ? 'Set New Password' : 'Reset Password'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-silver-300)', marginTop: '6px' }}>
          {isRecoverySession
            ? 'Enter your new credentials to regain access to your workspace.'
            : 'Enter your registered email to receive a secure recovery link.'}
        </p>
      </div>

      {/* Info Notification */}
      {infoMessage && (
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
          <Mail size={18} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
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
              Recovery Link Sent
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', lineHeight: 1.5 }}>
              {infoMessage}
            </div>
          </div>
        </div>
      )}

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
            SECURITY NOTICE: {errorMessage}
          </div>
        </div>
      )}

      {/* Form Container */}
      <div
        style={{
          backgroundColor: '#0a0a0d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '36px 32px',
          borderRadius: '2px',
        }}
      >
        {isRecoverySession ? (
          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>{submitting ? 'Updating...' : 'Set New Password'}</span>
              <KeyRound size={14} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                Account Email
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

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            >
              <span>{submitting ? 'Sending Link...' : 'Send Recovery Link'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '16px',
            marginTop: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--color-gray-500)',
            textAlign: 'center',
          }}
        >
          SECURE RECOVERY &bull; ENCRYPTED SESSION
        </div>
      </div>

      {/* Footer Link */}
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8125rem', color: 'var(--color-silver-300)' }}>
        Remembered your credentials?{' '}
        <Link href="/login" style={{ color: '#ffffff', textDecoration: 'underline' }}>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
      <Suspense fallback={<div style={{ color: 'var(--color-gray-500)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>INITIALIZING SECURITY CONTEXT...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
