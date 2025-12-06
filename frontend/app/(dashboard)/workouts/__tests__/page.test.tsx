// frontend/app/(dashboard)/workouts/__tests__/page.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkoutLogPage from '../page';

// Mock the next/link component as it's used in the WorkoutLogPage
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('WorkoutLogPage Component Tests', () => {
  // Mock the global fetch function to prevent actual API calls during component tests
  const mockFetch = jest.fn();
  beforeAll(() => {
    global.fetch = mockFetch;
  });

  beforeEach(() => {
    mockFetch.mockClear();
    // Clear console spies to avoid interference between tests
    jest.spyOn(console, 'log').mockRestore();
    jest.spyOn(console, 'warn').mockRestore();
  });

  it('renders the workout log page with initial elements', () => {
    render(<WorkoutLogPage />);

    // Check for sidebar elements
    expect(screen.getByText('Alex Chen')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Workout Log')).toBeInTheDocument();

    // Check for main content header
    expect(screen.getByRole('heading', { name: /leg day/i })).toBeInTheDocument();
    expect(screen.getByText(/october 26, 2023/i)).toBeInTheDocument();

    // Check for exercises in the list
    expect(screen.getByText('Barbell Squat')).toBeInTheDocument();
    expect(screen.getByText('Leg Press')).toBeInTheDocument();
    expect(screen.getByText('Lunges')).toBeInTheDocument();

    // Check for the "Save Workout" button
    expect(screen.getByRole('button', { name: /save workout/i })).toBeInTheDocument();
  });

  it('displays details for a selected exercise', () => {
    render(<WorkoutLogPage />);

    // By default, Barbell Squat is selected. Check its details.
    expect(screen.getByRole('heading', { name: /barbell squat/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByLabelText(/reps/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/weight \(kg\)/i, { selector: 'input' })).toBeInTheDocument();
  });

  it('allows marking a workout as Completed and shows difficulty rating', () => {
    render(<WorkoutLogPage />);

    // Select Leg Press
    fireEvent.click(screen.getByText(/leg press/i));

    // Mark as Completed
    fireEvent.click(screen.getByRole('button', { name: /completed/i }));
    expect(screen.getByRole('button', { name: /completed/i })).toHaveClass('border-primary'); // Verify active style

    // Check if difficulty rating appears
    expect(screen.getByText(/difficulty rating \(1-5\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument(); // Example rating button
  });

  it('allows marking a workout as Skipped and hides difficulty rating', () => {
    render(<WorkoutLogPage />);

    // Select Barbell Squat (initially completed with difficulty)
    fireEvent.click(screen.getByText('Barbell Squat'));

    // Mark as Skipped
    fireEvent.click(screen.getByRole('button', { name: /skipped/i }));
    expect(screen.getByRole('button', { name: /skipped/i })).toHaveClass('border-red-500'); // Verify active style

    // Check if difficulty rating disappears
    expect(screen.queryByText(/difficulty rating \(1-5\)/i)).not.toBeInTheDocument();
  });

  it('allows setting a difficulty rating for a completed workout', () => {
    render(<WorkoutLogPage />);

    // Select Leg Press
    fireEvent.click(screen.getByText(/leg press/i));

    // Mark as Completed
    fireEvent.click(screen.getByRole('button', { name: /completed/i }));

    // Set difficulty to 5
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    expect(screen.getByRole('button', { name: '5' })).toHaveClass('border-primary'); // Verify active style
    expect(screen.getByRole('button', { name: '4' })).not.toHaveClass('border-primary'); // Ensure only one is active
  });

  it('should call handleSaveWorkout when Save Workout button is clicked', async () => {
    render(<WorkoutLogPage />);

    // Spy on console.log which is used in handleSaveWorkout
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button', { name: /save workout/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Simulating API call to log workout:',
        expect.objectContaining({
          workout_plan_id: '1', // Default selected
          status: 'Completed',
          difficulty_rating: 4,
        })
      );
    });
    consoleSpy.mockRestore();
  });
});
