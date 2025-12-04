import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DietaryPreferences from '../DietaryPreferences';

describe('DietaryPreferences', () => {
  const mockOnPreferenceChange = jest.fn();

  beforeEach(() => {
    mockOnPreferenceChange.mockClear();
  });

  it('renders correctly with no preferences selected', () => {
    render(<DietaryPreferences onPreferenceChange={mockOnPreferenceChange} selectedPreferences={[]} />);
    expect(screen.getByText('Do you have any dietary preferences?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vegetarian/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /None/i })).toBeInTheDocument();
  });

  it('highlights selected preferences', () => {
    render(<DietaryPreferences onPreferenceChange={mockOnPreferenceChange} selectedPreferences={['Vegan', 'Gluten-Free']} />);
    expect(screen.getByRole('button', { name: /Vegan/i })).toHaveClass('bg-blue-600');
    expect(screen.getByRole('button', { name: /Gluten-Free/i })).toHaveClass('bg-blue-600');
    expect(screen.getByRole('button', { name: /Keto/i })).not.toHaveClass('bg-blue-600');
  });

  it('calls onPreferenceChange with updated preferences when a button is clicked', () => {
    render(<DietaryPreferences onPreferenceChange={mockOnPreferenceChange} selectedPreferences={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /Vegetarian/i }));
    expect(mockOnPreferenceChange).toHaveBeenCalledWith(['Vegetarian']);
  });

  it('removes a preference when an already selected preference is clicked', () => {
    render(<DietaryPreferences onPreferenceChange={mockOnPreferenceChange} selectedPreferences={['Vegetarian']} />);
    fireEvent.click(screen.getByRole('button', { name: /Vegetarian/i }));
    expect(mockOnPreferenceChange).toHaveBeenCalledWith([]);
  });

  it('selects "None" exclusively when no other preferences are selected', () => {
    render(<DietaryPreferences onPreferenceChange={mockOnPreferenceChange} selectedPreferences={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /None/i }));
    expect(mockOnPreferenceChange).toHaveBeenCalledWith(['None']);
  });

  it('selects "None" exclusively, unselecting other preferences', () => {
    render(<DietaryPreferences onPreferenceChange={mockOnPreferenceChange} selectedPreferences={['Vegetarian']} />);
    fireEvent.click(screen.getByRole('button', { name: /None/i }));
    expect(mockOnPreferenceChange).toHaveBeenCalledWith(['None']);
  });

  it('deselects "None" when another preference is selected', () => {
    render(<DietaryPreferences onPreferenceChange={mockOnPreferenceChange} selectedPreferences={['None']} />);
    fireEvent.click(screen.getByRole('button', { name: /Vegetarian/i }));
    expect(mockOnPreferenceChange).toHaveBeenCalledWith(['Vegetarian']);
  });
});
