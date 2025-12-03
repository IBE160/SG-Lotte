import { render, screen, waitFor } from '@testing-library/react';
import HealthCheck from '../HealthCheck';
import { getBackendHealth } from '../../lib/api';

jest.mock('../../lib/api');

const mockGetBackendHealth = getBackendHealth as jest.Mock;

describe('HealthCheck', () => {
  it('displays the backend health message on successful fetch', async () => {
    const mockHealth = { message: 'Welcome to AI Fitness & Meal Planner Backend!' };
    mockGetBackendHealth.mockResolvedValue(mockHealth);

    render(<HealthCheck />);

    await waitFor(() => {
      expect(screen.getByText('Backend Health Check')).toBeInTheDocument();
      expect(screen.getByText(/"message": "Welcome to AI Fitness & Meal Planner Backend!"/)).toBeInTheDocument();
    });
  });

  it('displays an error message on failed fetch', async () => {
    mockGetBackendHealth.mockRejectedValue(new Error('Failed to fetch'));

    render(<HealthCheck />);

    await waitFor(() => {
      expect(screen.getByText('Backend Health Check')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch backend health. Is the backend running?')).toBeInTheDocument();
    });
  });
});
