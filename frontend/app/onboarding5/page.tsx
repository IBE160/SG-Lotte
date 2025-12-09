// frontend/app/onboarding5/page.tsx
import React, { useState } from 'react';

const Onboarding5: React.FC = () => {
  const [height, setHeight] = useState<number | null>(null);

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Number(event.target.value));
  };

  const handleCompleteOnboarding = async () => {
    if (height) {
      console.log(`Saving height: ${height} cm. Completing onboarding.`);
      // Simulate API call to backend to save all collected preferences
      try {
        console.log("All onboarding preferences saved successfully (simulated). Onboarding complete!");
        // Here you would typically navigate to the dashboard
      } catch (error) {
        console.error("Error saving height (simulated):", error);
      }
    } else {
      alert("Please enter your height to complete onboarding.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Onboarding - Step 5</h1>
      <p className="mt-3 text-xl">What is your height (in cm)?</p>
      <div className="mt-6">
        <input
          type="number"
          placeholder="e.g., 175"
          className="px-4 py-2 border rounded-lg text-black"
          value={height || ''}
          onChange={handleHeightChange}
        />
      </div>
      <button
        className="mt-8 px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
        onClick={handleCompleteOnboarding}
        disabled={!height}
      >
        Complete Onboarding
      </button>
    </div>
  );
};

export default Onboarding5;

