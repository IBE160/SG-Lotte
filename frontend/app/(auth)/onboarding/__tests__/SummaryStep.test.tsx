import React from 'react';
import { render, screen } from '@testing-library/react';
import SummaryStep from '../SummaryStep';

describe('SummaryStep', () => {
  it('renders correctly with all preferences provided', () => {
    const props = {
      fitnessGoal: 'Build Muscle',
      dietaryPreferences: ['Vegetarian', 'Gluten-Free'],
      fitnessPersona: 'Intermediate',
    };
    render(<SummaryStep {...props} />);

    expect(screen.getByText('Summary of Your Preferences')).toBeInTheDocument();
    expect(screen.getByText('Fitness Goal:')).toBeInTheDocument();
    expect(screen.getByText('Build Muscle')).toBeInTheDocument();
    expect(screen.getByText('Dietary Preferences:')).toBeInTheDocument();
    expect(screen.getByText('Vegetarian, Gluten-Free')).toBeInTheDocument();
    expect(screen.getByText('Fitness Persona:')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
  });

    it('renders correctly with no preferences provided', () => {
      const props = {
        fitnessGoal: null,
        dietaryPreferences: [],
        fitnessPersona: null,
      };
      render(<SummaryStep {...props} />);

      const fitnessGoalParent = screen.getByText('Fitness Goal:').closest('p');
      expect(fitnessGoalParent).toHaveTextContent('Not selected');

      const dietaryPreferencesParent = screen.getByText('Dietary Preferences:').closest('p');
      expect(dietaryPreferencesParent).toHaveTextContent('None');

      const fitnessPersonaParent = screen.getByText('Fitness Persona:').closest('p');
      expect(fitnessPersonaParent).toHaveTextContent('Not selected');
    });

  it('renders correctly with a single dietary preference', () => {
    const props = {
      fitnessGoal: 'Lose Weight',
      dietaryPreferences: ['Keto'],
      fitnessPersona: 'Beginner',
    };
    render(<SummaryStep {...props} />);
    expect(screen.getByText('Keto')).toBeInTheDocument();
  });
});
