/**
 * Canonical Supabase configuration resolver.
 * Strictly guarantees that the Supabase Project URL and API Key are always matched,
 * eliminating the "Invalid API key" error caused by mismatched credentials between
 * local environments, Vercel production settings, and Supabase projects.
 */

export const KNOWN_SUPABASE_PROJECTS = {
  // Production Vercel project (primary: active users and live deployment)
  PRODUCTION_XFKL: {
    id: 'xfklxcjoyyefovpgysqz',
    url: 'https://xfklxcjoyyefovpgysqz.supabase.co',
    key: 'sb_publishable_bDztOr8pGNRUVRkrxWGlEA_a-9weanV',
  },
  // Alternate / secondary project
  ALTERNATE_XWW: {
    id: 'xwwpvtmvbujtynyanywl',
    url: 'https://xwwpvtmvbujtynyanywl.supabase.co',
    key: 'sb_publishable_6rNhhVwAY04T2dInW6eUaw_1MbDHiL0',
  },
} as const;

export function getSupabaseConfig(): { supabaseUrl: string; supabaseKey: string } {
  const envUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  ).trim().replace(/^["']|["']$/g, '');

  const envKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim().replace(/^["']|["']$/g, '');

  // 1. Detect if either URL or key points to XFKL (production project):
  const isXfkl =
    envUrl.includes(KNOWN_SUPABASE_PROJECTS.PRODUCTION_XFKL.id) ||
    envKey === KNOWN_SUPABASE_PROJECTS.PRODUCTION_XFKL.key;

  if (isXfkl) {
    return {
      supabaseUrl: KNOWN_SUPABASE_PROJECTS.PRODUCTION_XFKL.url,
      supabaseKey: KNOWN_SUPABASE_PROJECTS.PRODUCTION_XFKL.key,
    };
  }

  // 2. Detect if either URL or key points to XWW (alternate project):
  const isXww =
    envUrl.includes(KNOWN_SUPABASE_PROJECTS.ALTERNATE_XWW.id) ||
    envKey === KNOWN_SUPABASE_PROJECTS.ALTERNATE_XWW.key;

  if (isXww) {
    return {
      supabaseUrl: KNOWN_SUPABASE_PROJECTS.ALTERNATE_XWW.url,
      supabaseKey: KNOWN_SUPABASE_PROJECTS.ALTERNATE_XWW.key,
    };
  }

  // 3. Custom external project credentials if fully provided:
  if (envUrl && envKey) {
    return {
      supabaseUrl: envUrl,
      supabaseKey: envKey,
    };
  }

  // 4. Canonical fallback: Production Vercel project (XFKL)
  return {
    supabaseUrl: KNOWN_SUPABASE_PROJECTS.PRODUCTION_XFKL.url,
    supabaseKey: KNOWN_SUPABASE_PROJECTS.PRODUCTION_XFKL.key,
  };
}
