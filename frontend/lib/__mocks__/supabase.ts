// frontend/lib/__mocks__/supabase.ts

import { jest } from '@jest/globals';

export const mockSupabaseClient = {
  auth: {
    getSession: jest.fn(),
    admin: {
      updateUserById: jest.fn(),
    },
  },
};

export const supabase = mockSupabaseClient;

export const createSupabaseBrowserClient = jest.fn(() => mockSupabaseClient);

export const updateUserPreferences = jest.fn();
