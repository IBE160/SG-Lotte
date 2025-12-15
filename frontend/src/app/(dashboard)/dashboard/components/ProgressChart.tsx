'use client';

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ProgressChartProps {
  workoutStreak: number;
  weightTrend: Array<[string, number]>; // [date string, weight number]
}

const ProgressChart: React.FC<ProgressChartProps> = ({ workoutStreak, weightTrend }) => {
  const formattedWeightData = weightTrend.map(([date, weight]) => ({
    date,
    weight,
  }));

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Your Progress</h2>

      <div className="mb-6">
        <p className="text-lg">Workout Streak: <span className="font-semibold text-blue-600">{workoutStreak} days</span></p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Weight Trend (Last 30 Days)</h3>
        {formattedWeightData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={formattedWeightData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No weight data yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;
