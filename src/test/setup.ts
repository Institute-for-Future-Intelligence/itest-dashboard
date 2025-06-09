import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock fetch globally
global.fetch = vi.fn();

// Mock window.matchMedia (for Material-UI responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Recharts (which can cause issues in test environment)
vi.mock('recharts', () => ({
  LineChart: vi.fn(({ children }) => children),
  BarChart: vi.fn(({ children }) => children),
  AreaChart: vi.fn(({ children }) => children),
  XAxis: vi.fn(() => null),
  YAxis: vi.fn(() => null),
  CartesianGrid: vi.fn(() => null),
  Tooltip: vi.fn(() => null),
  Legend: vi.fn(() => null),
  Line: vi.fn(() => null),
  Bar: vi.fn(() => null),
  Area: vi.fn(() => null),
  ResponsiveContainer: vi.fn(({ children }) => children),
})); 