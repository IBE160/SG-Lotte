'use client';

import { useState } from 'react';

interface Step4Props {
  onNext: (data: { workoutFrequency: string }) => void;
  onBack: () => void;
  initialFrequency?: string;
}

export default function Step4({ onNext, onBack, initialFrequency = null }: Step4Props) {
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(initialFrequency);

  const frequencyOptions = [
    { id: '1-2_times_week', name: '1-2 times a week', description: 'Just getting started.' },
    { id: '3-4_times_week', name: '3-4 times a week', description: 'A regular routine.' },
    { id: '5-plus_times_week', name: '5+ times a week', description: 'A dedicated enthusiast.' },
  ];

  const handleSelectFrequency = (frequencyId: string) => {
    setSelectedFrequency(frequencyId);
  };

  const handleNextClick = () => {
    if (selectedFrequency) {
      onNext({ workoutFrequency: selectedFrequency });
    } else {
      alert('Please select your workout frequency.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">How often do you plan to work out?</h2>
      <p className="text-gray-400 text-center">This helps us set a realistic and effective schedule.</p>

      <div className="grid grid-cols-1 gap-4">
        {frequencyOptions.map((option) => (
          <button
            key={option.id}
            className={`
              p-4 rounded-lg border-2 text-left transition-all duration-200
              ${selectedFrequency === option.id
                ? 'border-primary bg-primary/20 text-primary-light'
                : 'border-gray-700 bg-gray-700 hover:border-gray-600 hover:bg-gray-600'
              }
            `}
            onClick={() => handleSelectFrequency(option.id)}
          >
            <h3 className="text-lg font-semibold">{option.name}</h3>
            <p className="text-sm text-gray-400">{option.description}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 rounded-lg text-lg font-semibold bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
        >
          Back
        </button>
        <button
          onClick={handleNextClick}
          disabled={!selectedFrequency}
          className={`
            flex-1 py-3 px-4 rounded-lg text-lg font-semibold transition-colors duration-200
            ${selectedFrequency
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
}
