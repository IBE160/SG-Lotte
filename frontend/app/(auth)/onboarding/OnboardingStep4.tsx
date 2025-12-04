// frontend/app/(auth)/onboarding/OnboardingStep4.tsx
import React from 'react';

interface OnboardingStep4Props {
  onNext: () => void;
  onBack: () => void;
  currentPersona: string;
  onPersonaChange: (persona: string) => void;
  validationError: string | null; // Add validationError prop
}

const OnboardingStep4: React.FC<OnboardingStep4Props> = ({
  onNext,
  onBack,
  currentPersona,
  onPersonaChange,
  validationError, // Destructure validationError
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 4: Your Fitness Persona</h2>
      <p className="text-gray-300 mb-6">Which best describes your approach to fitness?</p>
      <div className="mb-4">
        <label className="block text-gray-300">
          <input
            type="radio"
            name="fitnessPersona"
            value="casual"
            checked={currentPersona === 'casual'}
            onChange={() => onPersonaChange('casual')}
            className="mr-2"
          />{' '}
          Casual Enthusiast
        </label>
        <label className="block text-gray-300">
          <input
            type="radio"
            name="fitnessPersona"
            value="dedicated"
            checked={currentPersona === 'dedicated'}
            onChange={() => onPersonaChange('dedicated')}
            className="mr-2"
          />{' '}
          Dedicated Trainer
        </label>
        <label className="block text-gray-300">
          <input
            type="radio"
            name="fitnessPersona"
            value="athlete"
            checked={currentPersona === 'athlete'}
            onChange={() => onPersonaChange('athlete')}
            className="mr-2"
          />{' '}
          Aspiring Athlete
        </label>
      </div>
      {/* Display validation error */}
      {validationError && <p className="text-red-500 text-sm mt-2">{validationError}</p>}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OnboardingStep4;
