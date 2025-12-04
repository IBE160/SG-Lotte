'use client';

import React, { useState } from 'react';
import OnboardingLayout from './OnboardingLayout';
import WelcomeStep from './WelcomeStep';
import GoalSelection from './GoalSelection';
import DietaryPreferences from './DietaryPreferences';
import PersonaSelection from './PersonaSelection';
import SummaryStep from './SummaryStep';

const totalSteps = 5;

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fitnessGoal, setFitnessGoal] = useState<string | null>(null);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [fitnessPersona, setFitnessPersona] = useState<string | null>(null);

  // Determine if the user can proceed from the current step
  const canProceed = () => {
    switch (currentStep) {
      case 1: // WelcomeStep - always can proceed
        return true;
      case 2: // GoalSelection - requires a goal to be selected
        return !!fitnessGoal;
      case 3: // DietaryPreferences - always can proceed (can select 'None' or leave empty)
        return true;
      case 4: // PersonaSelection - requires a persona to be selected
        return !!fitnessPersona;
      case 5: // SummaryStep - always can proceed (finish)
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === totalSteps) {
      // Submit data to the backend
      console.log('Onboarding complete! Submitting data...', { fitnessGoal, dietaryPreferences, fitnessPersona });
      
      const payload = {
        fitness_goal: fitnessGoal,
        dietary_preferences: dietaryPreferences,
        fitness_persona: fitnessPersona,
      };

      try {
        const response = await fetch('/api/v1/users/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // In a real app, you'd include an Authorization header with a JWT
            // 'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log('User preferences saved successfully!');
          // TODO: Redirect user to dashboard or show success message
        } else {
          const errorData = await response.json();
          console.error('Failed to save user preferences:', errorData);
          // TODO: Display error feedback to the user
        }
      } catch (error) {
        console.error('Error submitting preferences:', error);
        // TODO: Display error feedback to the user
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <GoalSelection onGoalSelect={setFitnessGoal} selectedGoal={fitnessGoal} />;
      case 3:
        return <DietaryPreferences onPreferenceChange={setDietaryPreferences} selectedPreferences={dietaryPreferences} />;
      case 4:
        return <PersonaSelection onPersonaSelect={setFitnessPersona} selectedPersona={fitnessPersona} />;
      case 5:
        return (
          <SummaryStep
            fitnessGoal={fitnessGoal}
            dietaryPreferences={dietaryPreferences}
            fitnessPersona={fitnessPersona}
          />
        );
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onBack={handleBack}
      canProceed={canProceed()}
    >
      {renderStepContent()}
    </OnboardingLayout>
  );
};

export default OnboardingPage;
