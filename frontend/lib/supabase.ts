import { createBrowserClient } from '@supabase/ssr';

// IMPORTANT: Create a .env.local file in the root of your frontend project
// and add the following environment variables:
// NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and/or anon key are missing from .env.local');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
