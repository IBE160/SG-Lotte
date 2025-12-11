'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import QuestionPrompt from './components/QuestionPrompt';
import SelectionControls from './components/SelectionControls';

// Example data for selection controls
const fitnessGoalOptions = [
  { value: 'lose-weight', label: 'Lose Weight' },
  { value: 'build-muscle', label: 'Build Muscle' },
  { value: 'stay-fit', label: 'Stay Fit' },
  { value: 'improve-endurance', label: 'Improve Endurance' },
];

const dietaryPreferenceOptions = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'ketogenic', label: 'Ketogenic' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'none', label: 'No Specific Preference' },
];

const fitnessPersonaOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'athlete', label: 'Athlete' },
  { value: 'casual', label: 'Casual Exerciser' },
];

interface StepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData: any;
}

const Step1: React.FC<StepProps> = ({ onNext, initialData }) => {
  const [selectedGoal, setSelectedGoal] = useState(initialData.fitnessGoal || '');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <QuestionPrompt question="What is your primary fitness goal?" />
      <SelectionControls
        options={fitnessGoalOptions}
        selectedValue={selectedGoal}
        onSelect={setSelectedGoal}
      />
      <button
        onClick={() => onNext({ fitnessGoal: selectedGoal })}
        disabled={!selectedGoal}
        className="px-6 py-3 bg-blue-600 rounded-md text-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

const Step2: React.FC<StepProps> = ({ onNext, onBack, initialData }) => {
  const [selectedDiet, setSelectedDiet] = useState(initialData.dietaryPreference || '');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <QuestionPrompt question="What are your dietary preferences?" />
      <SelectionControls
        options={dietaryPreferenceOptions}
        selectedValue={selectedDiet}
        onSelect={setSelectedDiet}
      />
      <div className="flex gap-4 mt-8">
        <button onClick={onBack} className="px-6 py-3 bg-gray-700 rounded-md text-lg">
          Back
        </button>
        <button
          onClick={() => onNext({ dietaryPreference: selectedDiet })}
          disabled={!selectedDiet}
          className="px-6 py-3 bg-blue-600 rounded-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Step3: React.FC<StepProps> = ({ onNext, onBack, initialData }) => {
  const [selectedPersona, setSelectedPersona] = useState(initialData.fitnessPersona || '');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <QuestionPrompt question="Choose your fitness persona." />
      <SelectionControls
        options={fitnessPersonaOptions}
        selectedValue={selectedPersona}
        onSelect={setSelectedPersona}
      />
      <div className="flex gap-4 mt-8">
        <button onClick={onBack} className="px-6 py-3 bg-gray-700 rounded-md text-lg">
          Back
        </button>
        <button
          onClick={() => onNext({ fitnessPersona: selectedPersona })}
          disabled={!selectedPersona}
          className="px-6 py-3 bg-blue-600 rounded-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Step4: React.FC<StepProps> = ({ onNext, onBack, initialData }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    <QuestionPrompt question="Review your choices." />
    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md my-6">
      <h2 className="text-xl font-semibold mb-4">Collected Preferences:</h2>
      {Object.keys(initialData).length > 0 ? (
        <ul className="list-disc list-inside space-y-2">
          {Object.entries(initialData).map(([key, value]) => (
            <li key={key}>
              <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {String(value).replace(/-/g, ' ')}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No preferences selected yet.</p>
      )}
    </div>
    <div className="flex gap-4 mt-8">
      <button onClick={onBack} className="px-6 py-3 bg-gray-700 rounded-md text-lg">
        Back
      </button>
      <button onClick={() => onNext({})} className="px-6 py-3 bg-blue-600 rounded-md text-lg">
        Next
      </button>
    </div>
  </div>
);

const Step5: React.FC<StepProps & { onFinish: (data: any) => void }> = ({ onFinish, onBack, initialData }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    <QuestionPrompt question="Ready to finish?" />
    <p className="mb-8 text-center">Confirm your preferences to generate your personalized plan.</p>
    <div className="flex gap-4 mt-8">
      <button onClick={onBack} className="px-6 py-3 bg-gray-700 rounded-md text-lg">
        Back
      </button>
      <button onClick={() => onFinish(initialData)} className="px-6 py-3 bg-green-600 rounded-md text-lg">
        Finish Onboarding
      </button>
    </div>
  </div>
);

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else if (!user.email_confirmed_at) {
        router.push('/login?message=Please verify your email first.');
      } else {
        setUser(user);
        setLoading(false);
      }
    };

    checkUser();
  }, [router, supabase]);

  const handleNext = (data: any) => {
    setOnboardingData((prev: any) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async (finalData: any) => {
    setIsSubmitting(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error('Failed to get Supabase session:', sessionError?.message);
        alert('Authentication error. Please log in again.');
        router.push('/login');
        return;
      }

      // Prepare data for backend - ensure keys match expected API payload
      const payload = {
        fitness_goal: finalData.fitnessGoal,
        dietary_preference: finalData.dietaryPreference,
        fitness_persona: finalData.fitnessPersona,
      };

      const response = await fetch('/api/v1/users/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend API error:', errorData);
        throw new Error(errorData.detail || 'Failed to save onboarding preferences.');
      }

      console.log('Onboarding preferences saved successfully!', finalData);
      alert('Onboarding complete! Your preferences have been saved.');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error during onboarding submission:', error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isSubmitting) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        {isSubmitting ? 'Saving preferences...' : 'Loading...'}
      </div>
    );
  }

  if (user && user.email_confirmed_at) {
    switch (step) {
      case 1:
        return <Step1 onNext={handleNext} initialData={onboardingData} />;
      case 2:
        return <Step2 onNext={handleNext} onBack={handleBack} initialData={onboardingData} />;
      case 3:
        return <Step3 onNext={handleNext} onBack={handleBack} initialData={onboardingData} />;
      case 4:
        return <Step4 onNext={handleNext} onBack={handleBack} initialData={onboardingData} />;
      case 5:
        return <Step5 onFinish={handleFinish} onBack={handleBack} initialData={onboardingData} />;
      default:
        return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">Error: Invalid step</div>;
    }
  }

  return null;
}