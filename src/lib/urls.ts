/**
 * ADYK Wiqn — Centralized URL Generation & Attribution Helper
 * 
 * Provides environment-aware resolution of base URLs, test routes,
 * and 1-click tester sharing destinations (WhatsApp, X, LinkedIn, Email).
 */

export const PRODUCTION_DOMAIN = 'https://wiqn.adyk.io';
export const LOCAL_DEV_DOMAIN = 'http://localhost:3000';

/**
 * Returns whether the code is currently running in a local developer environment.
 */
export function isLocalEnvironment(): boolean {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
  }
  return process.env.NODE_ENV === 'development';
}

/**
 * Returns the guaranteed production application URL (https://wiqn.adyk.io).
 */
export function getProductionAppUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, '');
  if (envUrl && envUrl.startsWith('https://')) {
    return envUrl;
  }
  return PRODUCTION_DOMAIN;
}

/**
 * Returns the local development application URL (http://localhost:3000).
 */
export function getLocalAppUrl(): string {
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.endsWith('.local');
    if (isLocal) {
      return window.location.origin;
    }
  }
  return LOCAL_DEV_DOMAIN;
}

/**
 * Returns the environment-appropriate public application URL:
 * - In production: https://wiqn.adyk.io
 * - In local development: http://localhost:3000 (when specifically requesting local)
 */
export function getPublicAppUrl(options?: { forceProduction?: boolean; forceLocal?: boolean }): string {
  if (options?.forceLocal) {
    return getLocalAppUrl();
  }
  if (options?.forceProduction) {
    return getProductionAppUrl();
  }

  // If in deployed environment or server production, return production domain
  if (process.env.NODE_ENV === 'production') {
    return getProductionAppUrl();
  }

  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'https:') {
      return window.location.origin;
    }
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.endsWith('.local');
    if (isLocal) {
      return window.location.origin;
    }
  }

  return getProductionAppUrl();
}

/**
 * Generates the public testing URL for a specific experiment.
 * When sharing with external testers, defaults to:
 * https://wiqn.adyk.io/test/[experimentId]
 * When running locally and testing on this machine, options.forceLocal can be used:
 * http://localhost:3000/test/[experimentId]
 */
export function getTestUrl(experimentId: string, options?: { forceProduction?: boolean; forceLocal?: boolean }): string {
  if (options?.forceLocal) {
    return `${getLocalAppUrl()}/test/${experimentId}`;
  }
  // Production test URL is the canonical shareable link for all external devices
  return `${getProductionAppUrl()}/test/${experimentId}`;
}

/**
 * Generates all one-click share links for an experiment test route.
 * Guarantees that share links use https://wiqn.adyk.io/test/[experimentId]
 * so that invite links work from any phone or computer over the public internet.
 */
export function getShareUrls(
  experimentId: string,
  productName: string = 'product prototype',
  options?: { forceProduction?: boolean; forceLocal?: boolean }
) {
  const testUrl = getTestUrl(experimentId, options);
  const cleanName = productName.trim() || 'product prototype';

  const whatsappMessage = `Please test our ${cleanName} prototype on ADYK Wiqn and share your feedback: ${testUrl}`;
  const tweetText = `Testing our ${cleanName} prototype on ADYK Wiqn. Try it here: `;
  const emailSubject = `Product Test Invitation: ${cleanName}`;
  const emailBody = `Hi,\n\nPlease test our product prototype on ADYK Wiqn and share your thoughts:\n\n${testUrl}\n\nThank you!`;

  return {
    testUrl,
    localTestUrl: `${getLocalAppUrl()}/test/${experimentId}`,
    productionTestUrl: `${getProductionAppUrl()}/test/${experimentId}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(testUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(testUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
  };
}
