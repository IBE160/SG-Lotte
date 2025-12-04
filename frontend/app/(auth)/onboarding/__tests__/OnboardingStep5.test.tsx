// frontend/app/(auth)/onboarding/__tests__/OnboardingStep5.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingStep5 from '../OnboardingStep5';

describe('OnboardingStep5', () => {
  it('renders correctly and calls onSubmit and onBack when buttons are clicked', () => {
    const mockOnSubmit = jest.fn();
    const mockOnBack = jest.fn();
    const mockPreferences = {
      fitnessGoal: 'loseWeight',
      dietaryPreferences: ['vegetarian'],
      fitnessPersona: 'dedicated',
    };
    const validationError = 'Please complete all previous steps.';

    render(
      <OnboardingStep5
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        preferences={mockPreferences}
        validationError={validationError} // Pass validationError
      />
    );

    expect(screen.getByText('Step 5: Almost Done!')).toBeInTheDocument();
    expect(screen.getByText('Review your selections and submit to generate your first plan.')).toBeInTheDocument();
    expect(screen.getByText(validationError)).toBeInTheDocument(); // Assert error display

    // Assert parts of the text content within list items
    const fitnessGoalItem = screen.getByText('Fitness Goal:').closest('li');
    expect(fitnessGoalItem).toHaveTextContent('loseWeight');

    const dietaryPreferencesItem = screen.getByText('Dietary Preferences:').closest('li');
    expect(dietaryPreferencesItem).toHaveTextContent('vegetarian');

    const fitnessPersonaItem = screen.getByText('Fitness Persona:').closest('li');
    expect(fitnessPersonaItem).toHaveTextContent('dedicated');


    const submitButton = screen.getByRole('button', { name: /submit & generate plan/i });
    fireEvent.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});