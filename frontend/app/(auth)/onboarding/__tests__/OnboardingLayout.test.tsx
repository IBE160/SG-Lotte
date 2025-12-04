import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingLayout from '../OnboardingLayout';

describe('OnboardingLayout', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    mockOnBack.mockClear();
  });

  it('renders correctly with given props', () => {
    render(
      <OnboardingLayout
        currentStep={1}
        totalSteps={3}
        onNext={mockOnNext}
        onBack={mockOnBack}
        canProceed={true}
      >
        <div>Test Content</div>
      </OnboardingLayout>
    );

    expect(screen.getByText('Onboarding - Step 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Next/i })).toBeEnabled();
  });

  it('calls onNext when Next button is clicked and canProceed is true', () => {
    render(
      <OnboardingLayout
        currentStep={1}
        totalSteps={3}
        onNext={mockOnNext}
        onBack={mockOnBack}
        canProceed={true}
      >
        <div>Test Content</div>
      </OnboardingLayout>
    );
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when Back button is clicked and not on first step', () => {
    render(
      <OnboardingLayout
        currentStep={2}
        totalSteps={3}
        onNext={mockOnNext}
        onBack={mockOnBack}
        canProceed={true}
      >
        <div>Test Content</div>
      </OnboardingLayout>
    );
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('Next button is disabled if canProceed is false', () => {
    render(
      <OnboardingLayout
        currentStep={1}
        totalSteps={3}
        onNext={mockOnNext}
        onBack={mockOnBack}
        canProceed={false}
      >
        <div>Test Content</div>
      </OnboardingLayout>
    );
    expect(screen.getByRole('button', { name: /Next/i })).toBeDisabled();
  });

  it('Next button text changes to Finish on the last step', () => {
    render(
      <OnboardingLayout
        currentStep={3}
        totalSteps={3}
        onNext={mockOnNext}
        onBack={mockOnBack}
        canProceed={true}
      >
        <div>Test Content</div>
      </OnboardingLayout>
    );
    expect(screen.getByRole('button', { name: /Finish/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Finish/i })).toBeEnabled();
  });
});
