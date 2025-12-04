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
  // In a real application, you might update a 'profiles' table.
  // For simplicity and initial setup, we'll update the user_metadata in auth.users.
  // The backend will define the definitive schema and update method.
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: preferences,
  });

  if (error) {
    console.error('Error updating user preferences:', error.message);
    throw new Error('Failed to update user preferences');
  }

  return data;
}
