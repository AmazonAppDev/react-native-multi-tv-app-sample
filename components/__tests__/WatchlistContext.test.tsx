/**
 * WatchlistContext Tests
 *
 * Tests for the WatchlistContext provider functionality
 */

import React from 'react';
import { Text, View } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import { WatchlistProvider, useWatchlist } from '../WatchlistContext';
import { WatchlistStorage } from '../../services/WatchlistStorage';
import { WatchlistItem } from '../../types/watchlist';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock the WatchlistStorage service
jest.mock('../../services/WatchlistStorage');
const mockWatchlistStorage = WatchlistStorage as jest.Mocked<typeof WatchlistStorage>;

// Test component that uses the context
const TestComponent: React.FC = () => {
  const { watchlist, isInWatchlist, addToWatchlist, removeFromWatchlist, isLoading, error } = useWatchlist();

  return (
    <View>
      <Text testID="watchlist-count">{watchlist.length}</Text>
      <Text testID="is-loading">{isLoading.toString()}</Text>
      <Text testID="error">{error || 'no-error'}</Text>
      <Text testID="test-item-in-watchlist">{isInWatchlist('test-id').toString()}</Text>
    </View>
  );
};

const mockWatchlistItem: WatchlistItem = {
  id: 'test-id',
  title: 'Test Movie',
  description: 'Test Description',
  headerImage: 'test-image.jpg',
  movie: 'test-movie.mp4',
  addedAt: Date.now(),
};

describe('WatchlistContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide initial empty watchlist', async () => {
    mockWatchlistStorage.getWatchlist.mockResolvedValue([]);

    let component: renderer.ReactTestRenderer;

    await act(async () => {
      component = renderer.create(
        <WatchlistProvider>
          <TestComponent />
        </WatchlistProvider>,
      );
    });

    // Wait for async operations to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const instance = component!.root;
    const watchlistCount = instance.findByProps({ testID: 'watchlist-count' });
    const isLoading = instance.findByProps({ testID: 'is-loading' });
    const error = instance.findByProps({ testID: 'error' });
    const testItemInWatchlist = instance.findByProps({ testID: 'test-item-in-watchlist' });

    expect(watchlistCount.props.children).toBe(0);
    expect(isLoading.props.children).toBe('false');
    expect(error.props.children).toBe('no-error');
    expect(testItemInWatchlist.props.children).toBe('false');
  });

  it('should load existing watchlist items', async () => {
    mockWatchlistStorage.getWatchlist.mockResolvedValue([mockWatchlistItem]);

    let component: renderer.ReactTestRenderer;

    await act(async () => {
      component = renderer.create(
        <WatchlistProvider>
          <TestComponent />
        </WatchlistProvider>,
      );
    });

    // Wait for async operations to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const instance = component!.root;
    const watchlistCount = instance.findByProps({ testID: 'watchlist-count' });
    const testItemInWatchlist = instance.findByProps({ testID: 'test-item-in-watchlist' });

    expect(watchlistCount.props.children).toBe(1);
    expect(testItemInWatchlist.props.children).toBe('true');
  });

  it('should handle storage errors gracefully', async () => {
    const error = new Error('Storage failed');
    mockWatchlistStorage.getWatchlist.mockRejectedValue(error);

    let component: renderer.ReactTestRenderer;

    await act(async () => {
      component = renderer.create(
        <WatchlistProvider>
          <TestComponent />
        </WatchlistProvider>,
      );
    });

    // Wait for async operations to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const instance = component!.root;
    const errorElement = instance.findByProps({ testID: 'error' });

    expect(errorElement.props.children).toBe('Storage failed');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderer.create(<TestComponent />);
    }).toThrow('useWatchlist must be used within a WatchlistProvider');

    consoleSpy.mockRestore();
  });
});
