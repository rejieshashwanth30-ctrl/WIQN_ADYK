/**
 * ADYK WIQN AUTOCAPTURE SCRIPT v1.0
 * Zero-configuration client-side evidence capture layer.
 * 
 * Usage:
 * <script 
 *   src="https://[WIQN-VERCEL-PROJECT].vercel.app/tracker.js" 
 *   data-experiment="YOUR_EXPERIMENT_ID" 
 *   data-endpoint="/api/capture"
 *   async>
 * </script>
 */

(function () {
  'use strict';

  // Read configuration from script tag and URL query parameters
  const scriptTag = document.currentScript || document.querySelector('script[data-experiment]');
  let urlParams = null;
  try {
    urlParams = new URLSearchParams(window.location.search);
  } catch (e) {}

  const experimentId = (urlParams && (urlParams.get('wiqn_exp') || urlParams.get('wiqn_experiment') || urlParams.get('experimentId'))) ||
    (scriptTag ? scriptTag.getAttribute('data-experiment') : null) || 'default';

  const prototypeId = (urlParams && urlParams.get('wiqn_proto')) ||
    (scriptTag ? scriptTag.getAttribute('data-prototype') : 'v1');

  const endpoint = scriptTag ? (scriptTag.getAttribute('data-endpoint') || '/api/capture') : '/api/capture';

  // Persistent anonymous visitor ID (inherited from URL or localStorage)
  function getVisitorId() {
    const fromUrl = urlParams && (urlParams.get('wiqn_vid') || urlParams.get('visitorId'));
    if (fromUrl) {
      try { localStorage.setItem('__wiqn_vid', fromUrl); } catch (e) {}
      return fromUrl;
    }
    let vid = localStorage.getItem('__wiqn_vid');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      try {
        localStorage.setItem('__wiqn_vid', vid);
      } catch (e) {}
    }
    return vid;
  }

  // Session ID (inherited from URL or sessionStorage)
  function getSessionId() {
    const fromUrl = urlParams && (urlParams.get('wiqn_sid') || urlParams.get('sessionId'));
    if (fromUrl) {
      try { sessionStorage.setItem('__wiqn_sid', fromUrl); } catch (e) {}
      return fromUrl;
    }
    let sid = sessionStorage.getItem('__wiqn_sid');
    if (!sid) {
      sid = 's_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      try {
        sessionStorage.setItem('__wiqn_sid', sid);
      } catch (e) {}
    }
    return sid;
  }

  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  // Strict privacy and sensitive data filters
  const SENSITIVE_REGEX = /password|passwd|pass|pin|cvv|cvc|card|credit|pan|ssn|social|secret|token|auth|bearer|private|key/i;

  function isSensitive(el) {
    if (!el) return false;
    const type = (el.getAttribute('type') || '').toLowerCase();
    if (type === 'password' || type === 'hidden') return true;

    const name = el.getAttribute('name') || '';
    const id = el.id || '';
    const autocomplete = el.getAttribute('autocomplete') || '';
    const ariaLabel = el.getAttribute('aria-label') || '';
    const placeholder = el.getAttribute('placeholder') || '';
    const dataPrivate = el.hasAttribute('data-private') || el.hasAttribute('data-wiqn-ignore');

    if (dataPrivate) return true;
    if (SENSITIVE_REGEX.test(name) || SENSITIVE_REGEX.test(id) || SENSITIVE_REGEX.test(autocomplete)) return true;
    if (SENSITIVE_REGEX.test(ariaLabel) || SENSITIVE_REGEX.test(placeholder)) return true;
    return false;
  }

  // Sanitize URLs to remove tokens or keys in query parameters
  function sanitizeUrl(rawUrl) {
    if (!rawUrl) return null;
    try {
      const u = new URL(rawUrl, window.location.origin);
      const keysToDrop = [];
      u.searchParams.forEach(function (_, key) {
        if (SENSITIVE_REGEX.test(key)) {
          keysToDrop.push(key);
        }
      });
      keysToDrop.forEach(function (k) {
        u.searchParams.set(k, '[REDACTED]');
      });
      return u.pathname + u.search;
    } catch (e) {
      return rawUrl.substring(0, 150);
    }
  }

  // Helper to extract clean element description WITHOUT sensitive field values
  function describeElement(el) {
    if (!el || el === document.body) return null;
    const tag = el.tagName.toLowerCase();
    
    // Privacy safeguard: If element is sensitive, redact completely
    if (isSensitive(el)) {
      return {
        selector: tag + (el.id ? '#' + el.id : ''),
        text: '[REDACTED]',
        tag: tag,
      };
    }

    // 1. Preferred stable identifier: data-wiqn-id, data-testid, or data-id
    const wiqnId = el.getAttribute('data-wiqn-id') || el.getAttribute('data-testid') || el.getAttribute('data-id');
    const id = el.id ? '#' + el.id : '';
    
    // Clean identifier (do NOT rely primarily on random hash CSS classes)
    let selector = tag;
    if (wiqnId) {
      selector = `${tag}[data-wiqn-id="${wiqnId}"]`;
    } else if (id) {
      selector = `${tag}${id}`;
    } else {
      const role = el.getAttribute('role');
      selector = role ? `${tag}[role="${role}"]` : tag;
    }

    // Accessible label priority
    const ariaLabel = (el.getAttribute('aria-label') || el.getAttribute('title') || '').trim();

    // Never capture user input values from inputs or textareas
    let text = '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      text = ariaLabel || (el.getAttribute('placeholder') || el.name || '').trim();
    } else {
      text = (el.innerText || el.textContent || '').trim();
      if (!text && ariaLabel) {
        text = ariaLabel;
      }
    }

    // If still no text, use wiqnId or title or placeholder
    if (!text && wiqnId) {
      text = wiqnId.replace(/[-_]/g, ' ');
    }

    // Privacy check on extracted text
    if (SENSITIVE_REGEX.test(text) && text.length > 20) {
      text = '[REDACTED]';
    } else {
      text = text.substring(0, 80);
    }

    return {
      selector: selector,
      text: text || undefined,
      tag: tag,
      wiqnId: wiqnId || undefined,
    };
  }

  // Event dispatcher
  function sendEvent(eventType, payload) {
    const data = {
      experimentId: experimentId,
      prototypeId: prototypeId,
      visitorId: visitorId,
      sessionId: sessionId,
      eventType: eventType,
      timestamp: new Date().toISOString(),
      page: sanitizeUrl(window.location.pathname + window.location.search),
      referrer: sanitizeUrl(document.referrer),
      device: {
        width: window.innerWidth,
        height: window.innerHeight,
        userAgent: navigator.userAgent,
        language: navigator.language,
      },
      ...payload,
    };

    const json = JSON.stringify(data);

    if (navigator.sendBeacon) {
      const blob = new Blob([json], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
        keepalive: true,
      }).catch(function () {});
    }
  }

  // 1. Automatic Page View
  sendEvent('PAGE_VIEW', {
    title: document.title ? document.title.substring(0, 100) : undefined,
  });

  // 2. Automatic Click & Interaction Capture (Broad & reliable)
  document.addEventListener('click', function (e) {
    let target = e.target && e.target.closest
      ? e.target.closest('button, a, input[type="submit"], input[type="button"], [role="button"], [role="link"], [data-wiqn-id], [data-testid], [data-id], summary, [onclick], .btn, .button, [tabindex="0"]')
      : null;

    // Fallback: check if the target itself has pointer cursor or inline onclick
    if (!target && e.target && e.target.nodeType === 1) {
      try {
        const style = window.getComputedStyle(e.target);
        if (style && style.cursor === 'pointer') {
          target = e.target;
        }
      } catch (err) {}
    }

    if (target) {
      const desc = describeElement(target);
      sendEvent('CLICK', {
        element: desc ? desc.selector : (target.tagName ? target.tagName.toLowerCase() : 'element'),
        elementText: desc ? desc.text : undefined,
        targetHref: sanitizeUrl(target.getAttribute('href')) || undefined,
        metadata: {
          tag: desc ? desc.tag : (target.tagName ? target.tagName.toLowerCase() : undefined),
          wiqnId: desc ? desc.wiqnId : undefined,
          href: sanitizeUrl(target.getAttribute('href')) || undefined,
          pageTitle: document.title ? document.title.substring(0, 100) : undefined,
        },
      });
    }
  }, { capture: true, passive: true });

  // 3. Form Engagement & Start Capture
  const formsStarted = new Set();
  document.addEventListener('focusin', function (e) {
    const form = e.target && e.target.closest ? e.target.closest('form') : null;
    if (form && !formsStarted.has(form)) {
      formsStarted.add(form);
      const desc = describeElement(form);
      sendEvent('FORM_START', {
        element: desc ? desc.selector : 'form',
        elementText: form.getAttribute('aria-label') || form.name || 'Form interaction started',
      });
    }
  }, { capture: true, passive: true });

  // 4. Automatic Form Submit Capture (without sensitive field values)
  document.addEventListener('submit', function (e) {
    const form = e.target;
    sendEvent('FORM_SUBMIT', {
      element: describeElement(form)?.selector || 'form',
      formAction: sanitizeUrl(form.action) || undefined,
      formMethod: form.method || 'POST',
    });
  }, { capture: true, passive: true });

  // 5. Scroll Depth Milestones Capture (25%, 50%, 75%, 100%)
  const reachedMilestones = new Set();
  function checkScrollDepth() {
    const h = document.documentElement;
    const b = document.body;
    const st = 'scrollTop';
    const sh = 'scrollHeight';
    const totalScroll = (h[sh] || b[sh]) - h.clientHeight;
    if (totalScroll <= 0) return;
    const percent = Math.round(((h[st] || b[st]) / totalScroll) * 100);
    if (isNaN(percent) || percent <= 0) return;

    [25, 50, 75, 100].forEach(function (milestone) {
      if (percent >= milestone && !reachedMilestones.has(milestone)) {
        reachedMilestones.add(milestone);
        sendEvent('SCROLL_DEPTH', {
          element: 'document',
          elementText: 'Scrolled ' + milestone + '%',
          metadata: { scrollDepth: milestone },
        });
      }
    });
  }

  let scrollThrottleTimer = null;
  window.addEventListener('scroll', function () {
    if (!scrollThrottleTimer) {
      scrollThrottleTimer = setTimeout(function () {
        scrollThrottleTimer = null;
        checkScrollDepth();
      }, 300);
    }
  }, { passive: true });

  // 4. Session Exit & Engagement Duration (Reliable multi-event measurement)
  const startTime = Date.now();
  let lastReportedDuration = 0;

  function reportDuration(isFinal) {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    // Avoid spamming if elapsed hasn't changed noticeably (at least 3 seconds difference unless final)
    if (!isFinal && elapsedSeconds - lastReportedDuration < 3) return;
    lastReportedDuration = elapsedSeconds;

    sendEvent('TIME_ON_PAGE', {
      durationSeconds: elapsedSeconds,
      isFinal: Boolean(isFinal),
      metadata: { durationSeconds: elapsedSeconds, isFinal: Boolean(isFinal) },
    });
  }

  // Periodic heartbeat pulses (15s, 30s, 60s, 120s, 300s)
  const pulseIntervals = [15, 30, 60, 120, 300];
  pulseIntervals.forEach(function (sec) {
    setTimeout(function () {
      if (document.visibilityState !== 'hidden') {
        reportDuration(false);
      }
    }, sec * 1000);
  });

  // Track on visibility change (tab hidden or switched away)
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      reportDuration(false);
    }
  });

  // Track on page hide (recommended for mobile/modern browsers)
  window.addEventListener('pagehide', function () {
    reportDuration(true);
  });

  // Fallback for desktop window close
  window.addEventListener('beforeunload', function () {
    reportDuration(true);
  });

  // Expose global API for optional manual custom events
  window.Wiqn = {
    track: function (eventType, metadata) {
      sendEvent(eventType, { metadata: metadata });
    },
    identify: function (customVisitorId) {
      try {
        localStorage.setItem('__wiqn_vid', customVisitorId);
      } catch (e) {}
    }
  };
})();
