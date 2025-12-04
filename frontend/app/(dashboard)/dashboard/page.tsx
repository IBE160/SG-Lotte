// frontend/app/(dashboard)/dashboard/page.tsx
'use client';

import React from 'react';
import { usePlan } from '@/hooks/usePlan';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export default function DashboardPage() {
  const router = useRouter();
  const { showInfo, showError } = useToast();
  const { plan, isLoading, isError, generatePlan } = usePlan();

  const handleGeneratePlan = async () => {
    try {
      showInfo('Generating your personalized plan...');
      await generatePlan(); // Trigger plan generation
      showSuccess('Your plan has been generated successfully!');
    } catch (error: any) {
      showError(`Failed to generate plan: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-300">Loading your plan...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500">Error loading plan: {isError.message}</p>
        <button
          onClick={handleGeneratePlan}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try to Generate Plan
        </button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-300">No plan found. Let's generate one for you!</p>
        <button
          onClick={handleGeneratePlan}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Generate My First Plan
        </button>
      </div>
    );
  }

  // Display the plan for the current day (simplified for MVP)
  const today = new Date().toLocaleString('en-us', { weekday: 'long' });

  const currentWorkoutSession = plan.workout_plan.sessions.find(
    (session: any) => session.day_of_week.toLowerCase() === today.toLowerCase()
  );

  const currentDailyMealPlan = plan.meal_plan.daily_plans.find(
    (dailyPlan: any) => dailyPlan.day_of_week.toLowerCase() === today.toLowerCase()
  );

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Personalized Plan - {today}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Workout Plan Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Workout Focus: {currentWorkoutSession?.focus || 'Rest Day'}</h2>
          {currentWorkoutSession?.exercises && currentWorkoutSession.exercises.length > 0 ? (
            <div>
              {currentWorkoutSession.exercises.map((exercise: any, index: number) => (
                <div key={index} className="mb-3 p-2 border-b border-gray-700 last:border-b-0">
                  <h3 className="text-lg font-medium">{exercise.name}</h3>
                  <p>Sets: {exercise.sets}, Reps: {exercise.reps}</p>
                  <p>Rest: {exercise.rest_time_seconds}s</p>
                  {exercise.notes && <p className="text-sm text-gray-400">Notes: {exercise.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No specific workout planned for today.</p>
          )}
        </div>

        {/* Meal Plan Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Meals for Today</h2>
          {currentDailyMealPlan?.meals && currentDailyMealPlan.meals.length > 0 ? (
            <div>
              {currentDailyMealPlan.meals.map((meal: any, index: number) => (
                <div key={index} className="mb-3 p-2 border-b border-gray-700 last:border-b-0">
                  <h3 className="text-lg font-medium">{meal.name}</h3>
                  {meal.items && meal.items.length > 0 ? (
                    <ul className="list-disc list-inside pl-4">
                      {meal.items.map((item: any, itemIndex: number) => (
                        <li key={itemIndex}>{item.quantity} {item.unit || ''} {item.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">No items listed for this meal.</p>
                  )}
                  {meal.total_calories && <p className="text-sm text-gray-400">Calories: {meal.total_calories}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No specific meals planned for today.</p>
          )}
        </div>
      </div>
    </div>
  );
}
