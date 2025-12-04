import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingPage from '../page'; // Assuming 'page.tsx' is the component

// Mock fetch API to prevent actual network requests during tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'User preferences saved successfully.' }),
  }) as Promise<Response>
);

describe('OnboardingPage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders WelcomeStep initially and navigates to next steps', async () => {
    render(<OnboardingPage />);

    // Step 1: WelcomeStep
    expect(screen.getByText('Welcome to Your AI Fitness & Meal Planner!')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 2: GoalSelection
    expect(screen.getByText('What is your primary fitness goal?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Build Muscle/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 3: DietaryPreferences
    expect(screen.getByText('Do you have any dietary preferences?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Vegetarian/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 4: PersonaSelection
    expect(screen.getByText('Which fitness persona best describes you?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Advanced/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 5: SummaryStep
    expect(screen.getByText('Summary of Your Preferences')).toBeInTheDocument();
    expect(screen.getByText('Fitness Goal:').closest('p')).toHaveTextContent('Build Muscle');
    expect(screen.getByText('Dietary Preferences:').closest('p')).toHaveTextContent('Vegetarian');
    expect(screen.getByText('Fitness Persona:').closest('p')).toHaveTextContent('Advanced');

    // Click Finish button
    fireEvent.click(screen.getByRole('button', { name: /Finish/i }));

    // Verify fetch was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/users/preferences', expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fitness_goal: 'Build Muscle',
          dietary_preferences: ['Vegetarian'],
          fitness_persona: 'Advanced',
        }),
      }));
    });
  });

  it('Back button navigates to previous step', () => {
    render(<OnboardingPage />);

    // Navigate to Step 2
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('What is your primary fitness goal?')).toBeInTheDocument();

    // Click Back
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(screen.getByText('Welcome to Your AI Fitness & Meal Planner!')).toBeInTheDocument();
  });

  it('Next button is disabled if current step input is not complete', () => {
    render(<OnboardingPage />);
    fireEvent.click(screen.getByRole('button', { name: /Next/i })); // Go to GoalSelection

    // Next button should be disabled as no goal is selected
    const nextButton = screen.getByRole('button', { name: /Next/i });
    expect(nextButton).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /Lose Weight/i })); // Select a goal
    expect(nextButton).toBeEnabled();
  });
});
