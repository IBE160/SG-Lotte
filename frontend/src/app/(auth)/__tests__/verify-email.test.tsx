// __tests__/verify-email.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerifyEmailPage from '../verify-email/page';
import * as SupabaseClientModule from '../../../../lib/supabaseClient';

// Mock the Supabase client
jest.mock('../../../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      verifyOtp: jest.fn(),
      // Add other auth methods if needed by components
    },
    // Add other Supabase client properties if needed by components
  },
}));

import { supabase } from '../../../../lib/supabaseClient'; // Import the mocked supabase

// In your test file, you can now access the mocked functions directly
const mockVerifyOtp = supabase.auth.verifyOtp as jest.Mock;

// Mock Next.js router and useSearchParams
const mockPush = jest.fn();
const mockGetSearchParams = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({
    get: mockGetSearchParams,
  }),
}));

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    mockVerifyOtp.mockClear();
    mockPush.mockClear();
    mockGetSearchParams.mockClear();
    jest.useFakeTimers(); // Control setTimeout
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Ensure any pending timers are run
    jest.useRealTimers(); // Restore real timers
  });

  it('displays "Verifying your email..." initially', () => {
    render(<VerifyEmailPage />);
    expect(screen.getByText(/verifying your email.../i)).toBeInTheDocument();
  });

  it('calls supabase.auth.verifyOtp with correct parameters on valid link and redirects on success', async () => {
    mockGetSearchParams.mockImplementation((key) => {
      if (key === 'token_hash') return 'some-token-hash';
      if (key === 'type') return 'signup';
      return null;
    });
    mockVerifyOtp.mockResolvedValueOnce({ error: null });

    render(<VerifyEmailPage />);

    expect(screen.getByText(/verifying your email.../i)).toBeInTheDocument(); // Initial state

    await waitFor(() => {
      expect(mockVerifyOtp).toHaveBeenCalledWith({
        token_hash: 'some-token-hash',
        type: 'signup',
      });
    });

    expect(screen.getByText(/email verified successfully! redirecting to login.../i)).toBeInTheDocument();
    
    // Advance timers to trigger the redirect
    jest.advanceTimersByTime(3000); 
    expect(mockPush).toHaveBeenCalledWith('/(auth)/login');
  });

  it('displays error message for invalid token_hash or type', async () => {
    mockGetSearchParams.mockImplementation((key) => {
      if (key === 'token_hash') return null; // Missing token_hash
      if (key === 'type') return 'signup';
      return null;
    });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText(/invalid verification link/i)).toBeInTheDocument();
      expect(screen.getByText(/email verification failed. please try again or contact support./i)).toBeInTheDocument();
    });
    expect(mockVerifyOtp).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('displays error message on supabase.auth.verifyOtp failure', async () => {
    const errorMessage = 'Token has expired';
    mockGetSearchParams.mockImplementation((key) => {
      if (key === 'token_hash') return 'expired-token';
      if (key === 'type') return 'signup';
      return null;
    });
    mockVerifyOtp.mockResolvedValueOnce({ error: { message: errorMessage } });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(mockVerifyOtp).toHaveBeenCalled();
      expect(screen.getByText(/verification failed: token has expired/i)).toBeInTheDocument();
      expect(screen.getByText(/email verification failed. please try again or contact support./i)).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});