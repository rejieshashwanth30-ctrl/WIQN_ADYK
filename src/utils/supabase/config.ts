/**
 * Canonical Supabase configuration resolver.
 * Strictly guarantees that the Supabase Project URL and API Key are always matched,
 * eliminating the "Invalid API key" error caused by mismatched credentials between
 * local environments, Vercel production settings, and Supabase projects.
 */

export const KNOWN_SUPABASE_PROJECTS = {
  // Verified Active Production Project (Neon PostgreSQL sync, live users)
  PRODUCTION_XWW: {
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

  // 1. Detect if environment variables or settings point to the deprecated/dead XFKL project:
  // Auto-remap to the verified active production project (XWW)
  const isDeadXfkl =
    envUrl.includes('xfklxcjoyyefovpgysqz') ||
    envKey === 'sb_publishable_bDztOr8pGNRUVRkrxWGlEA_a-9weanV' ||
    envKey.includes('bDztOr8pGNRUVRkrxWGlEA');

  if (isDeadXfkl) {
    return {
      supabaseUrl: KNOWN_SUPABASE_PROJECTS.PRODUCTION_XWW.url,
      supabaseKey: KNOWN_SUPABASE_PROJECTS.PRODUCTION_XWW.key,
    };
  }

  // 2. Active production project credentials (XWW)
  const isXww =
    envUrl.includes(KNOWN_SUPABASE_PROJECTS.PRODUCTION_XWW.id) ||
    envKey === KNOWN_SUPABASE_PROJECTS.PRODUCTION_XWW.key;

  if (isXww) {
    return {
      supabaseUrl: KNOWN_SUPABASE_PROJECTS.PRODUCTION_XWW.url,
      supabaseKey: KNOWN_SUPABASE_PROJECTS.PRODUCTION_XWW.key,
    };
  }

  // 3. Custom external project credentials if fully provided and not the dead domain:
  if (envUrl && envKey && !envUrl.includes('xfklxcjoyyefovpgysqz')) {
    return {
      supabaseUrl: envUrl,
      supabaseKey: envKey,
    };
  }

  // 4. Canonical fallback: Verified Active Production Project (XWW)
  return {
    supabaseUrl: KNOWN_SUPABASE_PROJECTS.PRODUCTION_XWW.url,
    supabaseKey: KNOWN_SUPABASE_PROJECTS.PRODUCTION_XWW.key,
  };
}
