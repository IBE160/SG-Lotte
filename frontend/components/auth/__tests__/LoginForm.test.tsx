import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';

// Mock the supabase client
jest.mock('@/lib/supabase', () => ({
  createSupabaseBrowserClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ data: {}, error: null }),
    },
  })),
}));

describe('LoginForm', () => {
  it('renders the form', () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

it('calls the signInWithPassword function on successful submission', async () => {
    const assign = jest.spyOn(window.location, 'assign').mockImplementation();

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
      expect(assign).toHaveBeenCalledWith('/dashboard');
    });
  });
});
