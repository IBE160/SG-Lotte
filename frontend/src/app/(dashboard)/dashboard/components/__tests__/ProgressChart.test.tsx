import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressChart from '../ProgressChart';

describe('ProgressChart', () => {
  it('renders workout streak correctly', () => {
    render(<ProgressChart workoutStreak={10} weightTrend={[]} />);
    expect(screen.getByText(/Workout Streak: 10 days/i)).toBeInTheDocument();
  });

  it('renders weight trend chart when data exists', () => {
    const weightTrendData = [
      ['2025-11-01', 70.5],
      ['2025-11-02', 70.2],
    ];
    render(<ProgressChart workoutStreak={5} weightTrend={weightTrendData} />);
    // In Recharts, the chart itself is composed of SVG elements.
    // We can't directly assert "chart is visible" without inspecting its internal structure.
    // A common way is to check for specific labels or elements that Recharts renders.
    // For simplicity here, we'll check for the presence of "Weight Trend" heading.
    expect(screen.getByText(/Weight Trend \(Last 30 Days\)/i)).toBeInTheDocument();
    // More robust tests would involve snapshot testing of the SVG or querying for specific SVG elements.
    // For "minimal tests", this is acceptable.
  });

  it('displays "No weight data yet" when weightTrend is empty', () => {
    render(<ProgressChart workoutStreak={0} weightTrend={[]} />);
    expect(screen.getByText(/No weight data yet./i)).toBeInTheDocument();
  });

  it('handles zero workout streak', () => {
    render(<ProgressChart workoutStreak={0} weightTrend={[]} />);
    expect(screen.getByText(/Workout Streak: 0 days/i)).toBeInTheDocument();
  });
});
