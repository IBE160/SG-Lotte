// frontend/app/(auth)/onboarding/page.tsx
'use client';

import React, { useState } from 'react';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import OnboardingStep5 from './OnboardingStep5';
import { useRouter } from 'next/navigation';
import { supabase, updateUserPreferences } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast'; // Import useToast

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { showSuccess, showError } = useToast(); // Use the toast hook
  const [preferences, setPreferences] = useState<{
    fitnessGoal: string;
    dietaryPreferences: string[];
    fitnessPersona: string;
  }>({
    fitnessGoal: '',
    dietaryPreferences: [],
    fitnessPersona: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<number, string | null>>({});

  const validateStep = (step: number): boolean => {
    let isValid = true;
    let errorMessage: string | null = null;

    switch (step) {
      case 1:
        // No specific validation for step 1 yet, as it's just a welcome screen.
        // If we add inputs to step 1, validation would go here.
        break;
      case 2:
        if (!preferences.fitnessGoal) {
          isValid = false;
          errorMessage = 'Please select your primary fitness goal.';
        }
        break;
      case 3:
        // Allow no selection for dietary preferences if user has none.
        // If we wanted to enforce selection, logic would go here.
        break;
      case 4:
        if (!preferences.fitnessPersona) {
          isValid = false;
          errorMessage = 'Please select your fitness persona.';
        }
        break;
      case 5:
        // Step 5 is review, validation happens on previous steps
        break;
      default:
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [step]: errorMessage }));
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
    setValidationErrors((prev) => ({ ...prev, [currentStep]: null })); // Clear error when going back
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    // Clear validation error for the current step as soon as a change is made
    setValidationErrors((prev) => ({ ...prev, [currentStep]: null }));
  };

  const handleSubmit = async () => {
    // Re-validate all steps before final submission
    let allStepsValid = true;
    for (let i = 2; i <= 4; i++) { // Steps 2, 3, 4 require validation
        if (!validateStep(i)) {
            allStepsValid = false;
            // Optionally, navigate back to the first invalid step or show a general error
            // For now, we'll just show the error on the current step if it's invalid.
        }
    }
    if (!allStepsValid) {
        showError('Please complete all required fields in previous steps.');
        return;
    }


    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('No active session found or error getting session:', sessionError?.message);
      showError('Please log in again to save your preferences.');
      router.push('/login'); // Redirect to login page
      return;
    }

    try {
      await updateUserPreferences(session.user.id, preferences);
      console.log('Preferences submitted:', preferences);
      showSuccess('Onboarding complete! Preferences saved successfully.');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error saving preferences:', error.message);
      showError(`Error saving preferences: ${error.message}`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 onNext={handleNext} />;
      case 2:
        return (
          <OnboardingStep2
            onNext={handleNext}
            onBack={handleBack}
            currentGoal={preferences.fitnessGoal}
            onGoalChange={(goal) => handlePreferenceChange('fitnessGoal', goal)}
            validationError={validationErrors[2]}
          />
        );
      case 3:
        return (
          <OnboardingStep3
            onNext={handleNext}
            onBack={handleBack}
            currentDietaryPreferences={preferences.dietaryPreferences}
            onDietaryPreferenceChange={(prefs) => handlePreferenceChange('dietaryPreferences', prefs)}
            validationError={validationErrors[3]}
          />
        );
      case 4:
        return (
          <OnboardingStep4
            onNext={handleNext}
            onBack={handleBack}
            currentPersona={preferences.fitnessPersona}
            onPersonaChange={(persona) => handlePreferenceChange('fitnessPersona', persona)}
            validationError={validationErrors[4]}
          />
        );
      case 5:
        return (
          <OnboardingStep5
            onSubmit={handleSubmit}
            onBack={handleBack}
            preferences={preferences}
            validationError={validationErrors[5]}
          />
        );
      default:
        return <OnboardingStep1 onNext={handleNext} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        {renderStep()}
        {validationErrors[currentStep] && (
          <p className="text-red-500 text-center mt-4">{validationErrors[currentStep]}</p>
        )}
      </div>
      <div className="mt-4 text-gray-400">Step {currentStep} of 5</div>
    </div>
  );
}
