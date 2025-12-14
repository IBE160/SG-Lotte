// frontend/jest.setup.js
import '@testing-library/jest-dom';

// Mock global.fetch for tests that use it
global.fetch = jest.fn();

// Mock window.alert to prevent jsdom errors
jest.spyOn(window, 'alert').mockImplementation(() => {});
