import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PersonaSelection from '../PersonaSelection';

describe('PersonaSelection', () => {
  const mockOnPersonaSelect = jest.fn();

  beforeEach(() => {
    mockOnPersonaSelect.mockClear();
  });

  it('renders correctly with no persona selected', () => {
    render(<PersonaSelection onPersonaSelect={mockOnPersonaSelect} selectedPersona={null} />);
    expect(screen.getByText('Which fitness persona best describes you?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Beginner/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Advanced/i })).toBeInTheDocument();
  });

  it('highlights the selected persona', () => {
    render(<PersonaSelection onPersonaSelect={mockOnPersonaSelect} selectedPersona="Intermediate" />);
    const intermediateButton = screen.getByRole('button', { name: /Intermediate/i });
    expect(intermediateButton).toHaveClass('bg-blue-600');
  });

  it('calls onPersonaSelect with the correct persona when a button is clicked', () => {
    render(<PersonaSelection onPersonaSelect={mockOnPersonaSelect} selectedPersona={null} />);
    const beginnerButton = screen.getByRole('button', { name: /Beginner/i });
    fireEvent.click(beginnerButton);
    expect(mockOnPersonaSelect).toHaveBeenCalledTimes(1);
    expect(mockOnPersonaSelect).toHaveBeenCalledWith('Beginner');
  });
});
