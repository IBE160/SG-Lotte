'use client';

import { useState } from 'react';

interface Step1Props {
  onNext: (data: { fitnessGoal: string }) => void;
}

export default function Step1({ onNext }: Step1Props) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const fitnessGoals = [
    { id: 'lose_weight', name: 'Lose Weight' },
    { id: 'gain_muscle', name: 'Gain Muscle' },
    { id: 'maintain_health', name: 'Maintain Health' },
    { id: 'improve_endurance', name: 'Improve Endurance' },
  ];

  const handleSelectGoal = (goalId: string) => {
    setSelectedGoal(goalId);
  };

  const handleNextClick = () => {
    if (selectedGoal) {
      onNext({ fitnessGoal: selectedGoal });
    } else {
      // Potentially show an error message to the user
      alert('Please select a fitness goal.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">What&apos;s your primary fitness goal?</h2>
      <p className="text-gray-400 text-center">Choose one that best describes what you want to achieve.</p>

      <div className="grid grid-cols-1 gap-4">
        {fitnessGoals.map((goal) => (
          <button
            key={goal.id}
            className={`
              p-4 rounded-lg border-2 text-left transition-all duration-200
              ${selectedGoal === goal.id
                ? 'border-primary bg-primary/20 text-primary-light'
                : 'border-gray-700 bg-gray-700 hover:border-gray-600 hover:bg-gray-600'
              }
            `}
            onClick={() => handleSelectGoal(goal.id)}
          >
            <h3 className="text-lg font-semibold">{goal.name}</h3>
            {/* Optional: Add a small description for each goal */}
            {/* <p className="text-sm text-gray-500">Description for {goal.name}</p> */}
          </button>
        ))}
      </div>

      <button
        onClick={handleNextClick}
        disabled={!selectedGoal}
        className={`
          w-full py-3 px-4 rounded-lg text-lg font-semibold transition-colors duration-200
          ${selectedGoal
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        Next
      </button>
    </div>
  );
}
