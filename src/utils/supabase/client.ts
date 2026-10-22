import { createBrowserClient } from '@supabase/ssr';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  let supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://xwwpvtmvbujtynyanywl.supabase.co'
  ).trim().replace(/^["']|["']$/g, '');

  if (supabaseUrl.includes('xfklxcjoyyefovpgysqz')) {
    supabaseUrl = 'https://xwwpvtmvbujtynyanywl.supabase.co';
  }

  let supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_6rNhhVwAY04T2dInW6eUaw_1MbDHiL0'
  ).trim().replace(/^["']|["']$/g, '');

  if (supabaseUrl.includes('xwwpvtmvbujtynyanywl') && (!supabaseKey.startsWith('sb_publishable_') || supabaseKey.length > 80)) {
    supabaseKey = 'sb_publishable_6rNhhVwAY04T2dInW6eUaw_1MbDHiL0';
  }

  if (typeof window === 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseKey);
  }

  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseKey);
  }

  return browserClient;
}
