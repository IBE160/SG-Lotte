// frontend/e2e/__tests__/dashboard.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '../../src/app/(dashboard)/dashboard/page';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(() => Promise.resolve({
        data: {
          session: {
            access_token: 'mock_access_token',
            user: { id: 'mock_user_id' },
          },
        },
        error: null,
      })),
    },
  })),
}));

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      workout_plan: {
        plan: [
          {
            day: 'Monday',
            focus: 'Full Body Strength',
            exercises: [
              { name: 'Squats', sets: 3, reps: '8-10' },
              { name: 'Push-ups', sets: 3, reps: '10-12' },
            ],
          },
        ],
      },
      meal_plan: {
        plan: [
          {
            day: 'Monday',
            meal_type: 'Breakfast',
            items: [{ name: 'Oatmeal', calories: 300 }],
          },
          {
            day: 'Monday',
            meal_type: 'Lunch',
            items: [{ name: 'Chicken Salad', calories: 400 }],
          },
        ],
      },
    }),
  }) as Promise<Response>
);

describe('DashboardPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Generating your personalized plan.../i)).toBeInTheDocument();
  });

  it('renders plan data after successful fetch', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/Your Daily Plan - Monday/i)).toBeInTheDocument();
      expect(screen.getByText(/Workout/i)).toBeInTheDocument();
      expect(screen.getByText(/Focus: Full Body Strength/i)).toBeInTheDocument();
      expect(screen.getByText(/Squats/i)).toBeInTheDocument();
      expect(screen.getByText(/Push-ups/i)).toBeInTheDocument();
      expect(screen.getByText(/Meals/i)).toBeInTheDocument();
      expect(screen.getByText(/Breakfast/i)).toBeInTheDocument();
      expect(screen.getByText(/Oatmeal/i)).toBeInTheDocument();
      expect(screen.getByText(/Lunch/i)).toBeInTheDocument();
      expect(screen.getByText(/Chicken Salad/i)).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/plans/generate-initial', expect.any(Object));
  });

  it('renders error message on fetch failure', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: 'Network error' }),
      })
    );

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('renders no plan message if fetch returns empty data', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(null),
      })
    );

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/No plan available./i)).toBeInTheDocument();
    });
  });

  it('handles unauthenticated user by throwing error', async () => {
    // Mock getSession to return no session
    const { createClient } = require('@supabase/supabase-js');
    createClient.mockImplementationOnce(() => ({
      auth: {
        getSession: jest.fn(() => Promise.resolve({
          data: { session: null },
          error: new Error('No session'),
        })),
      },
    }));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      expect(screen.getByText(/User not authenticated./i)).toBeInTheDocument();
    });
  });
});
