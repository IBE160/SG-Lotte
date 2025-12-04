'use client';

import React from 'react';

interface GoalSelectionProps {
  onGoalSelect: (goal: string) => void;
  selectedGoal: string | null;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ onGoalSelect, selectedGoal }) => {
  const goals = ['Lose Weight', 'Build Muscle', 'Improve Endurance', 'Maintain Health'];

  return (
    <div className="text-white">
      <h3 className="text-xl font-semibold mb-4 text-center">What is your primary fitness goal?</h3>
      <div className="grid grid-cols-1 gap-4">
        {goals.map((goal) => (
          <button
            key={goal}
            onClick={() => onGoalSelect(goal)}
            className={`p-4 rounded-lg text-lg font-medium transition-colors duration-200 
              ${selectedGoal === goal ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {goal}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GoalSelection;
