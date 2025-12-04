// frontend/app/(auth)/onboarding/OnboardingStep5.tsx
import React from 'react';

interface OnboardingStep5Props {
  onSubmit: () => void;
  onBack: () => void;
  preferences: {
    fitnessGoal: string;
    dietaryPreferences: string[];
    fitnessPersona: string;
  };
  validationError: string | null; // Add validationError prop
}

const OnboardingStep5: React.FC<OnboardingStep5Props> = ({ onSubmit, onBack, preferences, validationError }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 5: Almost Done!</h2>
      <p className="text-gray-300 mb-6">Review your selections and submit to generate your first plan.</p>
      <ul className="text-gray-300 mb-6 list-disc list-inside">
        <li>
          <strong>Fitness Goal:</strong> {preferences.fitnessGoal || 'Not selected'}
        </li>
        <li>
          <strong>Dietary Preferences:</strong>{' '}
          {preferences.dietaryPreferences.length > 0
            ? preferences.dietaryPreferences.join(', ')
            : 'None selected'}
        </li>
        <li>
          <strong>Fitness Persona:</strong> {preferences.fitnessPersona || 'Not selected'}
        </li>
      </ul>
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
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit & Generate Plan
        </button>
      </div>
    </div>
  );
};

export default OnboardingStep5;
