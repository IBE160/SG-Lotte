'use client';

import { useState } from 'react';

interface Step3Props {
  onNext: (data: { fitnessPersona: string }) => void;
  onBack: () => void;
  initialPersona?: string;
}

export default function Step3({ onNext, onBack, initialPersona = null }: Step3Props) {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(initialPersona);

  const personaOptions = [
    { id: 'beginner', name: 'Beginner', description: 'New to fitness or getting back into it.' },
    { id: 'intermediate', name: 'Intermediate', description: 'Regularly active and comfortable with workouts.' },
    { id: 'advanced', name: 'Advanced', description: 'Highly active and seeking intense challenges.' },
  ];

  const handleSelectPersona = (personaId: string) => {
    setSelectedPersona(personaId);
  };

  const handleNextClick = () => {
    if (selectedPersona) {
      onNext({ fitnessPersona: selectedPersona });
    } else {
      alert('Please select your fitness persona.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">What&apos;s your fitness level?</h2>
      <p className="text-gray-400 text-center">This helps us tailor your plan.</p>

      <div className="grid grid-cols-1 gap-4">
        {personaOptions.map((persona) => (
          <button
            key={persona.id}
            className={`
              p-4 rounded-lg border-2 text-left transition-all duration-200
              ${selectedPersona === persona.id
                ? 'border-primary bg-primary/20 text-primary-light'
                : 'border-gray-700 bg-gray-700 hover:border-gray-600 hover:bg-gray-600'
              }
            `}
            onClick={() => handleSelectPersona(persona.id)}
          >
            <h3 className="text-lg font-semibold">{persona.name}</h3>
            <p className="text-sm text-gray-400">{persona.description}</p>
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
          disabled={!selectedPersona}
          className={`
            flex-1 py-3 px-4 rounded-lg text-lg font-semibold transition-colors duration-200
            ${selectedPersona
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
