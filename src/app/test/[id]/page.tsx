'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import {
  ExternalLink,
  MessageSquare,
  Star,
  Check,
  AlertCircle,
  Clock,
  ShieldCheck,
  X,
  Maximize2
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PublicTestingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const experimentId = resolvedParams.id;

  const [experiment, setExperiment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Feedback form state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState<number>(4);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('usability');
  const [confusing, setConfusing] = useState('');
  const [improve, setImprove] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Iframe embedding detection
  const [showEmbedFallback, setShowEmbedFallback] = useState(false);

  // Visitor & Session IDs
  const [visitorId, setVisitorId] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const startTimeRef = useRef<number>(Date.now());

  // Initialize tracking IDs
  useEffect(() => {
    let vid = '';
    let sid = '';
    try {
      vid = localStorage.getItem('__wiqn_vid') || '';
      if (!vid) {
        vid = 'v_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
        localStorage.setItem('__wiqn_vid', vid);
      }

      sid = sessionStorage.getItem('__wiqn_sid') || '';
      if (!sid) {
        sid = 's_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
        sessionStorage.setItem('__wiqn_sid', sid);
      }
    } catch {
      vid = 'v_' + Math.random().toString(36).substring(2, 12);
      sid = 's_' + Math.random().toString(36).substring(2, 12);
    }

    setVisitorId(vid);
    setSessionId(sid);
  }, []);

  // Fetch experiment data
  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        setErrorStatus(null);
        const res = await fetch(`/api/test/${experimentId}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          if (res.status === 403) {
            setErrorStatus(errData.error || 'This test session has concluded or is paused.');
          } else {
            setErrorStatus('Experiment not found.');
          }
          setLoading(false);
          return;
        }

        const json = await res.json();
        setExperiment(json.data);
      } catch (err) {
        console.error('Error fetching test:', err);
        setErrorStatus('Network error connecting to test session.');
      } finally {
        setLoading(false);
      }
    }

    loadTest();
  }, [experimentId]);

  // Telemetry: Log page view and session duration pulses
  useEffect(() => {
    if (!experiment || !visitorId || !sessionId) return;

    startTimeRef.current = Date.now();

    // 1. Send initial PAGE_VIEW beacon
    const endpoint = '/api/capture';
    const sendBeaconEvent = (eventType: string, payload?: any) => {
      const data = {
        experimentId: experiment.id,
        visitorId,
        sessionId,
        eventType,
        page: `/test/${experiment.id}`,
        timestamp: new Date().toISOString(),
        device: {
          width: typeof window !== 'undefined' ? window.innerWidth : 1280,
          height: typeof window !== 'undefined' ? window.innerHeight : 800,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        },
        ...payload,
      };

      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(endpoint, blob);
      } else {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true,
        }).catch(() => {});
      }
    };

    sendBeaconEvent('PAGE_VIEW', { title: `Test: ${experiment.name}` });

    // 2. Pulse heartbeats for session duration
    const pulseTimeouts = [15, 30, 60, 120].map((sec) =>
      setTimeout(() => {
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        sendBeaconEvent('TIME_ON_PAGE', { durationSeconds: elapsed });
      }, sec * 1000)
    );

    // 3. Page unload handler
    const handleUnload = () => {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      sendBeaconEvent('TIME_ON_PAGE', { durationSeconds: elapsed });
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      pulseTimeouts.forEach(clearTimeout);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [experiment, visitorId, sessionId]);

  // Handle Feedback Submission
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experiment) return;

    setSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/test/${experiment.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          sessionId,
          rating,
          category,
          confusing: confusing.trim(),
          improve: improve.trim(),
          device: {
            width: typeof window !== 'undefined' ? window.innerWidth : 1280,
          },
        }),
      });

      if (res.ok) {
        setFeedbackSuccess(true);
        setTimeout(() => {
          setShowFeedbackModal(false);
          setFeedbackSuccess(false);
          setConfusing('');
          setImprove('');
        }, 2200);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit feedback.');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Unable to submit feedback. Please check your network connection.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-silver-300)', letterSpacing: '0.1em' }}>
          INITIALIZING PROTOTYPE TEST ENVIRONMENT...
        </div>
      </div>
    );
  }

  if (errorStatus || !experiment) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '500px', textAlign: 'center' }}>
          <BrandLogo size={32} showWordmark={true} />
          <div style={{ height: '32px' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>
            {errorStatus?.includes('concluded') ? 'Test Session Concluded' : 'Test Unavailable'}
          </h1>
          <p style={{ color: 'var(--color-silver-300)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '28px' }}>
            {errorStatus || 'This experiment is currently unavailable or has been concluded by the founder.'}
          </p>
          <Link href="/" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '10px 18px' }}>
            Return to Wiqn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#050505', color: 'var(--color-off-white)', overflow: 'hidden' }}>
      {/* Sleek Top Testing Bar */}
      <header
        style={{
          height: '56px',
          backgroundColor: '#0a0a0d',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          zIndex: 40,
        }}
      >
        {/* Left: Brand and Test Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', letterSpacing: '0.04em' }}>
              WIQN TEST
            </span>
          </div>

          <span style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>/</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-white)' }}>
              {experiment.productName}
            </span>
            <span className="badge" style={{ fontSize: '0.5625rem', padding: '2px 6px' }}>
              PROTOTYPE
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowEmbedFallback(!showEmbedFallback)}
            className="btn-ghost"
            style={{ fontSize: '0.6875rem', padding: '6px 10px', color: 'var(--color-silver-300)' }}
            title="Display instructions if the prototype cannot be loaded inside an embedded frame"
          >
            {showEmbedFallback ? 'Hide Help' : 'Embedding Help'}
          </button>

          <a
            href={experiment.prototypeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '0.6875rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Open in New Tab</span>
            <ExternalLink size={12} />
          </a>

          <button
            onClick={() => setShowFeedbackModal(true)}
            className="btn-primary"
            style={{ fontSize: '0.6875rem', padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <MessageSquare size={13} />
            <span>Give Feedback</span>
          </button>
        </div>
      </header>

      {/* Embedding Help Banner (if external site has X-Frame-Options or frame-ancestors block) */}
      {showEmbedFallback && (
        <div
          style={{
            backgroundColor: '#121216',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8125rem',
            color: 'var(--color-silver-200)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={16} style={{ color: '#ffffff', flexShrink: 0 }} />
            <span>
              If this prototype appears blank, its hosting server may restrict iframe embedding for security. You can open it in a direct tab, test it, and submit your feedback right here.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href={experiment.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.6875rem', padding: '5px 12px' }}
            >
              Open Direct Window
            </a>
            <button
              onClick={() => setShowEmbedFallback(false)}
              className="btn-ghost"
              style={{ padding: '5px 8px' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Prototype Viewport */}
      <main style={{ flex: 1, position: 'relative', width: '100%', height: 'calc(100vh - 56px)', backgroundColor: '#ffffff' }}>
        <iframe
          src={experiment.prototypeUrl}
          title={`Wiqn Validation: ${experiment.name}`}
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
        />
      </main>

      {/* Feedback Modal / Slide-Over */}
      {showFeedbackModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#0a0a0d',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '3px',
              padding: '32px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowFeedbackModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--color-silver-300)',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            {feedbackSuccess ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Check size={24} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
                  Thank You for Testing!
                </h3>
                <p style={{ color: 'var(--color-silver-300)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  Your feedback has been saved and will help the creator make better decisions.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: '6px' }}>
                    <span className="eyebrow-dot" />
                    <span>TESTER FEEDBACK</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                    How was your experience?
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', marginTop: '4px' }}>
                    Your thoughts directly guide the development of this prototype.
                  </p>
                </div>

                {/* 1-5 Star Rating */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    OVERALL RATING
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isFilled = (hoverRating !== null ? hoverRating : rating) >= val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setRating(val)}
                          onMouseEnter={() => setHoverRating(val)}
                          onMouseLeave={() => setHoverRating(null)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: isFilled ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                            transition: 'color 120ms ease',
                          }}
                        >
                          <Star size={24} fill={isFilled ? '#ffffff' : 'none'} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    PRIMARY FEEDBACK TOPIC
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#121215',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      borderRadius: '2px',
                      fontSize: '0.8125rem',
                      outline: 'none',
                    }}
                  >
                    <option value="usability">Usability (Navigation, Flow, Layout)</option>
                    <option value="clarity">Clarity (Copy, Understanding, Purpose)</option>
                    <option value="value">Usefulness / Value Proposition</option>
                    <option value="suggestion">Feature Suggestion</option>
                    <option value="bug">Friction Point or Bug Report</option>
                  </select>
                </div>

                {/* What was confusing? */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    WHAT WAS CONFUSING OR DIFFICULT?
                  </label>
                  <textarea
                    rows={2}
                    value={confusing}
                    onChange={(e) => setConfusing(e.target.value)}
                    placeholder="e.g. I wasn't sure where to click after signing up..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#121215',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      borderRadius: '2px',
                      fontSize: '0.8125rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* What would you improve? */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-silver-300)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    WHAT WOULD YOU IMPROVE?
                  </label>
                  <textarea
                    rows={2}
                    value={improve}
                    onChange={(e) => setImprove(e.target.value)}
                    placeholder="e.g. Add a clear confirmation message after completing payment..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#121215',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      borderRadius: '2px',
                      fontSize: '0.8125rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="btn-primary"
                    style={{ flex: 1, padding: '10px', fontSize: '0.75rem' }}
                  >
                    {submittingFeedback ? 'Sending...' : 'Submit Feedback'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="btn-secondary"
                    style={{ padding: '10px 16px', fontSize: '0.75rem' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
