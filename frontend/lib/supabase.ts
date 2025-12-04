import { createBrowserClient } from '@supabase/ssr';

// IMPORTANT: Create a .env.local file in the root of your frontend project
// and add the following environment variables:
// NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and/or anon key are missing from .env.local');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Utility function to update user preferences in Supabase
export async function updateUserPreferences(userId: string, preferences: any) {
  const response = await fetch('/api/v1/users/preferences', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // The backend will handle authentication using the session cookie
    },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error updating user preferences:', errorData);
    throw new Error(errorData.detail || 'Failed to update user preferences');
  }

  return response.json();
}
