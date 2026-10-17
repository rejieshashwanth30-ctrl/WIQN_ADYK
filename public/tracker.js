/**
 * ADYK WIQN AUTOCAPTURE SCRIPT v1.0
 * Zero-configuration client-side evidence capture layer.
 * 
 * Usage:
 * <script 
 *   src="https://wiqn.adyk.io/tracker.js" 
 *   data-experiment="YOUR_EXPERIMENT_ID" 
 *   data-endpoint="/api/capture"
 *   async>
 * </script>
 */

(function () {
  'use strict';

  // Read configuration from script tag
  const scriptTag = document.currentScript || document.querySelector('script[data-experiment]');
  const experimentId = scriptTag ? scriptTag.getAttribute('data-experiment') : 'default';
  const prototypeId = scriptTag ? scriptTag.getAttribute('data-prototype') : 'v1';
  const endpoint = scriptTag ? (scriptTag.getAttribute('data-endpoint') || '/api/capture') : '/api/capture';

  // Persistent anonymous visitor ID
  function getVisitorId() {
    let vid = localStorage.getItem('__wiqn_vid');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      try {
        localStorage.setItem('__wiqn_vid', vid);
      } catch (e) {}
    }
    return vid;
  }

  // Session ID (persists for browser session)
  function getSessionId() {
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
    const id = el.id ? '#' + el.id : '';
    const className = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    
    // Privacy safeguard: If element is sensitive, redact completely
    if (isSensitive(el)) {
      return {
        selector: tag + id + className,
        text: '[REDACTED]',
        tag: tag,
      };
    }

    // Never capture user input values from inputs or textareas
    let text = '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      text = (el.getAttribute('placeholder') || el.getAttribute('aria-label') || el.name || '').trim();
    } else {
      text = (el.innerText || el.textContent || '').trim();
    }

    // Double check text does not contain password/key patterns
    if (SENSITIVE_REGEX.test(text) && text.length > 20) {
      text = '[REDACTED]';
    } else {
      text = text.substring(0, 60);
    }

    return {
      selector: tag + id + className,
      text: text || undefined,
      tag: tag,
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

  // 2. Automatic Click & Interaction Capture
  document.addEventListener('click', function (e) {
    const target = e.target.closest('button, a, input[type="submit"], input[type="button"], [role="button"], summary');
    if (target) {
      const desc = describeElement(target);
      sendEvent('CLICK', {
        element: desc ? desc.selector : null,
        elementText: desc ? desc.text : null,
        targetHref: sanitizeUrl(target.getAttribute('href')) || undefined,
      });
    }
  }, { capture: true, passive: true });

  // 3. Automatic Form Submit Capture (without sensitive field values)
  document.addEventListener('submit', function (e) {
    const form = e.target;
    sendEvent('FORM_SUBMIT', {
      element: describeElement(form)?.selector || 'form',
      formAction: sanitizeUrl(form.action) || undefined,
      formMethod: form.method || 'POST',
    });
  }, { capture: true, passive: true });

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
