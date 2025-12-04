// frontend/app/(auth)/onboarding/__tests__/OnboardingStep3.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingStep3 from '../OnboardingStep3';

describe('OnboardingStep3', () => {
  it('renders correctly and calls onNext and onBack when buttons are clicked', () => {
    const mockOnNext = jest.fn();
    const mockOnBack = jest.fn();
    const mockOnDietaryPreferenceChange = jest.fn();
    const currentDietaryPreferences: string[] = ['vegetarian'];
    const validationError = 'Please select at least one dietary preference.';

    render(
      <OnboardingStep3
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentDietaryPreferences={currentDietaryPreferences}
        onDietaryPreferenceChange={mockOnDietaryPreferenceChange}
        validationError={validationError} // Pass validationError
      />
    );

    expect(screen.getByText('Step 3: Dietary Preferences')).toBeInTheDocument();
    expect(screen.getByLabelText('Vegetarian')).toBeInTheDocument();
    expect(screen.getByLabelText('Vegan')).toBeInTheDocument();
    expect(screen.getByLabelText('Gluten-Free')).toBeInTheDocument();
    expect(screen.getByText(validationError)).toBeInTheDocument(); // Assert error display

    expect(screen.getByLabelText('Vegetarian')).toBeChecked();

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);

    const veganCheckbox = screen.getByLabelText('Vegan');
    fireEvent.click(veganCheckbox);
    expect(mockOnDietaryPreferenceChange).toHaveBeenCalledWith(['vegetarian', 'vegan']);
  });
});
