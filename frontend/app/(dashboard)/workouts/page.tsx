'use client'; // This is a client component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Types for the data received from the API
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest_time_seconds: number;
  notes: string | null;
  completedSets: number;
  totalSets: number;
  icon: string;
  status: 'Completed' | 'Skipped' | 'pending';
  difficulty: number | null;
}

interface WorkoutSession {
  day_of_week: string;
  focus: string;
  exercises: Exercise[];
}

interface TodaysWorkoutResponse {
  plan_id: string;
  session: WorkoutSession;
}


export default function WorkoutLogPage() {
  const [todaysWorkout, setTodaysWorkout] = useState<TodaysWorkoutResponse | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch('/api/v1/plans/today');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TodaysWorkoutResponse = await response.json();
        setTodaysWorkout(data);
        if (data.session && data.session.exercises) {
            const initialExercises = data.session.exercises.map(ex => ({
                ...ex,
                id: ex.name, // Using name as a temporary unique ID
                completedSets: 0,
                totalSets: ex.sets,
                icon: 'fitness_center', // default icon
                status: 'pending',
                difficulty: null,
                notes: ex.notes || '',
            }));
            setExercises(initialExercises);
            setSelectedExerciseId(initialExercises[0]?.id || null);
        }
      } catch (error) {
        console.error("Could not fetch workout data:", error);
        setError("Failed to load workout data.");
      }
    };

    fetchWorkout();
  }, []);

  const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId);

  const handleWorkoutStatusChange = (exerciseId: string, status: 'Completed' | 'Skipped' | 'pending') => {
    setExercises(prevExercises =>
      prevExercises.map(ex =>
        ex.id === exerciseId ? { ...ex, status, difficulty: status === 'Completed' ? ex.difficulty : null } : ex
      )
    );
  };

  const handleDifficultyChange = (exerciseId: string, rating: number) => {
    setExercises(prevExercises =>
      prevExercises.map(ex =>
        ex.id === exerciseId ? { ...ex, difficulty: rating } : ex
      )
    );
  };

  const handleSetCompletionChange = (exerciseId: string, setId: string, completed: boolean) => {
    // This is mock logic, in a real app you'd update a set of mockSets or send to API
    console.log(`Exercise ${exerciseId}, Set ${setId} completed: ${completed}`);
    // For now, we'll just re-evaluate overall workout completion status
    
  };

  const handleSaveWorkout = async () => {
    if (selectedExercise && todaysWorkout) {
      setIsLoading(true);
      setError(null);
      const payload = {
        workout_plan_id: todaysWorkout.plan_id,
        day_of_week: new Date(todaysWorkout.session.day_of_week).getDay() + 1, // Assuming day_of_week is a string date
        status: selectedExercise.status,
        difficulty_rating: selectedExercise.difficulty,
      };
      console.log('Sending API call to log workout:', payload);
      
      try {
        const response = await fetch('/api/v1/plans/log-workout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        console.log('Workout logged successfully');
        // Optionally, show a success message to the user
      } catch (err: any) {
        console.error('Failed to log workout:', err);
        setError(err.message || 'Failed to save workout. Please try again.');
      } finally {
        setIsLoading(false);
      }

    } else {
      console.warn('No exercise selected to save.');
    }
  };


  return (
    <div className="relative flex min-h-screen w-full">
      {/* Sidebar Navigation */}
      <aside className="flex flex-col w-64 border-r border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark p-4 shrink-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="User profile picture for Alex Chen" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBWfxYf1uURhKWiCjH75E7IQk8Sr-iYiNYk_cUh9uAUF33zGTYNiQEzyss0d2tANtyEfoycMHMEodokuXhH9e5SK_HjVN6Bwvj5pqxhs_VXfgKwqm2LtHIdwl0iKnjTF4D1q-Y4BMOekU8jER2DAIk9i9yYAdkyHUl6ZsAo0isUe-dfNozfool2bGzuIEX72l7QMY")' }}></div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-text-primary-dark text-base font-medium leading-normal">Alex Chen</h1>
              <p className="text-gray-500 dark:text-text-secondary-dark text-sm font-normal leading-normal">AI Fitness Coach</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2 mt-4">
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" href="/dashboard">
              <span className="material-symbols-outlined text-gray-500 dark:text-text-secondary-dark">dashboard</span>
              <p className="text-gray-900 dark:text-text-primary-dark text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20" href="/workouts">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}>fitness_center</span>
              <p className="text-primary text-sm font-medium leading-normal">Workout Log</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" href="/meals">
              <span className="material-symbols-outlined text-gray-500 dark:text-text-secondary-dark">restaurant_menu</span>
              <p className="text-gray-900 dark:text-text-primary-dark text-sm font-normal leading-normal">Meal Plan</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" href="/progress">
              <span className="material-symbols-outlined text-gray-500 dark:text-text-secondary-dark">trending_up</span>
              <p className="text-gray-900 dark:text-text-primary-dark text-sm font-medium leading-normal">Progress</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" href="/profile">
              <span className="material-symbols-outlined text-gray-500 dark:text-text-secondary-dark">person</span>
              <p className="text-gray-900 dark:text-text-primary-dark text-sm font-medium leading-normal">Profile</p>
            </Link>
          </nav>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
            <span className="truncate">New Workout</span>
          </button>
          <div className="flex flex-col gap-1">
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" href="/settings">
              <span className="material-symbols-outlined text-gray-500 dark:text-text-secondary-dark">settings</span>
              <p className="text-gray-900 dark:text-text-primary-dark text-sm font-medium leading-normal">Settings</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" href="/help">
              <span className="material-symbols-outlined text-gray-500 dark:text-text-secondary-dark">help</span>
              <p className="text-gray-900 dark:text-text-primary-dark text-sm font-normal leading-normal">Help</p>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 @4xl:grid-cols-2 min-h-full">
          <div className="p-8 @4xl:border-r border-gray-200 dark:.border-border-dark flex flex-col">
            {/* Calibration Week Banner */}
            <div className="relative bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-xl px-4 py-3 mb-6 text-primary">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">auto_awesome</span>
                <div className="flex-grow">
                  <h4 className="font-bold text-primary dark:text-sky-200">Calibration Week</h4>
                  <p className="text-sm text-primary/80 dark:text-sky-300">Rate your workouts to help the AI learn your fitness level.</p>
                </div>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/20">
                  <span className="material-symbols-outlined !text-lg">close</span>
                </button>
              </div>
            </div>

            <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-gray-900 dark:text-text-primary-dark text-4xl font-black leading-tight tracking-[-0.033em]">{todaysWorkout?.session.focus || "Workout"}</h1>
                <p className="text-gray-500 dark:text-text-secondary-dark text-base font-normal leading-normal">{todaysWorkout?.session.day_of_week}</p>
              </div>
              <button
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 disabled:opacity-50"
                onClick={handleSaveWorkout}
                disabled={isLoading}
              >
                <span className="truncate">{isLoading ? "Saving..." : "Save Workout"}</span>
              </button>
            </header>

            {error && <div className="text-red-500 my-2">{error}</div>}
            {/* You could add a success message state as well if desired */}

            <div className="flex-grow flex flex-col gap-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`group cursor-pointer p-4 rounded-xl bg-white dark:bg-surface-dark border-2 ${selectedExerciseId === exercise.id ? 'border-primary' : 'border-transparent hover:border-gray-200 dark:hover:border-border-dark'} transition-all`}
                  onClick={() => setSelectedExerciseId(exercise.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center size-10 rounded-lg ${exercise.status === 'Completed' ? 'bg-primary/10 dark:bg-primary/20' : 'bg-gray-100 dark:bg-gray-800'} shrink-0`}>
                        <span className={`material-symbols-outlined ${exercise.status === 'Completed' ? 'text-primary' : 'text-gray-500 dark:text-text-secondary-dark'}`} style={{ fontVariationSettings: "'wght' 500" }}>{exercise.icon}</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-text-primary-dark">{exercise.name}</h2>
                        <p className={`text-sm ${exercise.status === 'Completed' ? 'text-primary' : 'text-gray-500 dark:text-text-secondary-dark'}`}>{exercise.completedSets} of {exercise.totalSets} sets completed</p>
                      </div>
                    </div>
                    <span className={`material-symbols-outlined ${selectedExerciseId === exercise.id ? 'text-primary' : 'text-gray-500 dark:text-text-secondary-dark group-hover:text-gray-900 dark:group-hover:text-text-dark'}`}>arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-text-primary-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-100/80 dark:hover:bg-gray-700/80">
                <span className="material-symbols-outlined">add</span>
                <span className="truncate">Add Exercise</span>
              </button>
            </div>
          </div>

          {/* Right panel for exercise details */}
          <div className="p-8 flex flex-col bg-surface-dark">
            {selectedExercise ? (
              <>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h2 className="text-gray-900 dark:text-text-primary-dark text-3xl font-bold tracking-tight">{selectedExercise.name}</h2>
                    <button className="flex items-center gap-2 text-primary hover:underline mt-1 group">
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'wght' 500" }}>edit_note</span>
                      <span className="text-sm font-medium">Add Note</span>
                    </button>
                  </div>
                  <button className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0">
                    <span className="material-symbols-outlined text-gray-500 dark:text-text-secondary-dark">more_horiz</span>
                  </button>
                </div>

                {/* Visual Placeholder for Exercise Animation/Image */}
                <div className="aspect-video w-full bg-background-dark rounded-lg flex items-center justify-center my-4">
                  <span className="material-symbols-outlined !text-4xl text-text-secondary-dark">image</span>
                </div>

                <div className="my-4">
                  <textarea
                    className="w-full rounded-lg border-border-dark bg-background-dark text-text-primary-dark placeholder:text-text-secondary-dark focus:ring-primary focus:border-primary"
                    placeholder="Felt a slight pinch in my left knee..."
                    rows={3}
                    value={selectedExercise.notes || ''}
                    onChange={(e) => {
                      setExercises(prev => prev.map(ex => ex.id === selectedExercise.id ? { ...ex, notes: e.target.value } : ex));
                    }}
                  />
                </div>

                {/* Workout Status (Completed/Skipped) */}
                <div className="mb-6 flex flex-col gap-2">
                  <label className="text-text-primary-dark text-lg font-bold">Workout Status</label>
                  <div className="flex gap-4">
                    <button
                      className={`flex-1 py-3 rounded-lg border-2 ${selectedExercise.status === 'Completed' ? 'border-primary bg-primary/10 text-primary' : 'border-border-dark text-text-secondary-dark hover:border-primary/50'}`}
                      onClick={() => handleWorkoutStatusChange(selectedExercise.id, 'Completed')}
                    >
                      Completed
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-lg border-2 ${selectedExercise.status === 'Skipped' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-border-dark text-text-secondary-dark hover:border-red-500/50'}`}
                      onClick={() => handleWorkoutStatusChange(selectedExercise.id, 'Skipped')}
                    >
                      Skipped
                    </button>
                  </div>
                </div>

                {/* Difficulty Rating (1-5 scale) */}
                {selectedExercise.status === 'Completed' && (
                  <div className="mb-6 flex flex-col gap-2">
                    <label className="text-text-primary-dark text-lg font-bold">Difficulty Rating (1-5)</label>
                    <div className="flex justify-between gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          className={`flex-1 py-3 rounded-lg border-2 text-lg font-bold
                            ${selectedExercise.difficulty === rating
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border-dark text-text-secondary-dark hover:border-primary/50'
                            }`}
                          onClick={() => handleDifficultyChange(selectedExercise.id, rating)}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </>
            ) : (
              <div className="flex-grow flex items-center justify-center text-center text-text-secondary-dark">
                <p>Select an exercise from the left to see its details and log sets.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
