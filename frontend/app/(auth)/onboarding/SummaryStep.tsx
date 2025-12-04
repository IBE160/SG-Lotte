'use client';

import React from 'react';

interface SummaryStepProps {
  fitnessGoal: string | null;
  dietaryPreferences: string[];
  fitnessPersona: string | null;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ fitnessGoal, dietaryPreferences, fitnessPersona }) => {
  return (
    <div className="text-white">
      <h3 className="text-xl font-semibold mb-4 text-center">Summary of Your Preferences</h3>
      <div className="space-y-3">
        <p className="text-lg"><strong>Fitness Goal:</strong> {fitnessGoal || 'Not selected'}</p>
        <p className="text-lg"><strong>Dietary Preferences:</strong> {dietaryPreferences.length > 0 ? dietaryPreferences.join(', ') : 'None'}</p>
        <p className="text-lg"><strong>Fitness Persona:</strong> {fitnessPersona || 'Not selected'}</p>
      </div>
      <p className="mt-6 text-center text-lg">
        Click "Finish" to generate your personalized plan!
      </p>
    </div>
  );
};

export default SummaryStep;
