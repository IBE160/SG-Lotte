// frontend/app/onboarding4/page.tsx
import React, { useState } from 'react';

const Onboarding4: React.FC = () => {
  const [weight, setWeight] = useState<number | null>(null);

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(Number(event.target.value));
  };

  const handleNext = async () => {
    if (weight) {
      console.log(`Saving weight: ${weight} kg`);
      // Simulate API call to backend
      try {
        console.log("Weight saved successfully (simulated). Proceeding to next step...");
        // Here you would typically navigate to the next onboarding screen
      } catch (error) {
        console.error("Error saving weight (simulated):", error);
      }
    } else {
      alert("Please enter your weight to proceed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Onboarding - Step 4</h1>
      <p className="mt-3 text-xl">What is your current weight (in kg)?</p>
      <div className="mt-6">
        <input
          type="number"
          placeholder="e.g., 70"
          className="px-4 py-2 border rounded-lg text-black"
          value={weight || ''}
          onChange={handleWeightChange}
        />
      </div>
      <button
        className="mt-8 px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
        onClick={handleNext}
        disabled={!weight}
      >
        Next
      </button>
    </div>
  );
};

export default Onboarding4;
