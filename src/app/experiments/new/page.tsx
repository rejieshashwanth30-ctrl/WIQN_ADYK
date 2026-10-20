'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardNav } from '@/components/DashboardNav';
import { saveStoredExperiment } from '@/lib/storage';
import { Experiment, TestingMode, ExperimentStatus } from '@/lib/types';
import { ArrowRight, ArrowLeft, Check, Layers, Target, Link as LinkIcon, ShieldCheck, Globe, AlertCircle, LogIn } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { authenticatedFetch } from '@/lib/api-client';

export default function NewExperimentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [name, setName] = useState('');
  const [productName, setProductName] = useState('');
  const [problem, setProblem] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  const [productIdea, setProductIdea] = useState('');
  const [keyHypothesis, setKeyHypothesis] = useState('');
  const [learningGoal, setLearningGoal] = useState('');

  const [prototypeUrl, setPrototypeUrl] = useState('');
  const [testingMode, setTestingMode] = useState<TestingMode>('PRIVATE');
  const [status, setStatus] = useState<ExperimentStatus>('ACTIVE');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 1. Check session & restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wiqn_experiment_draft');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.name) setName(d.name);
        if (d.productName) setProductName(d.productName);
        if (d.problem) setProblem(d.problem);
        if (d.targetAudience) setTargetAudience(d.targetAudience);
        if (d.productIdea) setProductIdea(d.productIdea);
        if (d.keyHypothesis) setKeyHypothesis(d.keyHypothesis);
        if (d.learningGoal) setLearningGoal(d.learningGoal);
        if (d.prototypeUrl) setPrototypeUrl(d.prototypeUrl);
        if (d.testingMode) setTestingMode(d.testingMode);
      }
    } catch {}

    const supabase = createClient();
    supabase.auth.getSession().then(({ data }: any) => {
      setIsAuthenticated(!!data?.session);
    });
  }, []);

  // Save draft whenever fields change
  const saveDraft = () => {
    try {
      localStorage.setItem(
        'wiqn_experiment_draft',
        JSON.stringify({
          name,
          productName,
          problem,
          targetAudience,
          productIdea,
          keyHypothesis,
          learningGoal,
          prototypeUrl,
          testingMode,
        })
      );
    } catch {}
  };

  const handleNext = () => {
    setError(null);
    saveDraft();

    if (currentStep === 1) {
      if (!name.trim() || !productName.trim()) {
        setError('Please specify both the experiment name and product name.');
        return;
      }
    } else if (currentStep === 2) {
      if (!keyHypothesis.trim() || !learningGoal.trim()) {
        setError('Please define your key hypothesis and learning goal.');
        return;
      }
    } else if (currentStep === 3) {
      if (!prototypeUrl.trim()) {
        setError('Please provide your live prototype URL.');
        return;
      }
      try {
        const u = new URL(prototypeUrl.trim());
        if (u.protocol !== 'http:' && u.protocol !== 'https:') {
          setError('Prototype URL must start with http:// or https://');
          return;
        }
      } catch {
        setError('Please enter a valid website URL (e.g. https://myprototype.vercel.app)');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleLaunch = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    saveDraft();

    try {
      const res = await authenticatedFetch('/api/experiments', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          productName: productName.trim(),
          problem: problem.trim(),
          targetAudience: targetAudience.trim(),
          productIdea: productIdea.trim(),
          keyHypothesis: keyHypothesis.trim(),
          learningGoal: learningGoal.trim(),
          prototypeUrl: prototypeUrl.trim(),
          testingMode,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to initialize experiment in registry');
        setSubmitting(false);
        return;
      }

      const json = await res.json();
      const experimentId = json.experiment?.id || json.data?.id;

      if (!experimentId) {
        setError('Experiment registered, but identifier missing from response.');
        setSubmitting(false);
        return;
      }

      try {
        localStorage.removeItem('wiqn_experiment_draft');
      } catch {}

      router.push(`/experiments/${experimentId}`);
    } catch (err: any) {
      setError(err?.message || 'Network error communicating with server');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'var(--color-off-white)' }}>
      <DashboardNav />

      <main className="dash-main-container" style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* Step Indicator Header */}
        <div style={{ marginBottom: '32px' }}>
          <div className="eyebrow dash-eyebrow">
            <span className="eyebrow-dot" />
            <span>NEW EXPERIMENT SETUP</span>
          </div>

          <h1 className="dash-title" style={{ marginBottom: '20px' }}>
            Create Product Experiment
          </h1>

          {/* Stepper Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '20px',
            }}
          >
            {[
              { num: 1, label: 'BASICS' },
              { num: 2, label: 'YOUR IDEA' },
              { num: 3, label: 'PROTOTYPE' },
              { num: 4, label: 'REVIEW' },
            ].map((s) => (
              <div key={s.num} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div
                  style={{
                    height: '2px',
                    backgroundColor: currentStep >= s.num ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                    transition: 'background-color 300ms ease',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.12em',
                    color: currentStep === s.num ? '#ffffff' : currentStep > s.num ? 'var(--color-silver-300)' : 'var(--color-gray-500)',
                  }}
                >
                  0{s.num} // {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div
            style={{
              padding: '14px 20px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '2px',
              marginBottom: '28px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, color: '#ef4444' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <div
          style={{
            backgroundColor: '#0a0a0d',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: 'clamp(20px, 4vw, 40px)',
            borderRadius: '2px',
            marginBottom: '36px',
            boxSizing: 'border-box',
          }}
        >
          {/* STEP 1: Foundation */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 600, color: 'var(--color-white)', marginBottom: '8px' }}>
                  Product Foundation
                </h2>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
                  Name your experiment and identify the specific product and target audience.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                  Experiment Title *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Non-Custodial Direct Settlement Friction"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: '#121215',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '2px',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                  Product / Venture Name *
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. SovereignPay"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: '#121215',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '2px',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                  Problem Being Addressed
                </label>
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="What friction, cost, or failure mode are users currently experiencing?"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: '#121215',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '2px',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Early-stage FinTech developers deploying non-custodial billing"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: '#121215',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '2px',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Validation Thesis */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 600, color: 'var(--color-white)', marginBottom: '8px' }}>
                  Your Idea to Test
                </h2>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
                  State the core assumption you want to test before investing significant time or engineering resources.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                  Product Idea / Core Mechanism
                </label>
                <textarea
                  value={productIdea}
                  onChange={(e) => setProductIdea(e.target.value)}
                  placeholder="Describe the solution or interface mechanism you are presenting to users..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: '#121215',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '2px',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                  Your Idea to Test * (The assumption you want to check)
                </label>
                <textarea
                  value={keyHypothesis}
                  onChange={(e) => setKeyHypothesis(e.target.value)}
                  placeholder="e.g. Visitors will click our primary CTA because they want direct settlement without extra redirects."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: '#121215',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '2px',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                  What do you specifically want to learn? *
                </label>
                <input
                  type="text"
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  placeholder="e.g. Determine whether developers drop off due to wallet signing or gas estimation."
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: '#121215',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '2px',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Prototype Connection & Testing Mode */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 600, color: 'var(--color-white)', marginBottom: '8px' }}>
                  Prototype Connection & Testing Mode
                </h2>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
                  Provide your live deployed prototype URL and configure distribution channels.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                  Prototype URL * (Vercel, Netlify, Cloudflare, or any HTTPS origin)
                </label>
                <input
                  type="url"
                  value={prototypeUrl}
                  onChange={(e) => setPrototypeUrl(e.target.value)}
                  placeholder="https://your-prototype.vercel.app"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: '#121215',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '2px',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Testing Mode Selector */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-silver-300)', marginBottom: '12px' }}>
                  Distribution Channel *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  <div
                    onClick={() => setTestingMode('PRIVATE')}
                    style={{
                      padding: '24px',
                      backgroundColor: testingMode === 'PRIVATE' ? 'rgba(255, 255, 255, 0.08)' : '#121215',
                      border: testingMode === 'PRIVATE' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <ShieldCheck size={18} style={{ color: '#ffffff' }} />
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#ffffff' }}>Private Testing</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', lineHeight: 1.5 }}>
                      Accessible exclusively through your private link. Zero community syndication.
                    </p>
                  </div>

                  <div
                    onClick={() => setTestingMode('CARDEX_ALPHA')}
                    style={{
                      padding: '24px',
                      backgroundColor: testingMode === 'CARDEX_ALPHA' ? 'rgba(255, 255, 255, 0.08)' : '#121215',
                      border: testingMode === 'CARDEX_ALPHA' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Globe size={18} style={{ color: '#ffffff' }} />
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#ffffff' }}>CARDEX Alpha</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-silver-300)', lineHeight: 1.5 }}>
                      Opt-in to ADYK builder pool. Genuine technical testers explore your prototype.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-silver-300)', marginBottom: '8px' }}>
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ExperimentStatus)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: '#121215',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '2px',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                >
                  <option value="ACTIVE">ACTIVE (Ready for live traffic)</option>
                  <option value="DRAFT">DRAFT (Specification only)</option>
                  <option value="PAUSED">PAUSED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Launch */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 600, color: 'var(--color-white)', marginBottom: '8px' }}>
                  Review &amp; Launch Specification
                </h2>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', color: 'var(--color-silver-300)' }}>
                  Confirm your experiment parameters. The research workspace and telemetry receiver will be initialized immediately.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#121215',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                }}
              >
                <div>
                  <span style={{ color: 'var(--color-gray-500)' }}>EXPERIMENT: </span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{name}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-gray-500)' }}>PRODUCT: </span>
                  <span style={{ color: '#ffffff' }}>{productName}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-gray-500)' }}>YOUR IDEA TO TEST: </span>
                  <span style={{ color: 'var(--color-silver-200)' }}>{keyHypothesis}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-gray-500)' }}>LEARNING GOAL: </span>
                  <span style={{ color: 'var(--color-silver-200)' }}>{learningGoal}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-gray-500)' }}>PROTOTYPE: </span>
                  <span style={{ color: '#ffffff' }}>{prototypeUrl}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div>
                    <span style={{ color: 'var(--color-gray-500)' }}>MODE: </span>
                    <span style={{ color: '#ffffff' }}>{testingMode}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-gray-500)' }}>STATUS: </span>
                    <span style={{ color: '#ffffff' }}>{status}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleLaunch}
              disabled={submitting}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              <Check size={16} />
              <span>{submitting ? 'Creating Experiment...' : 'Start Experiment'}</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
