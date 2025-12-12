// frontend/src/app/(auth)/signup/__tests__/page.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SignUpPage from '../page';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Supabase client
const mockSignUp = jest.fn();
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: mockSignUp,
    },
  })),
}));

const mockPush = jest.fn();

describe('SignUpPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders the signup form correctly', () => {
    render(<SignUpPage />);
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows a success message on successful signup', async () => {
    const user = userEvent.setup();
    // Mock a successful signup
    mockSignUp.mockResolvedValueOnce({
      data: { user: { id: '123' } },
      error: null,
    });

    render(<SignUpPage />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for the success message to appear
    expect(
      await screen.findByText(/registration successful! please check your email to verify your account./i)
    ).toBeInTheDocument();

    expect(mockSignUp).toHaveBeenCalledTimes(1);
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      options: {
        emailRedirectTo: expect.any(String),
      },
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows an error message if signup fails', async () => {
    const user = userEvent.setup();
    // Mock a failed signup
    mockSignUp.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'User already registered' },
    });

    render(<SignUpPage />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for the error message to appear
    expect(await screen.findByText(/user already registered/i)).toBeInTheDocument();
    expect(mockSignUp).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });
});