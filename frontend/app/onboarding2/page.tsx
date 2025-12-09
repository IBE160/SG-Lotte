// frontend/app/onboarding2/page.tsx
import React, { useState } from 'react';

const Onboarding2: React.FC = () => {
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null);

  const handleDietSelect = (diet: string) => {
    setSelectedDiet(diet);
  };

  const handleNext = async () => {
    if (selectedDiet) {
      console.log(`Saving dietary preferences: ${selectedDiet}`);
      // Simulate API call to backend
      try {
        console.log("Dietary preferences saved successfully (simulated). Proceeding to next step...");
        // Here you would typically navigate to the next onboarding screen
      } catch (error) {
        console.error("Error saving dietary preferences (simulated):", error);
      }
    } else {
      alert("Please select your dietary preferences to proceed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Onboarding - Step 2</h1>
      <p className="mt-3 text-xl">What are your dietary preferences?</p>
      <div className="mt-6">
        {['Vegetarian', 'Vegan', 'Ketogenic', 'No Restrictions'].map((diet) => (
          <button
            key={diet}
            className={`px-6 py-2 border rounded-lg mr-2 ${
              selectedDiet === diet ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
            }`}
            onClick={() => handleDietSelect(diet)}
          >
            {diet}
          </button>
        ))}
      </div>
      <button
        className="mt-8 px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
        onClick={handleNext}
        disabled={!selectedDiet}
      >
        Next
      </button>
    </div>
  );
};

export default Onboarding2;

