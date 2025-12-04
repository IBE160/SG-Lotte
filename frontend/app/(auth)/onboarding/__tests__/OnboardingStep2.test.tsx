// frontend/app/(auth)/onboarding/__tests__/OnboardingStep2.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingStep2 from '../OnboardingStep2';

describe('OnboardingStep2', () => {
  it('renders correctly and calls onNext and onBack when buttons are clicked', () => {
    const mockOnNext = jest.fn();
    const mockOnBack = jest.fn();
    const mockOnGoalChange = jest.fn();
    const currentGoal = '';
    const validationError = 'Please select a goal.';

    render(
      <OnboardingStep2
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentGoal={currentGoal}
        onGoalChange={mockOnGoalChange}
        validationError={validationError}
      />
    );

    expect(screen.getByText('Step 2: Your Primary Fitness Goal')).toBeInTheDocument();
    expect(screen.getByLabelText('Lose Weight')).toBeInTheDocument();
    expect(screen.getByLabelText('Gain Muscle')).toBeInTheDocument();
    expect(screen.getByLabelText('Improve Endurance')).toBeInTheDocument();
    expect(screen.getByText(validationError)).toBeInTheDocument(); // Assert error display

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('calls onGoalChange when a radio button is selected', () => {
    const mockOnGoalChange = jest.fn();
    render(
      <OnboardingStep2
        onNext={() => {}}
        onBack={() => {}}
        currentGoal=""
        onGoalChange={mockOnGoalChange}
        validationError={null}
      />
    );

    fireEvent.click(screen.getByLabelText('Gain Muscle'));
    expect(mockOnGoalChange).toHaveBeenCalledWith('gainMuscle');
  });
});