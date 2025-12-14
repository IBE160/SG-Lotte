import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MealLoggingCard from '../MealLoggingCard';

// Mock the fetch API
const mockFetch = jest.spyOn(global, 'fetch');

describe('MealLoggingCard', () => {
  const mealProps = {
    meal_plan_id: 123,
    meal_name: 'Breakfast Smoothie',
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders correctly with initial meal name and "Not Logged" status', () => {
    render(<MealLoggingCard {...mealProps} />);
    expect(screen.getByText('Breakfast Smoothie')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Not Logged')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eaten' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Skipped' })).toBeInTheDocument();
  });

  it('renders with initial "Eaten" status', () => {
    render(<MealLoggingCard {...mealProps} initialStatus="Eaten" />);
    expect(screen.getByText('✅ Eaten')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eaten' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Skipped' })).not.toBeDisabled();
  });

  it('renders with initial "Skipped" status', () => {
    render(<MealLoggingCard {...mealProps} initialStatus="Skipped" />);
    expect(screen.getByText('❌ Skipped')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Skipped' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Eaten' })).not.toBeDisabled();
  });

  it('calls API and updates status to "Eaten" on "Eaten" button click', async () => {
    let resolveFetch: (value: Response | PromiseLike<Response>) => void;
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<MealLoggingCard {...mealProps} />);
    const eatenButton = screen.getByRole('button', { name: 'Eaten' });
    const skippedButton = screen.getByRole('button', { name: 'Skipped' });

    await userEvent.click(eatenButton);

    expect(eatenButton).toHaveTextContent('Logging...');
    expect(eatenButton).toBeDisabled();
    expect(skippedButton).toBeDisabled();

    resolveFetch!({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ message: 'Meal logged as Eaten' }),
    } as Response);

    await waitFor(() => {
      expect(screen.getByText('✅ Eaten')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/api/v1/plans/log/meal', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        meal_plan_id: mealProps.meal_plan_id,
        meal_name: mealProps.meal_name,
        status: 'Eaten',
      }),
    }));
    expect(eatenButton).toHaveTextContent('Eaten');
    expect(eatenButton).toBeDisabled();
    expect(skippedButton).not.toBeDisabled();
  });

  it('calls API and updates status to "Skipped" on "Skipped" button click', async () => {
    let resolveFetch: (value: Response | PromiseLike<Response>) => void;
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<MealLoggingCard {...mealProps} />);
    const eatenButton = screen.getByRole('button', { name: 'Eaten' });
    const skippedButton = screen.getByRole('button', { name: 'Skipped' });

    await userEvent.click(skippedButton);

    expect(skippedButton).toHaveTextContent('Logging...');
    expect(skippedButton).toBeDisabled();
    expect(eatenButton).toBeDisabled();

    resolveFetch!({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ message: 'Meal logged as Skipped' }),
    } as Response);

    await waitFor(() => {
      expect(screen.getByText('❌ Skipped')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/api/v1/plans/log/meal', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        meal_plan_id: mealProps.meal_plan_id,
        meal_name: mealProps.meal_name,
        status: 'Skipped',
      }),
    }));
    expect(skippedButton).toHaveTextContent('Skipped');
    expect(skippedButton).toBeDisabled();
    expect(eatenButton).not.toBeDisabled();
  });

  it('displays error message if API call fails', async () => {
    let resolveFetch: (value: Response | PromiseLike<Response>) => void;
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<MealLoggingCard {...mealProps} />);
    const eatenButton = screen.getByRole('button', { name: 'Eaten' });
    const skippedButton = screen.getByRole('button', { name: 'Skipped' });

    await userEvent.click(eatenButton);

    expect(eatenButton).toHaveTextContent('Logging...');
    expect(eatenButton).toBeDisabled();
    expect(skippedButton).toBeDisabled();

    resolveFetch!({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    await waitFor(() => {
      expect(screen.getByText('Error logging meal: Internal Server Error')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Eaten' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Eaten' })).toHaveTextContent('Eaten');
    expect(screen.getByText('Not Logged')).toBeInTheDocument();
  });

  it('buttons remain disabled during loading and re-enable correctly after success', async () => {
    let resolveFetch: (value: Response | PromiseLike<Response>) => void;
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<MealLoggingCard {...mealProps} />);
    const eatenButton = screen.getByRole('button', { name: 'Eaten' });
    const skippedButton = screen.getByRole('button', { name: 'Skipped' });

    await userEvent.click(eatenButton);

    expect(eatenButton).toHaveTextContent('Logging...');
    expect(eatenButton).toBeDisabled();
    expect(skippedButton).toBeDisabled();

    // Resolve the fetch promise
    resolveFetch!({
      ok: true,
      status: 201,
      json: () => Promise.resolve({}),
    } as Response);

    await waitFor(() => {
      expect(screen.getByText('✅ Eaten')).toBeInTheDocument();
    });

    expect(eatenButton).toBeDisabled();
    expect(skippedButton).not.toBeDisabled();
  });
});
