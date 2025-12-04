// frontend/__mocks__/swr.js
import { jest } from '@jest/globals';

// Mock the useSWR hook
const useSWR = jest.fn(() => ({
  data: undefined,
  error: undefined,
  isLoading: false,
  isValidating: false,
  mutate: jest.fn(),
}));

// Mock the SWRConfig component
const SWRConfig = ({ children }) => children;

export default useSWR;
export { SWRConfig };
