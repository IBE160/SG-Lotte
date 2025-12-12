// frontend/src/app/(auth)/login/__tests__/page.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginPage from '../page';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Supabase client
const mockSignInWithPassword = jest.fn();
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  })),
}));

const mockPush = jest.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('calls Supabase sign-in and redirects on successful login', async () => {
    const user = userEvent.setup();
    // Mock a successful login
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: { id: '123' }, session: { access_token: 'abc' } },
      error: null,
    });

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows an error message if login fails', async () => {
    const user = userEvent.setup();
    // Mock a failed login
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    // Wait for the error message to appear
    expect(await screen.findByText(/invalid login credentials/i)).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});