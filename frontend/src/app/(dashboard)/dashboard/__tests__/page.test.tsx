import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import DashboardPage from '../page';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the global fetch function
global.fetch = jest.fn();

const mockRouter = {
  push: jest.fn(),
  // Add other router methods if needed by the component
};

describe('DashboardPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (fetch as jest.Mock).mockClear();
    mockRouter.push.mockClear();
  });

  it('renders loading state initially', () => {
    (fetch as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolve to keep in loading state
    render(<DashboardPage />);
    expect(screen.getByText(/loading your personalized plan/i)).toBeInTheDocument();
  });

  it('displays error message and a button to go to onboarding if fetch fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Network error' }),
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/error: network error/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /go to onboarding to generate plan/i })).toBeInTheDocument();
  });

  it('displays "No plan found" and a button to go to onboarding if no plan data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // Empty response
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/no plan found\. please generate your first plan/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /go to onboarding to generate plan/i })).toBeInTheDocument();
  });

  it('renders workout and meal plans when data is provided', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        workout_plan: {
          days: [{ day: 'Monday', focus: 'Chest', exercises: [{ name: 'Pushups', sets: 3, reps: '10' }] }],
        },
        meal_plan: {
          days: [{ day: 'Monday', meals: [{ type: 'Breakfast', description: 'Oatmeal' }] }],
        },
      }),
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/your personalized plan/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/workout plan/i)).toBeInTheDocument();
    expect(screen.getByText(/meal plan/i)).toBeInTheDocument();
    expect(screen.getByText(/monday - chest/i)).toBeInTheDocument();
    expect(screen.getByText(/pushups:/i)).toBeInTheDocument();
    expect(screen.getByText(/breakfast:/i)).toBeInTheDocument();
  });

  it('redirects to onboarding when "Go to Onboarding" button is clicked', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // No plan found scenario
    });

    render(<DashboardPage />);

    await waitFor(() => {
      screen.getByRole('button', { name: /go to onboarding to generate plan/i }).click();
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/onboarding');
  });
});
