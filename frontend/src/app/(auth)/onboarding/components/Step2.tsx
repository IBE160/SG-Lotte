'use client';

import { useState } from 'react';

interface Step2Props {
  onNext: (data: { dietaryPreferences: string[] }) => void;
  onBack: () => void;
  initialPreferences?: string[];
}

export default function Step2({ onNext, onBack, initialPreferences = [] }: Step2Props) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(initialPreferences);

  const dietaryOptions = [
    { id: 'vegetarian', name: 'Vegetarian' },
    { id: 'vegan', name: 'Vegan' },
    { id: 'gluten_free', name: 'Gluten-Free' },
    { id: 'dairy_free', name: 'Dairy-Free' },
    { id: 'no_nuts', name: 'No Nuts' },
    { id: 'pescatarian', name: 'Pescatarian' },
  ];

  const handleSelectPreference = (preferenceId: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preferenceId)
        ? prev.filter((id) => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  const handleNextClick = () => {
    onNext({ dietaryPreferences: selectedPreferences });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">Any dietary preferences?</h2>
      <p className="text-gray-400 text-center">Select all that apply.</p>

      <div className="grid grid-cols-1 gap-4">
        {dietaryOptions.map((option) => (
          <button
            key={option.id}
            className={`
              p-4 rounded-lg border-2 text-left transition-all duration-200
              ${selectedPreferences.includes(option.id)
                ? 'border-primary bg-primary/20 text-primary-light'
                : 'border-gray-700 bg-gray-700 hover:border-gray-600 hover:bg-gray-600'
              }
            `}
            onClick={() => handleSelectPreference(option.id)}
          >
            <h3 className="text-lg font-semibold">{option.name}</h3>
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
          className="flex-1 py-3 px-4 rounded-lg text-lg font-semibold bg-primary text-white hover:bg-primary-dark transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
