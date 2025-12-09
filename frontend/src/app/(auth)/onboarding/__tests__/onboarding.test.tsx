import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingPage from '../page';
import { useRouter } from 'next/navigation';
import * as SupabaseClientModule from '@/lib/supabaseClient'; // Use alias for import

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the Supabase client
jest.mock('@/lib/supabaseClient', () => ({ // Use alias for mock
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

const mockPush = jest.fn();
const mockGetSession = SupabaseClientModule.supabase.auth.getSession as jest.Mock;

describe('OnboardingPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
    mockGetSession.mockClear();
    
    // Mock the global fetch function
    global.fetch = jest.fn();
  });

  it('renders Step1 initially and navigates through the flow', async () => {
    render(<OnboardingPage />);

    // Step 1: Fitness Goal
    expect(screen.getByText("What's your primary fitness goal?")).toBeInTheDocument();
    fireEvent.click(screen.getByText('Lose Weight'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 2: Dietary Preferences
    expect(screen.getByText('Any dietary preferences?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Vegan'));
    fireEvent.click(screen.getByText('Gluten-Free'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 3: Fitness Persona
    expect(screen.getByText("What's your fitness level?")).toBeInTheDocument();
    fireEvent.click(screen.getByText('Intermediate'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 4: Workout Frequency
    expect(screen.getByText('How often do you plan to work out?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('3-4 times a week'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 5: Completion
    expect(screen.getByText("You're All Set!")).toBeInTheDocument();
  });

  it('submits data and redirects to dashboard on completion', async () => {
    // Mock successful Supabase session and fetch request
    mockGetSession.mockResolvedValueOnce({
      data: { session: { access_token: 'fake-access-token' } },
      error: null,
    });
    const mockFetch = jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Preferences saved successfully' }),
      } as Response)
    );

    render(<OnboardingPage />);

    // Navigate to Step 5
    fireEvent.click(screen.getByText('Lose Weight'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByText('Vegan'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByText('Intermediate'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByText('3-4 times a week'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i })); // From Step 4

    // Complete Onboarding in Step 5
    fireEvent.click(screen.getByRole('button', { name: /Complete Onboarding/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const expectedPayload = {
        fitnessGoal: 'lose_weight',
        dietaryPreferences: ['vegan'],
        fitnessPersona: 'intermediate',
        workoutFrequency: '3-4_times_week',
      };
      const fetchCallBody = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      
      expect(fetchCallBody.fitnessGoal).toEqual(expectedPayload.fitnessGoal);
      expect(fetchCallBody.dietaryPreferences).toEqual(expect.arrayContaining(expectedPayload.dietaryPreferences));
      expect(fetchCallBody.fitnessPersona).toEqual(expectedPayload.fitnessPersona);
      expect(fetchCallBody.workoutFrequency).toEqual(expectedPayload.workoutFrequency);
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays an error message if saving preferences fails', async () => {
    // Mock successful Supabase session and a failed fetch request
    mockGetSession.mockResolvedValueOnce({
      data: { session: { access_token: 'fake-access-token' } },
      error: null,
    });
    const mockFetch = jest.spyOn(window, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: 'Failed to save preferences' }),
      } as Response)
    );

    render(<OnboardingPage />);

    // Navigate to Step 5
    fireEvent.click(screen.getByText('Lose Weight'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByText('Vegan'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByText('Intermediate'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByText('3-4 times a week'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i })); // From Step 4

    // Complete Onboarding in Step 5
    fireEvent.click(screen.getByRole('button', { name: /Complete Onboarding/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Failed to save preferences')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays an error message if session is missing', async () => {
    // Mock a missing Supabase session
    mockGetSession.mockResolvedValueOnce({
      data: { session: null },
      error: { message: 'User not authenticated' },
    });

    render(<OnboardingPage />);

    // Navigate to Step 5
    fireEvent.click(screen.getByText('Lose Weight'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByText('Vegan'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByText('Intermediate'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByText('3-4 times a week'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i })); // From Step 4

    // Complete Onboarding in Step 5
    fireEvent.click(screen.getByRole('button', { name: /Complete Onboarding/i }));

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalledTimes(1);
      expect(screen.getByText('User not authenticated')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalledWith('/dashboard');
    });
  });
});