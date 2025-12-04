// frontend/app/(auth)/onboarding/OnboardingStep1.tsx
import React from 'react';

interface OnboardingStep1Props {
  onNext: () => void;
  // Add state/props for preferences if needed
}

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ onNext }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 1: Welcome!</h2>
      <p className="text-gray-300 mb-6">Let's get started with your personalized fitness and meal plan.</p>
      {/* Add input fields for basic user info if necessary, as per wireframes */}
      <div className="flex justify-end">
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

export default OnboardingStep1;
