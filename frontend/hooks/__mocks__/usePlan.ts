// frontend/hooks/__mocks__/usePlan.ts
import { jest } from '@jest/globals';

export const usePlan = jest.fn(() => ({
  plan: undefined,
  isLoading: false,
  isError: undefined,
  generatePlan: jest.fn(),
}));
