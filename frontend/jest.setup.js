import '@testing-library/jest-dom';

// 1. Mock the actual supabase client from frontend/lib/supabase.ts
//    This ensures that any component importing `supabase` from there
//    will receive this mocked version in tests.
const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(({ email, password }) => {
      if (email === 'test@example.com' && password === 'password123') {
        return { data: { user: { id: 'test-user-id' } }, error: null };
      }
      return { data: { user: null }, error: { message: 'Invalid credentials' } };
    }),
    signUp: jest.fn(({ email, password }) => {
      if (email === 'existing@example.com') {
        return { data: { user: null }, error: { message: 'User with this email already exists.' } };
      }
      if (password && password.length < 6) {
        return { data: { user: null }, error: { message: 'Password must be at least 6 characters long.' } };
      }
      return { data: { user: { id: 'new-user-id', email: email, confirmed_at: null } }, error: null };
    }),
  },
};

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

// 2. Mock global fetch for API calls
//    This should be directly assigned to global.fetch.
global.fetch = jest.fn((url, options) => {
  if (url.endsWith('/')) { // Health check endpoint
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Welcome to AI Fitness & Meal Planner Backend!' }),
    });
  }
  return Promise.reject(new Error(`Unhandled fetch request to ${url}`));
}); // Removed as jest.Mock;
