"use client"

import React, { useState } from 'react';

interface MealLoggingCardProps {
  meal_plan_id: number;
  meal_name: string;
  initialStatus?: 'Eaten' | 'Skipped' | null;
}

const MealLoggingCard: React.FC<MealLoggingCardProps> = ({
  meal_plan_id,
  meal_name,
  initialStatus = null,
}) => {
  const [status, setStatus] = useState<"Eaten" | "Skipped" | null>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logMeal = async (newStatus: "Eaten" | "Skipped") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/plans/log/meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meal_plan_id,
          meal_name,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error logging meal: ${response.statusText}`);
      }

      setStatus(newStatus);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = () => {
    if (status === 'Eaten') {
      return <span className="text-green-500">✅ Eaten</span>;
    }
    if (status === 'Skipped') {
      return <span className="text-red-500">❌ Skipped</span>;
    }
    return <span className="text-gray-500">Not Logged</span>;
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-black dark:text-white">{meal_name}</h3>
      <div className="flex items-center gap-2">
        Status: {renderStatus()}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => logMeal('Eaten')}
          disabled={loading || status === 'Eaten'}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading && status !== 'Eaten' ? 'Logging...' : 'Eaten'}
        </button>
        <button
          onClick={() => logMeal('Skipped')}
          disabled={loading || status === 'Skipped'}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {loading && status !== 'Skipped' ? 'Logging...' : 'Skipped'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default MealLoggingCard;
