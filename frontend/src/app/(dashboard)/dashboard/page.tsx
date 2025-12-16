"use client";

import React, { useEffect, useState } from 'react';
import MealLoggingCard from '../meals/MealLoggingCard'; // Import MealLoggingCard
import { createClient } from '@/lib/supabase/client';
import API_BASE_URL from '@/lib/api'; // Import the API base URL
import ProgressChart from './components/ProgressChart'; // Import ProgressChart
import DayNavigator from '@/components/dashboard/DayNavigator'; // Import DayNavigator

// Helper to get today's day name (e.g., "Monday") - Moved outside the component
const getTodayDayName = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date();
  return days[date.getDay()];
};

// Helper to canonicalize day names, including Norwegian to English mapping
const canonicalizeDay = (dayString: string) => {
  const dayMap: { [key: string]: string } = {
    mandag: "monday",
    tirsdag: "tuesday",
    onsdag: "wednesday",
    torsdag: "thursday",
    fredag: "friday",
    lørdag: "saturday",
    søndag: "sunday",
    monday: "monday",
    tuesday: "tuesday",
    wednesday: "wednesday",
    thursday: "thursday",
    friday: "friday",
    saturday: "saturday",
    sunday: "sunday",
  };
  return dayMap[dayString.toLowerCase().trim()] || dayString.toLowerCase().trim();
};

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

interface ProgressData {
  workout_streak: number;
  weight_trend: Array<[string, number]>;
}

export default function DashboardPage() {
  const [plan, setPlan] = useState<FullPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null); // State to store accessToken
  const [workoutStatus, setWorkoutStatus] = useState<'pending' | 'completed' | 'skipped'>('pending');
  const [difficulty, setDifficulty] = useState<number>(0);
  const [workoutLoading, setWorkoutLoading] = useState(false);

  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [progressLoading, setProgressLoading] = useState<boolean>(true);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(getTodayDayName()); // New state for day selection


  const supabase = createClient();

  useEffect(() => {
    const fetchOrCreatePlan = async (token: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/plans/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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

    const fetchProgressData = async (token: string) => {
      setProgressLoading(true);
      setProgressError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/progress`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch progress data.');
        }

        const data: ProgressData = await response.json();
        setProgressData(data);
      } catch (e: any) {
        setProgressError(e.message);
        console.error('Error fetching progress data:', e);
      } finally {
        setProgressLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const token = session.access_token;
          setAccessToken(token);
          fetchOrCreatePlan(token);
          fetchProgressData(token);
        } else {
          setError('User not authenticated.');
          setLoading(false);
          setProgressError('User not authenticated.');
          setProgressLoading(false);
        }
      }
    );

    // Cleanup the listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Handle day selection change
  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(event.target.value);
  };

  if (loading || progressLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl">Loading dashboard data...</p>
      </div>
    );
  }

  if (error || progressError) {
    return (
      <div className="text-red-500 text-center p-4">
        <p className="text-xl font-bold">Error:</p>
        <p>{error || progressError}</p>
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
  
    const canonicalSelectedDayName = canonicalizeDay(selectedDay);
  
    let displayWorkout = plan.workout_plan.plan.find(
      (dw) => canonicalizeDay(dw.day) === canonicalSelectedDayName
    );
    let displayMeals = plan.meal_plan.plan.filter(
      (dm) => canonicalizeDay(dm.day) === canonicalSelectedDayName
    );
  
    let displayedDayName = selectedDay; // Use selected day
  
    // Fallback logic: if selected day has no content, find the first day with content
    if ((!displayWorkout || displayWorkout.exercises.length === 0) && displayMeals.length === 0) {
      // First, check if there's any content for the original today's date, if different from selected
      const canonicalTodayDayName = canonicalizeDay(getTodayDayName());
      if (canonicalSelectedDayName !== canonicalTodayDayName) {
        const todayWorkout = plan.workout_plan.plan.find((dw) => canonicalizeDay(dw.day) === canonicalTodayDayName);
        const todayMeals = plan.meal_plan.plan.filter((dm) => canonicalizeDay(dm.day) === canonicalTodayDayName);
        if (todayWorkout || todayMeals.length > 0) {
          displayWorkout = todayWorkout;
          displayMeals = todayMeals;
          displayedDayName = getTodayDayName();
        }
      }

      // If still no content, iterate through the whole plan to find the first available day
      if ((!displayWorkout || displayWorkout.exercises.length === 0) && displayMeals.length === 0) {
        for (const dayPlan of plan.workout_plan.plan) {
          const correspondingMeals = plan.meal_plan.plan.filter(
            (dm) => canonicalizeDay(dm.day) === canonicalizeDay(dayPlan.day)
          );
          if (dayPlan.exercises.length > 0 || correspondingMeals.length > 0) {
            displayWorkout = dayPlan;
            displayMeals = correspondingMeals;
            displayedDayName = dayPlan.day;
            break;
          }
        }
      }
    }
  
    // If after fallback, still no content, then the entire plan is genuinely empty.
    if (plan.workout_plan.plan.length === 0 && plan.meal_plan.plan.length === 0) {
      return (
        <div className="flex justify-center items-center h-full">
          <p className="text-xl">No plan available for any day. Please generate a full plan.</p>
        </div>
      );
    }
  
    const handleCompleteWorkout = async () => {
      if (!plan || !accessToken || !displayWorkout) return; // Use displayWorkout
      setWorkoutLoading(true);
  
      const workoutToLog = displayWorkout; // Use the currently displayed workout
      if (!workoutToLog || workoutToLog.exercises.length === 0) {
        console.error("No workout or exercises found for today to log.");
        setWorkoutLoading(false);
        return;
      }
      // TODO: Future enhancement: Log all exercises in the workout, not just the first.
      const exercise = workoutToLog.exercises[0];
  
      const workoutLogData: any = {
        workout_plan_id: 1, // Placeholder
        exercise_name: exercise.name,
        sets_completed: exercise.sets || null,
        reps_completed: exercise.reps || null,
        weight_lifted: null, // Assuming not tracked yet
        status: 'Completed',
      };
      
      // Only include difficulty_rating if it has been set by the user
      if (difficulty > 0) {
        workoutLogData.difficulty_rating = difficulty;
      }
  
      console.log('Authorization header present:', !!accessToken);
  
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/plans/log/workout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(workoutLogData),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          try {
            const errorJson = JSON.parse(errorText);
            const detail = errorJson.detail;
            if (typeof detail === 'object' && detail !== null) {
              throw new Error(JSON.stringify(detail));
            }
            throw new Error(detail || `Error logging workout: ${response.statusText}`);
          } catch (e) {
            throw new Error(errorText || `Error logging workout: ${response.statusText}`);
          }
        }
  
        setWorkoutStatus('completed');
        console.log('Workout logged as completed:', workoutLogData);
      } catch (e: any) {
        console.error('Error logging workout:', e);
        setError(e.message);
      } finally {
        setWorkoutLoading(false);
      }
    };
  
    const handleSkipWorkout = async () => {
      if (!plan || !accessToken || !displayWorkout) return; // Use displayWorkout
      setWorkoutLoading(true);
  
      const workoutToLog = displayWorkout; // Use the currently displayed workout
  
      let workoutLogData;
  
      if (!workoutToLog || workoutToLog.exercises.length === 0) {
        // This is a rest day, log it as a skipped workout with a specific name
        workoutLogData = {
          workout_plan_id: 1, // Placeholder
          exercise_name: `Rest day - ${displayedDayName}`, // Indicate which day was skipped
          sets_completed: null,
          reps_completed: null,
          weight_lifted: null,
          difficulty_rating: null,
          status: 'Skipped',
        };
      } else {
        // This is a regular workout day
        // TODO: Future enhancement: Log all exercises in the workout, not just the first.
        const exercise = workoutToLog.exercises[0];
        workoutLogData = {
          workout_plan_id: 1, // Placeholder
          exercise_name: exercise.name,
          sets_completed: null,
          reps_completed: null,
          weight_lifted: null,
          difficulty_rating: null,
          status: 'Skipped',
        };
      }
  
      console.log('Authorization header present:', !!accessToken);
  
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/plans/log/workout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(workoutLogData),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          try {
            const errorJson = JSON.parse(errorText);
            const detail = errorJson.detail;
            if (typeof detail === 'object' && detail !== null) {
              throw new Error(JSON.stringify(detail));
            }
            throw new Error(detail || `Error logging workout: ${response.statusText}`);
          } catch (e) {
            throw new Error(errorText || `Error logging workout: ${response.statusText}`);
          }
        }
  
        setWorkoutStatus('skipped');
        console.log('Workout logged as skipped:', workoutLogData);
      } catch (e: any) {
        console.error('Error logging workout:', e);
        setError(e.message);
      } finally {
        setWorkoutLoading(false);
      }
    };
  
    const handleSetDifficulty = (rating: number) => {
      setDifficulty(rating);
      // Here you would typically save the rating to the backend
      console.log(`Workout completed with difficulty: ${rating}`);
    };
  
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-2 text-center">Your Daily Plan - {displayedDayName}</h2>
  
        {/* Day Selector */}
        <DayNavigator selectedDay={selectedDay} onDayChange={handleDayChange} />

        {/* Progress Chart */}
        {progressData && (
          <div className="mb-8">
            <ProgressChart
              workoutStreak={progressData.workout_streak}
              weightTrend={progressData.weight_trend}
            />
          </div>
        )}

        {/* Workout Plan for Today */}
        <section className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Workout</h3>
          {displayWorkout && displayWorkout.exercises.length > 0 ? (
            <div>
              <p className="text-lg font-medium mb-2">Focus: {displayWorkout.focus}</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                {displayWorkout.exercises.map((exercise, index) => (
                  <li key={index}>
                    <span className="font-semibold">{exercise.name}</span>
                    {exercise.description && <span className="text-gray-400"> ({exercise.description})</span>}
                    {exercise.sets && <span> - {exercise.sets} sets</span>}
                    {exercise.reps && <span> of {exercise.reps} reps</span>}
                    {exercise.duration_minutes && <span> for {exercise.duration_minutes} min</span>}
                  </li>
                ))}
              </ul>
  
              {/* --- WORKOUT COMPLETION UI --- */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                {workoutStatus === 'pending' && (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={handleCompleteWorkout}
                      disabled={workoutLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={handleSkipWorkout}
                      disabled={workoutLoading}
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
            <div className="text-center">
              Rest day (planned). Light recovery or a walk is recommended.
              {workoutStatus === 'pending' && (
                  <button
                      onClick={handleSkipWorkout}
                      disabled={workoutLoading}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full"
                    >
                      Log rest day
                    </button>
              )}
              {workoutStatus === 'skipped' && (
                  <p className="text-lg font-semibold text-gray-400 mt-4">Rest day marked as skipped.</p>
              )}
            </div>
          )}
        </section>
  
        {/* Meal Plan for Today */}
        <section className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Meals</h3>
                                  {displayMeals.length > 0 ? (
                                    <div className="space-y-6 mb-6"> {/* Added margin-bottom here */}
                                      {['Breakfast', 'Lunch', 'Dinner'].map((mealType) => {
                                        const mealsForType = displayMeals.filter(
                                          (meal) => meal.meal_type === mealType
                                        );
                                        if (mealsForType.length === 0) return null;

                                        return (
                                          <div key={mealType} className="mb-4">
                                            <h4 className="text-xl font-semibold mb-2 text-blue-300">{mealType}</h4>
                                            <ul className="list-disc list-inside ml-4 space-y-1">
                                              {mealsForType.map((meal) =>
                                                meal.items.map((item, itemIndex) => (
                                                  <li key={itemIndex} className="text-gray-300">
                                                    {item.name} {item.calories && `(${item.calories} kcal)`}
                                                  </li>
                                                ))
                                              )}
                                            </ul>
                                          </div>
                                        );
                                      })}

                                      {accessToken &&
                                        displayMeals.map((meal, mealIndex) => (
                                          <MealLoggingCard
                                            key={mealIndex}
                                            meal_plan_id={1} // Using a placeholder ID. This should ideally come from the backend.
                                            meal_name={meal.meal_type} // Using meal_type as the meal_name for the card
                                            accessToken={accessToken} // Pass accessToken as prop
                                          />
                                        ))}
                                    </div>
                                  ) : (
                                    <p className="text-gray-400">No meal plan found for {displayedDayName}.</p>
                                  )}
        </section>
    </div>
  );
}