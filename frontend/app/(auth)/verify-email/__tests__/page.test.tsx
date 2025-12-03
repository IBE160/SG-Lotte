import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import VerifyEmailPage from '../page';
import { useSearchParams } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock useRouter and useSearchParams
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(),
}));

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  test('displays "Verifying your email..." message by default', async () => {
    render(<VerifyEmailPage />);
    expect(screen.getByText('Email Verification')).toBeInTheDocument();
    expect(screen.getByText('Verifying your email...')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to login/i })).toBeInTheDocument();
  });

  test('displays success message when signup type and token_hash are present', async () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams({ type: 'signup', token_hash: 'some_hash' })
    );
    render(<VerifyEmailPage />);
    expect(screen.getByText('Your email has been successfully verified! You can now log in.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to login/i })).toBeInTheDocument();
  });

  test('displays error message when error_description is present', async () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams({ error_description: 'Invalid token' })
    );
    render(<VerifyEmailPage />);
    expect(screen.getByText('Verification failed: Invalid token. Please try again or contact support.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go back to signup/i })).toBeInTheDocument();
  });
});
