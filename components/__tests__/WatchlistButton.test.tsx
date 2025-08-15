/**
 * WatchlistButton Component Tests
 *
 * Tests the watchlist button functionality including:
 * - Add/remove toggle behavior
 * - Loading states
 * - Error handling
 * - TV navigation integration
 */

import React from 'react';
import { Text, View, Pressable } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import WatchlistButton from '../WatchlistButton';
import { WatchlistProvider } from '../WatchlistContext';
import { WatchlistItem } from '../../types/watchlist';
import { WatchlistStorage } from '../../services/WatchlistStorage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock the WatchlistStorage service
jest.mock('../../services/WatchlistStorage');
const mockWatchlistStorage = WatchlistStorage as jest.Mocked<typeof WatchlistStorage>;

// Mock the useScale hook
jest.mock('../../hooks/useScale', () => ({
  scaledPixels: (value: number) => value,
}));

// Mock react-tv-space-navigation
jest.mock('react-tv-space-navigation', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SpatialNavigationFocusableView: ({ children, onSelect }: any) => {
      const mockProps = { isFocused: false };
      return React.createElement(View, { testID: 'focusable-view' }, children(mockProps));
    },
  };
});

const mockItem: Omit<WatchlistItem, 'addedAt'> = {
  id: '1',
  title: 'Test Movie',
  description: 'A test movie',
  headerImage: 'test-image.jpg',
  movie: 'test-video.mp4',
  duration: 120,
};

describe('WatchlistButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWatchlistStorage.getWatchlist.mockResolvedValue([]);
    mockWatchlistStorage.addItem.mockImplementation((item) => Promise.resolve([{ ...item, addedAt: Date.now() }]));
    mockWatchlistStorage.removeItem.mockResolvedValue([]);
  });

  it('renders add to watchlist button when item is not in watchlist', async () => {
    let component: renderer.ReactTestRenderer;

    await act(async () => {
      component = renderer.create(
        <WatchlistProvider>
          <WatchlistButton item={mockItem} />
        </WatchlistProvider>,
      );
    });

    // Wait for context to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const instance = component!.root;
    const textElements = instance.findAllByType(Text);
    const buttonText = textElements.find((el) => el.props.children === 'Add to Watchlist');

    expect(buttonText).toBeTruthy();
  });

  it('renders remove from watchlist button when item is in watchlist', async () => {
    // Mock item already in watchlist
    const existingItem: WatchlistItem = { ...mockItem, addedAt: Date.now() };
    mockWatchlistStorage.getWatchlist.mockResolvedValue([existingItem]);

    let component: renderer.ReactTestRenderer;

    await act(async () => {
      component = renderer.create(
        <WatchlistProvider>
          <WatchlistButton item={mockItem} />
        </WatchlistProvider>,
      );
    });

    // Wait for context to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const instance = component!.root;
    const textElements = instance.findAllByType(Text);
    const buttonText = textElements.find((el) => el.props.children === 'Remove from Watchlist');

    expect(buttonText).toBeTruthy();
  });

  it('calls onSuccess callback when add operation succeeds', async () => {
    const onSuccess = jest.fn();
    let component: renderer.ReactTestRenderer;

    await act(async () => {
      component = renderer.create(
        <WatchlistProvider>
          <WatchlistButton item={mockItem} onSuccess={onSuccess} />
        </WatchlistProvider>,
      );
    });

    // Wait for context to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const instance = component!.root;
    const pressable = instance.findByType(Pressable);

    // Trigger add operation
    await act(async () => {
      pressable.props.onPress();
    });

    expect(onSuccess).toHaveBeenCalledWith('added');
  });

  it('calls onError callback when operation fails', async () => {
    mockWatchlistStorage.addItem.mockRejectedValue(new Error('Storage error'));

    const onError = jest.fn();
    let component: renderer.ReactTestRenderer;

    await act(async () => {
      component = renderer.create(
        <WatchlistProvider>
          <WatchlistButton item={mockItem} onError={onError} />
        </WatchlistProvider>,
      );
    });

    // Wait for context to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const instance = component!.root;
    const pressable = instance.findByType(Pressable);

    // Trigger add operation
    await act(async () => {
      pressable.props.onPress();
    });

    expect(onError).toHaveBeenCalledWith('Storage error');
  });
});
