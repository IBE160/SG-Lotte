// frontend/app/(auth)/onboarding/OnboardingStep3.tsx
import React from 'react';

interface OnboardingStep3Props {
  onNext: () => void;
  onBack: () => void;
  currentDietaryPreferences: string[];
  onDietaryPreferenceChange: (preferences: string[]) => void;
  validationError: string | null; // Add validationError prop
}

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({
  onNext,
  onBack,
  currentDietaryPreferences,
  onDietaryPreferenceChange,
  validationError, // Destructure validationError
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      onDietaryPreferenceChange([...currentDietaryPreferences, value]);
    } else {
      onDietaryPreferenceChange(currentDietaryPreferences.filter((pref) => pref !== value));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 3: Dietary Preferences</h2>
      <p className="text-gray-300 mb-6">Any specific dietary needs or preferences?</p>
      <div className="mb-4">
        <label className="block text-gray-300">
          <input
            type="checkbox"
            name="dietaryPref"
            value="vegetarian"
            checked={currentDietaryPreferences.includes('vegetarian')}
            onChange={handleCheckboxChange}
            className="mr-2"
          />{' '}
          Vegetarian
        </label>
        <label className="block text-gray-300">
          <input
            type="checkbox"
            name="dietaryPref"
            value="vegan"
            checked={currentDietaryPreferences.includes('vegan')}
            onChange={handleCheckboxChange}
            className="mr-2"
          />{' '}
          Vegan
        </label>
        <label className="block text-gray-300">
          <input
            type="checkbox"
            name="dietaryPref"
            value="glutenFree"
            checked={currentDietaryPreferences.includes('glutenFree')}
            onChange={handleCheckboxChange}
            className="mr-2"
          />{' '}
          Gluten-Free
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

export default OnboardingStep3;
