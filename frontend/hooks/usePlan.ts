// frontend/hooks/usePlan.ts
import useSWR from 'swr';
import { supabase } from '@/lib/supabase'; // Assuming supabase client is available

// Define the shape of a plan (can be refined later with full schema)
interface PlanData {
  workout_plan: any; // Replace any with actual WorkoutPlan type
  meal_plan: any;    // Replace any with actual MealPlan type
}

// Fetcher function for SWR
const planFetcher = async (url: string) => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error('Not authenticated.');
  }

  const response = await fetch(url, {
    method: 'POST', // Assuming generate is a POST request
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch plan.');
  }

  return response.json();
};

export function usePlan() {
  // Key for SWR: we want to generate a plan for the current user
  // This key could include user_id if plans are strictly user-bound and cached per user.
  // For initial generation, a generic key might be fine.
  const { data, error, isLoading, mutate } = useSWR<PlanData>('/api/v1/plans/generate', planFetcher, {
    revalidateOnFocus: false, // Do not re-generate plan on window focus
    shouldRetryOnError: false, // Do not retry automatically
  });

  return {
    plan: data,
    isLoading,
    isError: error,
    generatePlan: mutate, // Expose mutate to allow manual re-generation
  };
}
