import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SignupForm from '../SignupForm';
import '@testing-library/jest-dom';
import { supabase } from '@/lib/supabase'; // Import the mocked supabase

describe('SignupForm', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    (supabase.auth.signUp as jest.Mock).mockClear();
  });

  test('renders email and password input fields and a submit button', () => {
    render(<SignupForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('displays error message if email is empty on submit (client-side validation)', async () => {
    const { container } = render(<SignupForm />);
    const form = container.querySelector('form'); // Get form directly
    if (!form) throw new Error('Form not found');

    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    await act(async () => {
      fireEvent.submit(form); // Use fireEvent.submit on the form
    });
    await waitFor(() => {
      expect(screen.getByTestId('signup-message')).toHaveTextContent('Email and password are required.');
    });
    expect(supabase.auth.signUp).not.toHaveBeenCalled(); // Client-side validation prevents API call
  });

  test('displays error message if password is empty on submit (client-side validation)', async () => {
    const { container } = render(<SignupForm />);
    const form = container.querySelector('form'); // Get form directly
    if (!form) throw new Error('Form not found');

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    await act(async () => {
      fireEvent.submit(form); // Use fireEvent.submit on the form
    });
    await waitFor(() => {
      expect(screen.getByTestId('signup-message')).toHaveTextContent('Email and password are required.');
    });
    expect(supabase.auth.signUp).not.toHaveBeenCalled(); // Client-side validation prevents API call
  });

  test('displays error message if password is less than 6 characters (client-side validation)', async () => {
    const { container } = render(<SignupForm />);
    const form = container.querySelector('form'); // Get form directly
    if (!form) throw new Error('Form not found');

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short' } });
    await act(async () => {
      fireEvent.submit(form); // Use fireEvent.submit on the form
    });
    await waitFor(() => {
      expect(screen.getByTestId('signup-message')).toHaveTextContent('Password must be at least 6 characters long.');
    });
    expect(supabase.auth.signUp).not.toHaveBeenCalled(); // Client-side validation prevents API call
  });

  test('calls the signUp function and displays success message on successful signup', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 'new-user-id', email: 'new@example.com', confirmed_at: null } },
      error: null,
    });

    const { container } = render(<SignupForm />);
    const form = container.querySelector('form'); // Get form directly
    if (!form) throw new Error('Form not found');

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'validpassword' } });
    await act(async () => {
      fireEvent.submit(form); // Use fireEvent.submit on the form
    });

    await waitFor(() => {
      expect(screen.getByTestId('signup-message')).toHaveTextContent('Signup successful! Please check your email for verification.');
    });
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'validpassword',
      options: {
        emailRedirectTo: 'http://localhost/auth/callback', // JSDOM's default location.origin
      },
    });
  });

  test('clears form fields on successful signup', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 'clear-user-id', email: 'clear@example.com', confirmed_at: null } },
      error: null,
    });

    const { container } = render(<SignupForm />);
    const form = container.querySelector('form'); // Get form directly
    if (!form) throw new Error('Form not found');

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'clear@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'validpassword' } });
    await act(async () => {
      fireEvent.submit(form); // Use fireEvent.submit on the form
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/password/i)).toHaveValue('');
    });
  });

  test('displays error message if user with email already exists (Supabase error)', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'User with this email already exists.' },
    });

    const { container } = render(<SignupForm />);
    const form = container.querySelector('form'); // Get form directly
    if (!form) throw new Error('Form not found');

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } } );
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'validpassword' } });
    await act(async () => {
      fireEvent.submit(form); // Use fireEvent.submit on the form
    });

    await waitFor(() => {
      expect(screen.getByTestId('signup-message')).toHaveTextContent('User with this email already exists.');
    });
    expect(supabase.auth.signUp).toHaveBeenCalledTimes(1);
  });

  test('displays generic error message on unexpected Supabase error', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Network error or server unavailable.' },
    });

    const { container } = render(<SignupForm />);
    const form = container.querySelector('form'); // Get form directly
    if (!form) throw new Error('Form not found');

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'error@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'validpassword' } });
    await act(async () => {
      fireEvent.submit(form); // Use fireEvent.submit on the form
    });

    await waitFor(() => {
      expect(screen.getByTestId('signup-message')).toHaveTextContent('Network error or server unavailable.');
    });
    expect(supabase.auth.signUp).toHaveBeenCalledTimes(1);
  });
});
