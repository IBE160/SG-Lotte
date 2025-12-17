"use client";

import { useState, useEffect } from "react";
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // State to hold the user object

  useEffect(() => {
    async function getUserAndProfile() {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        setError("Failed to get user information.");
        setLoading(false);
        return;
      }
      
      setUser(user);

      if (user) {
        try {
          const response = await fetch("/api/v1/users/profile/", { // Added trailing slash
            credentials: "include" // Use credentials: "include"
          });
          if (!response.ok) {
            throw new Error("Failed to fetch profile");
          }
          const data = await response.json();
          setFitnessGoal(data.fitness_goal || "");
          setDietaryPreferences(data.dietary_preferences || "");
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        // Optionally redirect to login if no user
        // router.push('/login'); 
      }
    }
    getUserAndProfile();
  }, []); // Empty dependency array means this runs once on mount

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    if (!user) {
      setError("No user logged in to save profile.");
      return;
    }
    
    try {
      const response = await fetch("/api/v1/users/profile/", { // Added trailing slash
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Use credentials: "include"
        body: JSON.stringify({
          fitness_goal: fitnessGoal,
          dietary_preferences: dietaryPreferences,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is found after loading, display a message or redirect
  if (!user) {
    return <div className="container mx-auto p-4">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      {success && (
        <p className="text-green-500 mb-4">{success}</p>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="fitnessGoal" className="block mb-1 text-sm font-medium text-gray-700">Fitness Goal</label>
          <input
            id="fitnessGoal"
            value={fitnessGoal}
            onChange={(e) => setFitnessGoal(e.target.value)}
            placeholder="e.g., 'Build muscle', 'Lose weight'"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="dietaryPreferences" className="block mb-1 text-sm font-medium text-gray-700">Dietary Preferences</label>
          <input
            id="dietaryPreferences"
            value={dietaryPreferences}
            onChange={(e) => setDietaryPreferences(e.target.value)}
            placeholder="e.g., 'Vegetarian', 'Low-carb'"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Save Changes
        </button>
      </div>
    </div>
  );
}