import React from 'react';
import { Text, View } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import { useRouter } from 'expo-router';
import EmptyWatchlistState from '../EmptyWatchlistState';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock react-tv-space-navigation
jest.mock('react-tv-space-navigation', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SpatialNavigationFocusableView: ({ children, onSelect }: any) => {
      const mockProps = { isFocused: false };
      return React.createElement(View, { testID: 'focusable-view', onPress: onSelect }, children(mockProps));
    },
  };
});

// Mock scaledPixels hook
jest.mock('@/hooks/useScale', () => ({
  scaledPixels: (value: number) => value,
}));

describe('EmptyWatchlistState', () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render empty state content correctly', () => {
    const component = renderer.create(<EmptyWatchlistState />);
    const instance = component.root;

    const textElements = instance.findAllByType(Text);
    const textContents = textElements.map((el) => el.props.children);

    expect(textContents).toContain('Your Watchlist is Empty');
    expect(textContents).toContain(
      'Start building your personal collection by adding movies and shows you want to watch later.',
    );
    expect(textContents).toContain('Browse content and select "Add to Watchlist" on any movie or show details page.');
    expect(textContents).toContain('Browse Content');
  });

  it('should display TV emoji icon', () => {
    const component = renderer.create(<EmptyWatchlistState />);
    const instance = component.root;

    const textElements = instance.findAllByType(Text);
    const iconText = textElements.find((el) => el.props.children === '📺');

    expect(iconText).toBeTruthy();
  });

  it('should navigate to home when browse button is pressed', async () => {
    const component = renderer.create(<EmptyWatchlistState />);
    const instance = component.root;

    const focusableView = instance.findByProps({ testID: 'focusable-view' });

    await act(async () => {
      focusableView.props.onPress();
    });

    expect(mockPush).toHaveBeenCalledWith('/(drawer)/');
  });

  it('should call custom onNavigateToHome callback when provided', async () => {
    const mockOnNavigateToHome = jest.fn();
    const component = renderer.create(<EmptyWatchlistState onNavigateToHome={mockOnNavigateToHome} />);
    const instance = component.root;

    const focusableView = instance.findByProps({ testID: 'focusable-view' });

    await act(async () => {
      focusableView.props.onPress();
    });

    expect(mockOnNavigateToHome).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should have proper component structure', () => {
    const component = renderer.create(<EmptyWatchlistState />);
    const instance = component.root;

    // Check that all required elements are present
    const textElements = instance.findAllByType(Text);
    expect(textElements.length).toBeGreaterThan(0);

    const viewElements = instance.findAllByType(View);
    expect(viewElements.length).toBeGreaterThan(0);

    // Check for focusable view
    const focusableView = instance.findByProps({ testID: 'focusable-view' });
    expect(focusableView).toBeTruthy();
  });
});
