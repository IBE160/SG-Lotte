// frontend/app/onboarding3/page.tsx
import React, { useState } from 'react';

const Onboarding3: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const handlePersonaSelect = (persona: string) => {
    setSelectedPersona(persona);
  };

  const handleNext = async () => {
    if (selectedPersona) {
      console.log(`Saving fitness persona: ${selectedPersona}`);
      // Simulate API call to backend
      try {
        console.log("Fitness persona saved successfully (simulated). Proceeding to next step...");
        // Here you would typically navigate to the next onboarding screen
      } catch (error) {
        console.error("Error saving fitness persona (simulated):", error);
      }
    } else {
      alert("Please select a fitness persona to proceed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Onboarding - Step 3</h1>
      <p className="mt-3 text-xl">Which fitness persona best describes you?</p>
      <div className="mt-6">
        {['Beginner', 'Intermediate', 'Advanced'].map((persona) => (
          <button
            key={persona}
            className={`px-6 py-2 border rounded-lg mr-2 ${
              selectedPersona === persona ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
            }`}
            onClick={() => handlePersonaSelect(persona)}
          >
            {persona}
          </button>
        ))}
      </div>
      <button
        className="mt-8 px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
        onClick={handleNext}
        disabled={!selectedPersona}
      >
        Next
      </button>
    </div>
  );
};

export default Onboarding3;

