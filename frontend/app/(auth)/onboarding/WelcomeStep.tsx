'use client';

import React from 'react';

const WelcomeStep: React.FC = () => {
  return (
    <div className="text-white text-center">
      <h3 className="text-2xl font-bold mb-4">Welcome to Your AI Fitness & Meal Planner!</h3>
      <p className="text-lg mb-6">
        Let's get you set up to generate your first personalized plan.
      </p>
      <p className="text-md">
        We'll ask a few questions to understand your goals and preferences.
      </p>
    </div>
  );
};

export default WelcomeStep;
