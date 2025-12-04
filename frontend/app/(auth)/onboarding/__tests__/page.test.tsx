// frontend/app/(auth)/onboarding/__tests__/page.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingPage from '../page';

// Mock the useRouter hook with only the push method
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock the entire @/lib/supabase module to prevent actual calls and errors
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
  updateUserPreferences: jest.fn(),
}));

// Mock the useToast hook
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();
jest.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
    showWarning: jest.fn(),
    showInfo: jest.fn(),
  }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Import supabase and updateUserPreferences AFTER mocking
import { supabase, updateUserPreferences } from '@/lib/supabase';

describe('OnboardingPage Navigation and Validation', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockShowSuccess.mockClear();
    mockShowError.mockClear();
    (supabase.auth.getSession as jest.Mock).mockClear();
    (updateUserPreferences as jest.Mock).mockClear();

    // Mock a successful session for handleSubmit
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: 'test_user_id' } } },
      error: null,
    });

    // Mock successful update for updateUserPreferences
    (updateUserPreferences as jest.Mock).mockResolvedValue({
      user: { id: 'test_user_id', user_metadata: {} },
    });
  });

  it('renders Step 1 initially and navigates through steps when valid', async () => {
    render(<OnboardingPage />);

    // Step 1
    expect(screen.getByText('Step 1: Welcome!')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Move to Step 2

    // Step 2: Validate selection, then proceed
    expect(screen.getByText('Step 2: Your Primary Fitness Goal')).toBeInTheDocument();
    expect(screen.queryByText('Please select your primary fitness goal.')).not.toBeInTheDocument(); // No error initially

    // Try to go next without selection - should stay on step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Please select your primary fitness goal.')).toBeInTheDocument(); // Error appears
    expect(screen.getByText('Step 2: Your Primary Fitness Goal')).toBeInTheDocument(); // Still on step 2

    // Select an option, then proceed
    fireEvent.click(screen.getByLabelText('Lose Weight'));
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Move to Step 3

    // Step 3: Validate selection, then proceed
    expect(screen.getByText('Step 3: Dietary Preferences')).toBeInTheDocument();
    expect(screen.queryByText('Please select at least one dietary preference, or none if applicable.')).not.toBeInTheDocument();

    // The validation for dietary preferences now allows no selection, so it should proceed
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Move to Step 4

    // Step 4: Validate selection, then proceed
    expect(screen.getByText('Step 4: Your Fitness Persona')).toBeInTheDocument();
    expect(screen.queryByText('Please select your fitness persona.')).not.toBeInTheDocument();

    // Try to go next without selection - should stay on step 4
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Please select your fitness persona.')).toBeInTheDocument();
    expect(screen.getByText('Step 4: Your Fitness Persona')).toBeInTheDocument();

    // Select an option, then proceed
    fireEvent.click(screen.getByLabelText('Dedicated Trainer'));
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Move to Step 5

    // Step 5
    expect(screen.getByText('Step 5: Almost Done!')).toBeInTheDocument();

    // Go back
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText('Step 4: Your Fitness Persona')).toBeInTheDocument();
  });

  it('navigates to dashboard on final step submission when valid', async () => {
    render(<OnboardingPage />);

    // Navigate to Step 5 with valid selections
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Step 1
    fireEvent.click(screen.getByLabelText('Lose Weight')); // Select for Step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    // Step 3 allows no selection, so just navigate
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByLabelText('Dedicated Trainer')); // Select for Step 4
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Move to Step 5

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /submit & generate plan/i }));
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(mockShowSuccess).toHaveBeenCalledWith('Onboarding complete! Preferences saved successfully.');
  });

  it('handles error during preference submission', async () => {
    (updateUserPreferences as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<OnboardingPage />);

    // Navigate to Step 5 with valid selections
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Step 1
    fireEvent.click(screen.getByLabelText('Lose Weight')); // Select for Step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Step 3
    fireEvent.click(screen.getByLabelText('Dedicated Trainer')); // Select for Step 4
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Move to Step 5

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /submit & generate plan/i }));
    });

    expect(mockShowError).toHaveBeenCalledWith('Error saving preferences: API Error');
    expect(mockPush).not.toHaveBeenCalledWith('/dashboard'); // Should not navigate on error
  });

  it('redirects to login if no session is found', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    render(<OnboardingPage />);

    // Navigate to Step 5 with valid selections
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Step 1
    fireEvent.click(screen.getByLabelText('Lose Weight')); // Select for Step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Step 3
    fireEvent.click(screen.getByLabelText('Dedicated Trainer')); // Select for Step 4
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Move to Step 5

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /submit & generate plan/i }));
    });

    expect(mockShowError).toHaveBeenCalledWith('Please log in again to save your preferences.');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('prevents submission if not all required steps are validated', async () => {
    render(<OnboardingPage />);

    // Navigate to Step 5 without completing Step 2 validation
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Step 1
    // Skip selection for Step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Try to move to Step 3 - will fail
    expect(screen.getByText('Please select your primary fitness goal.')).toBeInTheDocument();

    // Force navigate to Step 5 (for testing purpose, normally prevented)
    await act(async () => {
        setCurrentStep(5);
    });
    render(<OnboardingPage />); // Re-render after state change

    // Ensure state is updated correctly for test
    fireEvent.click(screen.getByRole('button', { name: /submit & generate plan/i }));

    expect(mockShowError).toHaveBeenCalledWith('Please complete all required fields in previous steps.');
    expect(mockPush).not.toHaveBeenCalled();
  });
});
