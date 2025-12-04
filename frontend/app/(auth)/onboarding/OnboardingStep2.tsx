// frontend/app/(auth)/onboarding/OnboardingStep2.tsx
import React from 'react';

interface OnboardingStep2Props {
  onNext: () => void;
  onBack: () => void;
  currentGoal: string;
  onGoalChange: (goal: string) => void;
  validationError: string | null; // Add validationError prop
}

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({
  onNext,
  onBack,
  currentGoal,
  onGoalChange,
  validationError, // Destructure validationError
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 2: Your Primary Fitness Goal</h2>
      <p className="text-gray-300 mb-6">What is your main goal?</p>
      <div className="mb-4">
        <label className="block text-gray-300">
          <input
            type="radio"
            name="fitnessGoal"
            value="loseWeight"
            checked={currentGoal === 'loseWeight'}
            onChange={() => onGoalChange('loseWeight')}
            className="mr-2"
          />{' '}
          Lose Weight
        </label>
        <label className="block text-gray-300">
          <input
            type="radio"
            name="fitnessGoal"
            value="gainMuscle"
            checked={currentGoal === 'gainMuscle'}
            onChange={() => onGoalChange('gainMuscle')}
            className="mr-2"
          />{' '}
          Gain Muscle
        </label>
        <label className="block text-gray-300">
          <input
            type="radio"
            name="fitnessGoal"
            value="improveEndurance"
            checked={currentGoal === 'improveEndurance'}
            onChange={() => onGoalChange('improveEndurance')}
            className="mr-2"
          />{' '}
          Improve Endurance
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

export default OnboardingStep2;
