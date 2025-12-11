// frontend/src/app/(auth)/signup/__tests__/page.test.tsx
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import SignUpPage from '../page'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Supabase client with default resolved values
const mockSignUp = jest.fn(() => Promise.resolve({ data: { user: null }, error: null })); // Default mock for signUp
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: mockSignUp,
    },
  })),
}));

// Re-declare mockSupabaseSignUp after the mock is defined
const mockSupabaseSignUp = mockSignUp; // Now points to the actual mocked function

const mockPush = jest.fn()
;(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
})

describe('SignUpPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the signup form', () => {
    render(<SignUpPage />)
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.getByText(/already have an account?/i)).toBeInTheDocument()
  })

    it('displays validation errors for invalid email', async () => {
      const user = userEvent.setup()
      render(<SignUpPage />)
      await user.type(screen.getByLabelText(/email/i), 'invalid-email')
      await user.tab() // Simulate blur
      await user.click(screen.getByRole('button', { name: /sign up/i }))
  
      await waitFor(() => {
        expect(screen.queryByText(/enter a valid email address./i)).toBeInTheDocument()
      }, { timeout: 5000 })
      expect(mockSupabaseSignUp).not.toHaveBeenCalled()
    })
  it('displays validation errors for short password', async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'short')
    await user.tab() // Simulate blur
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.queryByText(/password must be at least 8 characters long./i)).toBeInTheDocument()
    }, { timeout: 5000 })
    expect(mockSupabaseSignUp).not.toHaveBeenCalled()
  })

  it('calls Supabase signup and shows success message on successful registration', async () => {
    mockSupabaseSignUp.mockResolvedValueOnce({ data: { user: { id: '123' } }, error: null })
    const user = userEvent.setup()

    render(<SignUpPage />)
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(mockSupabaseSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: expect.any(String), // We don't care about the exact origin here for this test
        },
      })
      expect(
        screen.getByText(/registration successful! please check your email to verify your account./i)
      ).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled() // Should not redirect on successful signup, only show message
  })

  it('shows error message if Supabase signup fails', async () => {
    mockSupabaseSignUp.mockResolvedValueOnce({
      data: { user: null }, // Explicitly returning data.user null for error case
      error: { message: 'User already registered' },
    })
    const user = userEvent.setup()

    render(<SignUpPage />)
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(mockSupabaseSignUp).toHaveBeenCalled()
      expect(screen.getByText(/user already registered/i)).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows generic error message if signup fails unexpectedly', async () => {
    mockSupabaseSignUp.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Network error' },
    })
    const user = userEvent.setup()

    render(<SignUpPage />)
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.queryByText(/an unexpected error occurred./i)).toBeInTheDocument()
    }, { timeout: 5000 })
    expect(mockSupabaseSignUp).toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })
})