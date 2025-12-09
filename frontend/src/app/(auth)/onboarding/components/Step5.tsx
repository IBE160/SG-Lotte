'use client';

interface Step5Props {
  onSubmit: (data: Record<string, never>) => void;
  onBack: () => void;
}

export default function Step5({ onSubmit, onBack }: Step5Props) {
  const handleCompleteClick = () => {
    // For now, no data collected in this step
    onSubmit({});
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">You&apos;re All Set!</h2>
      <p className="text-gray-400 text-center">
        Click below to complete your onboarding and get your personalized plan.
      </p>

      {/* Add specific UI elements for this step here based on onboarding5_dark.html */}

      <div className="flex justify-between gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 rounded-lg text-lg font-semibold bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
        >
          Back
        </button>
        <button
          onClick={handleCompleteClick}
          className="flex-1 py-3 px-4 rounded-lg text-lg font-semibold bg-primary text-white hover:bg-primary-dark transition-colors duration-200"
        >
          Complete Onboarding
        </button>
      </div>
    </div>
  );
}
