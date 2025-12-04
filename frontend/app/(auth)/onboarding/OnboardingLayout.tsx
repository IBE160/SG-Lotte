'use client';

import React from 'react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  canProceed,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Onboarding - Step {currentStep} of {totalSteps}</h2>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6">
          {children}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onBack}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {currentStep === totalSteps ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
