// __tests__/verify-email.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerifyEmailPage from '../verify-email/page';
import { supabase } from '../../../../lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock the Supabase client
jest.mock('../../../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      verifyOtp: jest.fn(),
    },
  },
}));

// Mock Next.js router and useSearchParams
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockVerifyOtp = supabase.auth.verifyOtp as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockVerifyOtp.mockClear();
    const mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('displays an error message if token or type are missing', async () => {
    // Mock searchParams to have missing parameters
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    render(<VerifyEmailPage />);
    
    // The component should quickly determine the link is invalid
    await waitFor(() => {
      expect(screen.getByText(/Invalid verification link/i)).toBeInTheDocument();
    });
  });

  it('displays "Verifying your email..." and then success on valid link', async () => {
    // Mock searchParams to return valid parameters
    const searchParams = new URLSearchParams();
    searchParams.set('token_hash', 'some-token-hash');
    searchParams.set('type', 'signup');
    mockUseSearchParams.mockReturnValue(searchParams);
    
    // Mock a successful OTP verification
    mockVerifyOtp.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    
    const { getByText } = render(<VerifyEmailPage />);
    
    // Initially, it should show a verifying message
    expect(getByText(/Verifying your email.../i)).toBeInTheDocument();

    // After the useEffect runs and verification succeeds
    await waitFor(() => {
      expect(getByText(/Email verified successfully!/i)).toBeInTheDocument();
    });

    // Check for redirect
    const { push } = mockUseRouter();
    jest.advanceTimersByTime(3000);
    expect(push).toHaveBeenCalledWith('/(auth)/login');
  });

  it('displays an error message on Supabase verification failure', async () => {
    // Mock searchParams to return valid parameters
    const searchParams = new URLSearchParams();
    searchParams.set('token_hash', 'expired-token');
    searchParams.set('type', 'signup');
    mockUseSearchParams.mockReturnValue(searchParams);

    // Mock a failed OTP verification
    const errorMessage = 'Token has expired';
    mockVerifyOtp.mockResolvedValue({ data: { user: null }, error: { message: errorMessage } });
    
    render(<VerifyEmailPage />);
    
    // Wait for the async verification to complete
    await waitFor(() => {
      expect(screen.getByText(`Verification failed: ${errorMessage}`)).toBeInTheDocument();
    });
  });
});