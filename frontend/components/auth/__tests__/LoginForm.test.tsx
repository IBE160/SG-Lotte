import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { useRouter } from 'next/navigation';

// Mock the supabase client
jest.mock('@/lib/supabase', () => ({
  createSupabaseBrowserClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { email: 'test@example.com' } }, error: null }),
      getSession: jest.fn().mockResolvedValue({ data: { session: { user: { email: 'test@example.com' } } }, error: null }),
    },
  })),
}));

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginForm', () => {
  it('renders the form', () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('calls the signInWithPassword function on successful submission and redirects', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<LoginForm />);
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      const { createSupabaseBrowserClient } = require('@/lib/supabase');
      const mockSupabase = createSupabaseBrowserClient();
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(pushMock).toHaveBeenCalledWith('/dashboard');
    });
  });
});
