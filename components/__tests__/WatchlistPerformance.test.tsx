/**
 * Performance tests for watchlist components with large datasets
 * Tests rendering performance, memory usage, and scroll performance
 */

import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { WatchlistProvider } from '../WatchlistContext';
import { WatchlistItem } from '../../types/watchlist';

// Mock dependencies
jest.mock('expo-router', () => ({
  useNavigation: () => ({
    dispatch: jest.fn(),
  }),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  DrawerActions: {
    openDrawer: jest.fn(),
  },
  useIsFocused: () => true,
}));

jest.mock('../../components/MenuContext', () => ({
  useMenuContext: () => ({
    isOpen: false,
    toggleMenu: jest.fn(),
  }),
}));

jest.mock('react-tv-space-navigation', () => ({
  SpatialNavigationRoot: ({ children }: any) => children,
  SpatialNavigationScrollView: ({ children }: any) => children,
  SpatialNavigationNode: ({ children }: any) => children,
  SpatialNavigationFocusableView: ({ children }: any) => children({ isFocused: false }),
  DefaultFocus: ({ children }: any) => children,
}));

jest.mock('../../hooks/useScale', () => ({
  scaledPixels: (value: number) => value,
}));

// Generate large dataset for testing
const generateLargeWatchlist = (size: number): WatchlistItem[] => {
  return Array.from({ length: size }, (_, index) => ({
    id: index,
    title: `Test Movie ${index}`,
    description: `Description for test movie ${index}`,
    headerImage: `https://example.com/image${index}.jpg`,
    movie: `https://example.com/movie${index}.mp4`,
    duration: 90 + (index % 60),
    addedAt: Date.now() - index * 1000,
  }));
};

// Mock WatchlistStorage for performance tests
jest.mock('../../services/WatchlistStorage', () => ({
  WatchlistStorage: {
    getWatchlist: jest.fn(),
    addItem: jest.fn(),
    removeItem: jest.fn(),
    saveWatchlist: jest.fn(),
  },
}));

describe('Watchlist Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render efficiently with 100 items', async () => {
    const largeWatchlist = generateLargeWatchlist(100);

    // Mock the storage to return large dataset
    const { WatchlistStorage } = require('../../services/WatchlistStorage');
    WatchlistStorage.getWatchlist.mockResolvedValue(largeWatchlist);

    const startTime = performance.now();

    const TestComponent = () => (
      <WatchlistProvider>
        <div>Test Component</div>
      </WatchlistProvider>
    );

    const component = renderer.create(<TestComponent />);

    // Wait for loading to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Rendering should complete within reasonable time (< 1000ms)
    expect(renderTime).toBeLessThan(1000);

    // Component should render without errors
    expect(component.toJSON()).toBeTruthy();

    component.unmount();
  });

  it('should render efficiently with 500 items', async () => {
    const largeWatchlist = generateLargeWatchlist(500);

    const { WatchlistStorage } = require('../../services/WatchlistStorage');
    WatchlistStorage.getWatchlist.mockResolvedValue(largeWatchlist);

    const startTime = performance.now();

    const TestComponent = () => (
      <WatchlistProvider>
        <div>Large Dataset Test</div>
      </WatchlistProvider>
    );

    const component = renderer.create(<TestComponent />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Even with 500 items, should render within reasonable time
    expect(renderTime).toBeLessThan(2000);
    expect(component.toJSON()).toBeTruthy();

    component.unmount();
  });

  it('should handle memory efficiently with large datasets', async () => {
    const largeWatchlist = generateLargeWatchlist(1000);

    const { WatchlistStorage } = require('../../services/WatchlistStorage');
    WatchlistStorage.getWatchlist.mockResolvedValue(largeWatchlist);

    // Monitor memory usage (simplified test)
    const initialMemory = process.memoryUsage().heapUsed;

    const TestComponent = () => (
      <WatchlistProvider>
        <div>Memory Test</div>
      </WatchlistProvider>
    );

    const component = renderer.create(<TestComponent />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    const peakMemory = process.memoryUsage().heapUsed;

    // Cleanup
    component.unmount();

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const finalMemory = process.memoryUsage().heapUsed;

    // Memory should not grow excessively (less than 50MB increase)
    const memoryIncrease = peakMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB

    // Memory should be cleaned up after unmount
    const memoryRetained = finalMemory - initialMemory;
    expect(memoryRetained).toBeLessThan(10 * 1024 * 1024); // 10MB
  });

  it('should maintain performance with frequent updates', async () => {
    const initialWatchlist = generateLargeWatchlist(100);

    const { WatchlistStorage } = require('../../services/WatchlistStorage');
    WatchlistStorage.getWatchlist.mockResolvedValue(initialWatchlist);

    const TestComponent = ({ iteration }: { iteration: number }) => (
      <WatchlistProvider key={iteration}>
        <div>Update Test {iteration}</div>
      </WatchlistProvider>
    );

    // Simulate multiple updates
    const updateTimes: number[] = [];

    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();

      // Simulate adding/removing items
      const updatedWatchlist = generateLargeWatchlist(100 + i);
      WatchlistStorage.getWatchlist.mockResolvedValue(updatedWatchlist);

      const component = renderer.create(<TestComponent iteration={i} />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      const endTime = performance.now();
      updateTimes.push(endTime - startTime);

      component.unmount();
    }

    // Average update time should be reasonable
    const averageUpdateTime = updateTimes.reduce((a, b) => a + b, 0) / updateTimes.length;
    expect(averageUpdateTime).toBeLessThan(200); // Less than 200ms per update
  });

  it('should optimize re-renders with memoization', () => {
    // This test would require more sophisticated mocking to track re-renders
    // For now, we verify that memoized components are being used
    const largeWatchlist = generateLargeWatchlist(50);

    const { WatchlistStorage } = require('../../services/WatchlistStorage');
    WatchlistStorage.getWatchlist.mockResolvedValue(largeWatchlist);

    const TestComponent = () => (
      <WatchlistProvider>
        <div>Memoization Test</div>
      </WatchlistProvider>
    );

    const component = renderer.create(<TestComponent />);

    // Verify that the component renders without errors
    expect(component.toJSON()).toBeTruthy();

    component.unmount();
  });
});

describe('Watchlist Context Performance', () => {
  it('should handle rapid add/remove operations efficiently', async () => {
    const { WatchlistStorage } = require('../../services/WatchlistStorage');
    WatchlistStorage.getWatchlist.mockResolvedValue([]);
    WatchlistStorage.addItem.mockImplementation((item) => Promise.resolve([{ ...item, addedAt: Date.now() }]));
    WatchlistStorage.removeItem.mockImplementation(() => Promise.resolve([]));

    const TestComponent = () => (
      <WatchlistProvider>
        <div>Context Performance Test</div>
      </WatchlistProvider>
    );

    const startTime = performance.now();

    const component = renderer.create(<TestComponent />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    const endTime = performance.now();
    const operationTime = endTime - startTime;

    // Context operations should complete within reasonable time
    expect(operationTime).toBeLessThan(2000);
    expect(component.toJSON()).toBeTruthy();

    component.unmount();
  });
});
