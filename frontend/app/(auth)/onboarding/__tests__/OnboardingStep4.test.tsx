// frontend/app/(auth)/onboarding/__tests__/OnboardingStep4.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingStep4 from '../OnboardingStep4';

describe('OnboardingStep4', () => {
  it('renders correctly and calls onNext and onBack when buttons are clicked', () => {
    const mockOnNext = jest.fn();
    const mockOnBack = jest.fn();
    const mockOnPersonaChange = jest.fn();
    const currentPersona = '';
    const validationError = 'Please select your fitness persona.';

    render(
      <OnboardingStep4
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentPersona={currentPersona}
        onPersonaChange={mockOnPersonaChange}
        validationError={validationError} // Pass validationError
      />
    );

    expect(screen.getByText('Step 4: Your Fitness Persona')).toBeInTheDocument();
    expect(screen.getByLabelText('Casual Enthusiast')).toBeInTheDocument();
    expect(screen.getByLabelText('Dedicated Trainer')).toBeInTheDocument();
    expect(screen.getByLabelText('Aspiring Athlete')).toBeInTheDocument();
    expect(screen.getByText(validationError)).toBeInTheDocument(); // Assert error display

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('calls onPersonaChange when a radio button is selected', () => {
    const mockOnPersonaChange = jest.fn();
    render(
      <OnboardingStep4
        onNext={() => {}}
        onBack={() => {}}
        currentPersona=""
        onPersonaChange={mockOnPersonaChange}
        validationError={null}
      />
    );

    fireEvent.click(screen.getByLabelText('Dedicated Trainer'));
    expect(mockOnPersonaChange).toHaveBeenCalledWith('dedicated');
  });
});