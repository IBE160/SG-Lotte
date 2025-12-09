// __tests__/signup.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupPage from '../signup/page';
import * as SupabaseClientModule from '../../../../lib/supabaseClient';

// Mock the Supabase client
jest.mock('../../../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      // Add other auth methods if needed by components
    },
    // Add other Supabase client properties if needed by components
  },
}));

import { supabase } from '../../../../lib/supabaseClient'; // Import the mocked supabase

// In your test file, you can now access the mocked functions directly
const mockSignUp = supabase.auth.signUp as jest.Mock;

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

describe('SignupPage', () => {
  beforeEach(() => {
    mockSignUp.mockClear();
    mockPush.mockClear();
    // JSDOM's window.location is not writable, so we have to replace it.
    delete (window as any).location;
    window.location = new URL('http://localhost') as any;
  });

  it('renders the signup form with all fields', () => {
    render(<SignupPage />);
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password \(min 6 characters\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('displays validation error for invalid email', async () => {
    render(<SignupPage />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'invalid-email' } });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    });

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('displays validation error for password less than 6 characters', async () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password \(min 6 characters\)/i), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('displays validation error for mismatched passwords', async () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password \(min 6 characters\)/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'passwordABC' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('calls supabase.auth.signUp and displays success message on successful registration', async () => {
    mockSignUp.mockResolvedValueOnce({ data: { user: { id: '123' } }, error: null });

    render(<SignupPage />);
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password \(min 6 characters\)/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
            emailRedirectTo: 'http://localhost/(auth)/verify-email',
        },
      });
      expect(screen.getByText(/registration successful! please check your email/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('displays error message on supabase registration failure', async () => {
    const errorMessage = 'User already exists';
    mockSignUp.mockResolvedValueOnce({ data: { user: null }, error: { message: errorMessage } });

    render(<SignupPage />);
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password \(min 6 characters\)/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(screen.queryByText(/success/i)).not.toBeInTheDocument();
  });
});