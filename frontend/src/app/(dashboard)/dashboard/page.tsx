"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Define the FullPlan structure (should match backend Pydantic model)
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

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [plan, setPlan] = useState<FullPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrCreatePlan = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          throw new Error('User not authenticated.');
        }

        const accessToken = session.access_token;

        // Check if a plan already exists for the user (simplified check, would involve a GET endpoint in a real app)
        // For now, we'll assume if we call generate-initial, it will return the existing one or create a new one.
        // A more robust solution would involve a separate endpoint to fetch current plan.

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

    fetchOrCreatePlan();
  }, []);

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
              <ul className="list-disc list-inside space-y-2">
                {todayWorkout.exercises.map((exercise, index) => (
                  <li key={index}>
                    <span className="font-semibold">{exercise.name}</span>
                    {exercise.description && <span className="text-gray-400"> ({exercise.description})</span>}
                    {exercise.sets && <span> - {exercise.sets} sets</span>}
                    {exercise.reps && <span> of {exercise.reps} reps</span>}
                    {exercise.duration_minutes && <span> for {exercise.duration_minutes} min</span>}
                    {exercise.equipment && exercise.equipment.length > 0 && (
                      <span className="text-sm text-gray-500"> (Equipment: {exercise.equipment.join(', ')})</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">{todayWorkout.notes || "No specific workout planned for today."}</p>
            )}
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
