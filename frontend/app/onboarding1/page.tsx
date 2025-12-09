// frontend/app/onboarding1/page.tsx
import React, { useState } from 'react';

const Onboarding1: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
  };

  const handleNext = async () => {
    if (selectedGoal) {
      console.log(`Saving fitness goal: ${selectedGoal}`);
      // Simulate API call to backend
      try {
        // In a real application, you would send this to your backend API
        // For now, we just log and simulate success
        console.log("Fitness goal saved successfully (simulated). Proceeding to next step...");
        // Here you would typically navigate to the next onboarding screen
      } catch (error) {
        console.error("Error saving fitness goal (simulated):", error);
      }
    } else {
      alert("Please select a fitness goal to proceed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Welcome to Onboarding - Step 1</h1>
      <p className="mt-3 text-xl">What is your primary fitness goal?</p>
      <div className="mt-6">
        {['Lose Weight', 'Gain Muscle', 'Improve Endurance'].map((goal) => (
          <button
            key={goal}
            className={`px-6 py-2 border rounded-lg mr-2 ${
              selectedGoal === goal ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
            }`}
            onClick={() => handleGoalSelect(goal)}
          >
            {goal}
          </button>
        ))}
      </div>
      <button
        className="mt-8 px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
        onClick={handleNext}
        disabled={!selectedGoal}
      >
        Next
      </button>
    </div>
  );
};

export default Onboarding1;

