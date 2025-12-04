import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GoalSelection from '../GoalSelection';

describe('GoalSelection', () => {
  const mockOnGoalSelect = jest.fn();

  beforeEach(() => {
    mockOnGoalSelect.mockClear();
  });

  it('renders correctly with no goal selected', () => {
    render(<GoalSelection onGoalSelect={mockOnGoalSelect} selectedGoal={null} />);
    expect(screen.getByText('What is your primary fitness goal?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Lose Weight/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Build Muscle/i })).toBeInTheDocument();
  });

  it('highlights the selected goal', () => {
    render(<GoalSelection onGoalSelect={mockOnGoalSelect} selectedGoal="Build Muscle" />);
    const buildMuscleButton = screen.getByRole('button', { name: /Build Muscle/i });
    expect(buildMuscleButton).toHaveClass('bg-blue-600');
  });

  it('calls onGoalSelect with the correct goal when a button is clicked', () => {
    render(<GoalSelection onGoalSelect={mockOnGoalSelect} selectedGoal={null} />);
    const loseWeightButton = screen.getByRole('button', { name: /Lose Weight/i });
    fireEvent.click(loseWeightButton);
    expect(mockOnGoalSelect).toHaveBeenCalledTimes(1);
    expect(mockOnGoalSelect).toHaveBeenCalledWith('Lose Weight');
  });
});
