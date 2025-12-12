import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingPage from '../page';
import { createClient } from '@/lib/supabase/client'; // Import actual Supabase client
import { useRouter } from 'next/navigation';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => ({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            email_confirmed_at: new Date().toISOString(), // Mock as confirmed
          },
        },
        error: null,
      })),
      getSession: jest.fn(() => ({
        data: {
          session: {
            access_token: 'mock-access-token',
          },
        },
        error: null,
      })),
    },
  })),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Success' }),
  } as Response)
);

describe('OnboardingPage', () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    // Reset mocks before each test
    (createClient as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders Step 1 initially and navigates to Step 2', async () => {
    render(<OnboardingPage />);

    // Check for Step 1 content
    await waitFor(() => {
      expect(screen.getByText('What is your primary fitness goal?')).toBeInTheDocument();
    });

    // Simulate selection and navigation
    fireEvent.click(screen.getByText('Lose Weight')); // Assuming 'Lose Weight' is an option
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Check for Step 2 content
    await waitFor(() => {
      expect(screen.getByText('What are your dietary preferences?')).toBeInTheDocument();
    });
  });

  it('navigates through all steps and submits data', async () => {
    render(<OnboardingPage />);

    // Step 1
    await waitFor(() => {
      expect(screen.getByText('What is your primary fitness goal?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Lose Weight'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 2
    await waitFor(() => {
      expect(screen.getByText('What are your dietary preferences?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Vegetarian'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 3
    await waitFor(() => {
      expect(screen.getByText('Choose your fitness persona.')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Athlete'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 4 (Review)
    await waitFor(() => {
      expect(screen.getByText('Review your choices.')).toBeInTheDocument();
    });
    // Find the list items and assert their text content
    const reviewListItems = screen.getAllByRole('listitem');
    expect(reviewListItems[0]).toHaveTextContent(/Fitness goal:\s*lose weight/i);
    expect(reviewListItems[1]).toHaveTextContent(/Dietary preference:\s*vegetarian/i);
    expect(reviewListItems[2]).toHaveTextContent(/Fitness persona:\s*athlete/i);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 5 (Finish)
    await waitFor(() => {
      expect(screen.getByText('Ready to finish?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Finish Onboarding/i }));

    // Verify API call was made
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/users/profile/', expect.objectContaining({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-access-token',
        },
        body: JSON.stringify({
          fitness_goal: 'lose-weight',
          dietary_preference: 'vegetarian',
          fitness_persona: 'athlete',
        }),
      }));
    });

    // Verify redirection
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects to login if user is not authenticated', async () => {
    (createClient as jest.Mock).mockReturnValueOnce({
      auth: {
        getUser: jest.fn(() => ({ data: { user: null }, error: null })),
      },
    });

    render(<OnboardingPage />);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('redirects to login with message if email is not confirmed', async () => {
    (createClient as jest.Mock).mockReturnValueOnce({
      auth: {
        getUser: jest.fn(() => ({
          data: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
              email_confirmed_at: null, // Mock as unconfirmed
            },
          },
          error: null,
        })),
      },
    });

    render(<OnboardingPage />);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login?message=Please verify your email first.');
    });
  });

  it('allows going back to previous steps', async () => {
    render(<OnboardingPage />);

    // Navigate to Step 2
    await waitFor(() => {
      expect(screen.getByText('What is your primary fitness goal?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Lose Weight'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    await waitFor(() => {
      expect(screen.getByText('What are your dietary preferences?')).toBeInTheDocument();
    });

    // Go back to Step 1
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));

    await waitFor(() => {
      expect(screen.getByText('What is your primary fitness goal?')).toBeInTheDocument();
    });
  });
});
