// frontend/app/(auth)/onboarding/__tests__/OnboardingStep1.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingStep1 from '../OnboardingStep1';

describe('OnboardingStep1', () => {
  it('renders correctly and calls onNext when button is clicked', () => {
    const mockOnNext = jest.fn();
    render(<OnboardingStep1 onNext={mockOnNext} />);

    expect(screen.getByText('Step 1: Welcome!')).toBeInTheDocument();
    expect(screen.getByText("Let's get started with your personalized fitness and meal plan.")).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });
});
