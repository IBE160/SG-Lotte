import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import { supabase } from '../../../../lib/supabaseClient'; // Import supabase client

interface OnboardingFormData {
  fitnessGoal?: string;
  dietaryPreferences?: string[];
  fitnessPersona?: string;
  workoutFrequency?: string;
  // Add other potential fields from future steps here
  // [key: string]: any; // Allow for flexible data as steps are added
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
    // For now, just console log, actual navigation and API calls will be implemented later
    console.log('Next step with data:', { ...formData, ...data });
    // Simulate navigation for now
    // router.push(`/onboarding/${currentStep + 1}`);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    // router.push(`/onboarding/${currentStep - 1}`);
  };

  const handleSubmit = async (data: Partial<OnboardingFormData>) => {
    setLoading(true);
    setError(null);
    const finalFormData = { ...formData, ...data };
    console.log('Onboarding complete with data:', finalFormData);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error(sessionError?.message || 'User not authenticated.');
      }

      const response = await fetch('/api/v1/onboarding/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save preferences.');
      }

      console.log('Preferences saved successfully!');

      // Step 2: Trigger AI Plan Generation
      const generatePlanResponse = await fetch('/api/v1/plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!generatePlanResponse.ok) {
        const errorData = await generatePlanResponse.json();
        throw new Error(errorData.detail || 'Failed to generate plan.');
      }

      console.log('Plan generated successfully!');
      router.push('/dashboard'); // Redirect to dashboard on success

    } catch (err: unknown) {
      console.error('Error saving preferences:', (err as Error).message);
      setError((err as Error).message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {currentStep === 1 && <Step1 onNext={handleNext} />}
        {currentStep === 2 && <Step2 onNext={handleNext} onBack={handleBack} initialPreferences={formData.dietaryPreferences} />}
        {currentStep === 3 && <Step3 onNext={handleNext} onBack={handleBack} initialPersona={formData.fitnessPersona} />}
        {currentStep === 4 && <Step4 onNext={handleNext} onBack={handleBack} initialFrequency={formData.workoutFrequency} />}
        {currentStep === 5 && <Step5 onSubmit={handleSubmit} onBack={handleBack} />}
        {loading && <div className="text-center text-primary mt-4">Saving preferences...</div>}
      </div>
    </div>
  );
}
