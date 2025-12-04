import React from 'react';
import { render, screen } from '@testing-library/react';
import WelcomeStep from '../WelcomeStep';

describe('WelcomeStep', () => {
  it('renders the welcome message correctly', () => {
    render(<WelcomeStep />);
    expect(screen.getByText('Welcome to Your AI Fitness & Meal Planner!')).toBeInTheDocument();
    expect(screen.getByText('Let\'s get you set up to generate your first personalized plan.')).toBeInTheDocument();
    expect(screen.getByText('We\'ll ask a few questions to understand your goals and preferences.')).toBeInTheDocument();
  });
});
