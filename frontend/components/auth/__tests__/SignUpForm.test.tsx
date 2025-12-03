import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';

// Mock the supabase client
jest.mock('@/lib/supabase', () => ({
  createSupabaseBrowserClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn().mockResolvedValue({ data: {}, error: null }),
    },
  })),
}));

describe('SignUpForm', () => {
  it('renders the form', () => {
    render(<SignUpForm />);
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('shows an error if passwords do not match', async () => {
    render(<SignUpForm />);
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Passwords do not match.');
    });
  });

  it('shows an error if password is too short', async () => {
    render(<SignUpForm />);
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Password must be at least 6 characters long.');
    });
  });

  it('calls the signUp function on successful submission', async () => {
    render(<SignUpForm />);
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const signUpButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      const { createSupabaseBrowserClient } = require('@/lib/supabase');
      const mockSupabase = createSupabaseBrowserClient();
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    await screen.findByText('Please check your email to verify your account.');
  });
});
