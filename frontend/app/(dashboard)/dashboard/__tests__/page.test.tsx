// frontend/app/(dashboard)/dashboard/__tests__/page.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '../page';
import { useRouter } from 'next/navigation';
import { usePlan } from '@/hooks/usePlan';
import { useToast } from '@/components/ui/Toast';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the usePlan hook
jest.mock('@/hooks/usePlan', () => ({
  usePlan: jest.fn(),
}));

// Mock the useToast hook
jest.mock('@/components/ui/Toast', () => ({
  useToast: jest.fn(),
}));

describe('DashboardPage', () => {
  const mockPush = jest.fn();
  const mockGeneratePlan = jest.fn();
  const mockShowInfo = jest.fn();
  const mockShowError = jest.fn();
  const mockShowSuccess = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (usePlan as jest.Mock).mockReturnValue({
      plan: undefined,
      isLoading: false,
      isError: undefined,
      generatePlan: mockGeneratePlan,
    });
    (useToast as jest.Mock).mockReturnValue({
      showInfo: mockShowInfo,
      showError: mockShowError,
      showSuccess: mockShowSuccess,
    });
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (usePlan as jest.Mock).mockReturnValueOnce({
      plan: undefined,
      isLoading: true,
      isError: undefined,
      generatePlan: mockGeneratePlan,
    });
    render(<DashboardPage />);
    expect(screen.getByText('Loading your plan...')).toBeInTheDocument();
  });

  it('renders error state and allows retry', async () => {
    (usePlan as jest.Mock).mockReturnValueOnce({
      plan: undefined,
      isLoading: false,
      isError: new Error('Failed to fetch'),
      generatePlan: mockGeneratePlan,
    });
    render(<DashboardPage />);
    expect(screen.getByText('Error loading plan: Failed to fetch')).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: /try to generate plan/i }));
    await waitFor(() => expect(mockShowInfo).toHaveBeenCalledWith('Generating your personalized plan...'));
    await waitFor(() => expect(mockGeneratePlan).toHaveBeenCalledTimes(1));
  });

  it('renders no plan state and allows generation', async () => {
    render(<DashboardPage />);
    expect(screen.getByText('No plan found. Let\'s generate one for you!')).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: /generate my first plan/i }));
    await waitFor(() => expect(mockShowInfo).toHaveBeenCalledWith('Generating your personalized plan...'));
    await waitFor(() => expect(mockGeneratePlan).toHaveBeenCalledTimes(1));
  });

  it('displays generated plan for today', () => {
    const mockPlan = {
      workout_plan: {
        plan_name: "Morning Blast",
        sessions: [
          { day_of_week: "Monday", focus: "Full Body", exercises: [{ name: "Squats", sets: 3, reps: "10", rest_time_seconds: 60 }] },
          { day_of_week: new Date().toLocaleString('en-us', { weekday: 'long' }), focus: "Cardio", exercises: [{ name: "Running", sets: 1, reps: "30 min", rest_time_seconds: 0 }] },
        ]
      },
      meal_plan: {
        plan_name: "Healthy Eating",
        daily_plans: [
          { day_of_week: "Tuesday", meals: [{ name: "Lunch", items: [{ name: "Salad", quantity: "1", unit: "bowl" }] }] },
          { day_of_week: new Date().toLocaleString('en-us', { weekday: 'long' }), meals: [{ name: "Breakfast", items: [{ name: "Oats", quantity: "1", unit: "cup" }] }] },
        ]
      },
      user_id: "test",
      generated_at: "now"
    };

    (usePlan as jest.Mock).mockReturnValueOnce({
      plan: mockPlan,
      isLoading: false,
      isError: undefined,
      generatePlan: mockGeneratePlan,
    });
    render(<DashboardPage />);
    
    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
    expect(screen.getByText(`Your Personalized Plan - ${today}`)).toBeInTheDocument();
    expect(screen.getByText('Workout Focus: Cardio')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('Meals for Today')).toBeInTheDocument();
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Oats')).toBeInTheDocument();
  });

  it('shows error toast if plan generation fails', async () => {
    (usePlan as jest.Mock).mockReturnValueOnce({
      plan: undefined,
      isLoading: false,
      isError: undefined,
      generatePlan: mockGeneratePlan,
    });
    mockGeneratePlan.mockRejectedValue(new Error('AI is busy'));

    render(<DashboardPage />);
    fireEvent.click(screen.getByRole('button', { name: /generate my first plan/i }));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith('Failed to generate plan: AI is busy'));
  });

  it('shows success toast if plan generation succeeds', async () => {
    (usePlan as jest.Mock).mockReturnValueOnce({
      plan: undefined,
      isLoading: false,
      isError: undefined,
      generatePlan: mockGeneratePlan,
    });
    mockGeneratePlan.mockResolvedValue(mock_ai_plan_response); // Assuming successful generation returns data

    render(<DashboardPage />);
    fireEvent.click(screen.getByRole('button', { name: /generate my first plan/i }));

    await waitFor(() => expect(mockShowSuccess).toHaveBeenCalledWith('Your plan has been generated successfully!'));
  });
});
