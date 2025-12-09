// __tests__/signup.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupPage from '../signup/page';
import * as SupabaseClientModule from '../../../../lib/supabaseClient';

// Mock the Supabase client
const mockSignUp = jest.fn();
const mockCreateClient = jest.spyOn(SupabaseClientModule, 'createClient').mockReturnValue({
  auth: {
    signUp: mockSignUp,
    // Add other auth methods if needed by components
  },
  // Add other Supabase client properties if needed by components
} as any); // Use 'as any' for simpler mocking, or define full mock type

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
    // Reset location.origin for consistent testing
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { origin: 'http://localhost' },
    });
  });

  it('renders the signup form with all fields', () => {
    render(<SignupPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password \(min 6 characters\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('displays validation error for invalid email', async () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('displays validation error for password less than 6 characters', async () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password \(min 6 characters\)/i), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('displays validation error for mismatched passwords', async () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password \(min 6 characters\)/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'passwordABC' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('calls supabase.auth.signUp and displays success message on successful registration', async () => {
    mockSignUp.mockResolvedValueOnce({ data: { user: { id: '123' } }, error: null });

    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password \(min 6 characters\)/i), { target: { value: 'password123' } });
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
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/password \(min 6 characters\)/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(screen.queryByText(/success/i)).not.toBeInTheDocument();
  });
});
