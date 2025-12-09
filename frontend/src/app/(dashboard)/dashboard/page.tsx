"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

interface DailyWorkoutPlan {
  day: string;
  focus: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  days: DailyWorkoutPlan[];
}

interface MealItem {
  type: string;
  description: string;
  calories?: number;
  protein_g?: number;
}

interface DailyMealPlan {
  day: string;
  meals: MealItem[];
}

interface MealPlan {
  days: DailyMealPlan[];
}

interface CurrentPlanResponse {
  workout_plan?: WorkoutPlan;
  meal_plan?: MealPlan;
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch("/api/v1/plans/current"); // Adjust API endpoint as needed
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch plan");
        }
        const data: CurrentPlanResponse = await response.json();
        setWorkoutPlan(data.workout_plan || null);
        setMealPlan(data.meal_plan || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Loading your personalized plan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500">
        Error: {error}
        <button
          onClick={() => router.push("/onboarding")} // Redirect to onboarding to regenerate plan
          className="ml-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Go to Onboarding to Generate Plan
        </button>
      </div>
    );
  }

  if (!workoutPlan && !mealPlan) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
        <p>No plan found. Please generate your first plan.</p>
        <button
          onClick={() => router.push("/onboarding")} // Redirect to onboarding to generate plan
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Go to Onboarding to Generate Plan
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Personalized Plan</h1>

      {workoutPlan && (
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-indigo-400">Workout Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workoutPlan.days.map((dayPlan, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-orange-400">{dayPlan.day} - {dayPlan.focus}</h3>
                <ul className="space-y-3">
                  {dayPlan.exercises.map((exercise, exIndex) => (
                    <li key={exIndex} className="text-gray-300">
                      <strong>{exercise.name}:</strong> {exercise.sets} sets of {exercise.reps} reps
                      {exercise.notes && <span className="block text-sm text-gray-500 italic">({exercise.notes})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {mealPlan && (
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-green-400">Meal Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mealPlan.days.map((dayPlan, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-purple-400">{dayPlan.day}</h3>
                <ul className="space-y-3">
                  {dayPlan.meals.map((meal, mealIndex) => (
                    <li key={mealIndex} className="text-gray-300">
                      <strong>{meal.type}:</strong> {meal.description}
                      {(meal.calories || meal.protein_g) && (
                        <span className="text-sm text-gray-500 block">
                          ({meal.calories && `${meal.calories} kcal`}
                          {meal.calories && meal.protein_g && ", "}
                          {meal.protein_g && `${meal.protein_g}g protein`})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
