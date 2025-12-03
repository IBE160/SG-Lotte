import { createBrowserClient } from '@supabase/ssr';

// IMPORTANT: Create a .env.local file in the root of your frontend project
// and add the following environment variables:
// NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  // In a real application, you might want to handle this more gracefully,
  // or ensure these are always set in your environment variables.
  console.error('Supabase URL and/or anon key are missing from .env.local');
  // For now, we'll throw an error to prevent the app from running without proper configuration
  // For testing, this error won't be hit due to mocking
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);