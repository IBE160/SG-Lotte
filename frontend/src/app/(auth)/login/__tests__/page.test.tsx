// frontend/src/app/(auth)/login/__tests__/page.test.tsx
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import LoginPage from '../page'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Supabase client with default resolved values
const mockSignInWithPassword = jest.fn(() => Promise.resolve({ data: { user: null }, error: null })); // Default mock for signInWithPassword
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  })),
}));

// Re-declare mockSupabaseSignIn after the mock is defined
const mockSupabaseSignIn = mockSignInWithPassword; // Now points to the actual mocked function

const mockPush = jest.fn()
;(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
})

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the login form', () => {
    render(<LoginPage />)
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
    expect(screen.getByText(/don't have an account?/i)).toBeInTheDocument()
  })

  it('displays validation errors for invalid email', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.tab() // Simulate blur
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.queryByText(/enter a valid email address./i)).toBeInTheDocument()
    }, { timeout: 5000 })
    expect(mockSupabaseSignIn).not.toHaveBeenCalled()
  })

  it('displays validation errors for empty password', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /log in/i })) // Submit with empty password

    await waitFor(() => {
      expect(screen.queryByText(/password is required./i)).toBeInTheDocument()
    }, { timeout: 5000 })
    expect(mockSupabaseSignIn).not.toHaveBeenCalled()
  })

  it('calls Supabase sign-in and redirects on successful login', async () => {
    mockSupabaseSignIn.mockResolvedValueOnce({ data: { user: { id: '123' } }, error: null })
    const user = userEvent.setup()

    render(<LoginPage />)
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(mockSupabaseSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows "Please verify your email" message if Supabase returns email not confirmed error', async () => {
    mockSupabaseSignIn.mockResolvedValueOnce({
      data: { user: null }, // Explicitly returning data.user null for error case
      error: { message: 'Email not confirmed' },
    })
    const user = userEvent.setup()

    render(<LoginPage />)
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(mockSupabaseSignIn).toHaveBeenCalled()
      expect(screen.getByText(/please verify your email before logging in./i)).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows generic error message if other Supabase login fails', async () => {
    mockSupabaseSignIn.mockResolvedValueOnce({
      data: { user: null }, // Explicitly returning data.user null for error case
      error: { message: 'Invalid login credentials' },
    })
    const user = userEvent.setup()

    render(<LoginPage />)
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(mockSupabaseSignIn).toHaveBeenCalled()
      expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows generic error message if login fails unexpectedly', async () => {
    mockSupabaseSignIn.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Network error' },
    })
    const user = userEvent.setup()

    render(<LoginPage />)
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.queryByText(/an unexpected error occurred./i)).toBeInTheDocument()
    }, { timeout: 5000 })
    expect(mockSupabaseSignIn).toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })
})