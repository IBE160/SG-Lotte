// frontend/app/(auth)/onboarding/__tests__/supabase.integration.test.ts

// Mock @supabase/ssr to prevent createBrowserClient from being called with actual env vars
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({
    auth: {
      admin: {
        updateUserById: jest.fn(),
      },
      getSession: jest.fn(),
    },
  })),
}));

// Now mock '@/lib/supabase' which imports from @supabase/ssr
const mockUpdateUserById = jest.fn();
const mockGetSession = jest.fn();

jest.mock('@/lib/supabase', () => {
  const actualSupabaseLib = jest.requireActual('@/lib/supabase'); // Get actual exports

  // Ensure that the 'supabase' object within '@/lib/supabase' uses our specific mocks
  // This will be the object used by updateUserPreferences
  const mockedSupabaseClient = {
    auth: {
      admin: {
        updateUserById: mockUpdateUserById,
      },
      getSession: mockGetSession,
    },
  };

  return {
    ...actualSupabaseLib, // Spread actual exports
    supabase: mockedSupabaseClient, // Override the 'supabase' export with our mock
    // createBrowserClient is implicitly mocked via @supabase/ssr mock,
    // but ensure it returns the same mock object for consistency if directly called.
    createBrowserClient: jest.fn(() => mockedSupabaseClient),
    updateUserPreferences: jest.requireActual('@/lib/supabase').updateUserPreferences,
  };
});

// Import after all mocks are set up
import { updateUserPreferences } from '@/lib/supabase';
import { supabase } from '@/lib/supabase'; // To access the mocked supabase client for configuring its mocks


describe('updateUserPreferences (function test)', () => {
  const mockUserId = 'test-user-id';
  const mockPreferences = {
    fitnessGoal: 'loseWeight',
    dietaryPreferences: ['vegetarian'],
    fitnessPersona: 'dedicated',
  };

  beforeEach(() => {
    mockUpdateUserById.mockClear();
    mockGetSession.mockClear();

    // Reset the internal mock for createBrowserClient if it was used for module-level side effects
    // The createBrowserClient from @supabase/ssr is now globally mocked.
    // The createBrowserClient from '@/lib/supabase' will also return the mock client.
    // Ensure that our mocked `supabase.auth.admin.updateUserById` is always the one called.
  });

  it('successfully updates user preferences via Supabase admin client', async () => {
    mockUpdateUserById.mockResolvedValue({
      data: { user: { id: mockUserId, user_metadata: mockPreferences } },
      error: null,
    });

    const result = await updateUserPreferences(mockUserId, mockPreferences);

    expect(mockUpdateUserById).toHaveBeenCalledWith(
      mockUserId,
      { user_metadata: mockPreferences }
    );
    expect(result).toEqual({ user: { id: mockUserId, user_metadata: mockPreferences } });
  });

  it('throws an error if the Supabase update fails', async () => {
    const mockError = new Error('Supabase update failed');
    mockUpdateUserById.mockResolvedValue({
      data: null,
      error: mockError,
    });

    await expect(updateUserPreferences(mockUserId, mockPreferences)).rejects.toThrow(
      'Failed to update user preferences'
    );
    expect(mockUpdateUserById).toHaveBeenCalledWith(
      mockUserId,
      { user_metadata: mockPreferences }
    );
  });
});