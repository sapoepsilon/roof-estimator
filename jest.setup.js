// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'openai/shims/node';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mock window.URL.createObjectURL
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = jest.fn();
}

// Mock process.env
process.env = {
  ...process.env,
  OPENAI_API_KEY: 'test-api-key',
  GOOGLE_MAPS_API_KEY: 'test-maps-key',
};
