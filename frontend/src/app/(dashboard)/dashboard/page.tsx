"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// Define the FullPlan structure (should match backend Pydantic model)
// ... (interface definitions remain the same) ...
interface WorkoutExercise {
  name: string;
  description?: string;
  sets?: number;
  reps?: string;
  duration_minutes?: number;
  equipment?: string[];
}

interface DailyWorkout {
  day: string;
  focus: string;
  exercises: WorkoutExercise[];
  notes?: string;
}

interface WorkoutPlan {
  plan: DailyWorkout[];
}

interface MealItem {
  name: string;
  description?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

interface DailyMeal {
  day: string;
  meal_type: string;
  items: MealItem[];
  total_calories?: number;
  notes?: string;
}

interface MealPlan {
  plan: DailyMeal[];
}

interface FullPlan {
  workout_plan: WorkoutPlan;
  meal_plan: MealPlan;
}


export default function DashboardPage() {
  const [plan, setPlan] = useState<FullPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [workoutStatus, setWorkoutStatus] = useState<'pending' | 'completed' | 'skipped'>('pending');
  const [difficulty, setDifficulty] = useState<number>(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrCreatePlan = async (accessToken: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/v1/plans/generate-initial', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to generate or fetch plan.');
        }

        const data: FullPlan = await response.json();
        setPlan(data);
      } catch (e: any) {
        setError(e.message);
        console.error('Error fetching or creating plan:', e);
      } finally {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          fetchOrCreatePlan(session.access_token);
        } else if (event === 'INITIAL_SESSION' && session) {
          // Handle case where session is already available on mount
          fetchOrCreatePlan(session.access_token);
        } else if (!session) {
          setError('User not authenticated.');
          setLoading(false);
        }
      }
    );

    // Cleanup the listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl">Generating your personalized plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p className="text-xl font-bold">Error:</p>
        <p>{error}</p>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl">No plan available.</p>
      </div>
    );
  }

  // Helper to get today's day name (e.g., "Monday")
  const getTodayDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    return days[date.getDay()];
  };

  const todayDayName = getTodayDayName();
  const todayWorkout = plan.workout_plan.plan.find(dw => dw.day === todayDayName);
  const todayMeals = plan.meal_plan.plan.filter(dm => dm.day === todayDayName);

  // ... (rest of the component code remains the same)
  const handleCompleteWorkout = () => {
    setWorkoutStatus('completed');
  };

  const handleSkipWorkout = () => {
    setWorkoutStatus('skipped');
  };

  const handleSetDifficulty = (rating: number) => {
    setDifficulty(rating);
    // Here you would typically save the rating to the backend
    console.log(`Workout completed with difficulty: ${rating}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Daily Plan - {todayDayName}</h2>

      {/* Workout Plan for Today */}
      <section className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Workout</h3>
        {todayWorkout ? (
          <div>
            <p className="text-lg font-medium mb-2">Focus: {todayWorkout.focus}</p>
            {todayWorkout.exercises.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 mb-6">
                {todayWorkout.exercises.map((exercise, index) => (
                  <li key={index}>
                    <span className="font-semibold">{exercise.name}</span>
                    {exercise.description && <span className="text-gray-400"> ({exercise.description})</span>}
                    {exercise.sets && <span> - {exercise.sets} sets</span>}
                    {exercise.reps && <span> of {exercise.reps} reps</span>}
                    {exercise.duration_minutes && <span> for {exercise.duration_minutes} min</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">{todayWorkout.notes || "No specific workout planned for today."}</p>
            )}

            {/* --- WORKOUT COMPLETION UI --- */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              {workoutStatus === 'pending' && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleCompleteWorkout}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={handleSkipWorkout}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Skip Workout
                  </button>
                </div>
              )}

              {workoutStatus === 'completed' && (
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-400 mb-4">Workout Completed!</p>
                  <p className="text-md mb-3">Rate the difficulty:</p>
                  <div className="flex justify-center items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleSetDifficulty(star)}
                        className={`text-4xl transition-colors ${
                          star <= difficulty ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'
                        }`}
                      >
                        &#9733;
                      </button>
                    ))}
                  </div>
                  {difficulty > 0 && (
                    <p className="mt-4 text-sm text-gray-400">Thanks for your feedback!</p>
                  )}
                </div>
              )}

              {workoutStatus === 'skipped' && (
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-400">Workout Skipped</p>
                  <p className="text-sm text-gray-500">Remember, consistency is key. Try to catch the next one!</p>
                </div>
              )}
            </div>
             {/* --- END WORKOUT COMPLETION UI --- */}

          </div>
        ) : (
          <p className="text-gray-400">No workout plan found for today.</p>
        )}
      </section>

      {/* Meal Plan for Today */}
      <section className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Meals</h3>
        {todayMeals.length > 0 ? (
          <div className="space-y-6">
            {todayMeals.map((meal, mealIndex) => (
              <div key={mealIndex} className="bg-gray-700 p-4 rounded-md shadow-inner">
                <p className="text-lg font-medium mb-2">{meal.meal_type}</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {meal.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <span className="font-semibold">{item.name}</span>
                      {item.description && <span className="text-gray-400"> ({item.description})</span>}
                      {item.calories && <span> - {item.calories} kcal</span>}
                      {item.protein_g && <span>, {item.protein_g}g protein</span>}
                      {item.carbs_g && <span>, {item.carbs_g}g carbs</span>}
                      {item.fat_g && <span>, {item.fat_g}g fat</span>}
                    </li>
                  ))}
                </ul>
                {meal.total_calories && <p className="text-sm text-gray-400 mt-2">Total Meal Calories: {meal.total_calories} kcal</p>}
                {meal.notes && <p className="text-sm text-gray-400 mt-2">Notes: {meal.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No meal plan found for today.</p>
        )}
      </section>
    </div>
  );
}