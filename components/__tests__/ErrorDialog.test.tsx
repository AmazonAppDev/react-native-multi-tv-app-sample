/**
 * ErrorDialog Component Tests
 *
 * Tests for TV-optimized error dialog with retry functionality.
 */

import React from 'react';
import { Text, Pressable } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import ErrorDialog from '../ErrorDialog';

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
      return React.createElement(
        View,
        {
          testID: 'focusable-view',
          onPress: onSelect,
        },
        children(mockProps),
      );
    },
    SpatialNavigationRoot: ({ children }: any) => {
      return React.createElement(View, { testID: 'spatial-root' }, children);
    },
    DefaultFocus: ({ children }: any) => {
      return React.createElement(View, { testID: 'default-focus' }, children);
    },
  };
});

describe('ErrorDialog', () => {
  const defaultProps = {
    visible: true,
    message: 'Test error message',
    onDismiss: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const component = renderer.create(<ErrorDialog {...defaultProps} onRetry={jest.fn()} />);
    const instance = component.root;

    const textElements = instance.findAllByType(Text);
    const titleText = textElements.find((el) => el.props.children === 'Something went wrong');
    const messageText = textElements.find((el) => el.props.children === 'Test error message');
    const retryText = textElements.find((el) => el.props.children === 'Try Again');
    const dismissText = textElements.find((el) => el.props.children === 'OK');

    expect(titleText).toBeTruthy();
    expect(messageText).toBeTruthy();
    expect(retryText).toBeTruthy();
    expect(dismissText).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const component = renderer.create(<ErrorDialog {...defaultProps} visible={false} />);

    expect(component.toJSON()).toBeNull();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    const component = renderer.create(<ErrorDialog {...defaultProps} onRetry={onRetry} />);

    const instance = component.root;
    const pressables = instance.findAllByType(Pressable);
    const retryButton = pressables.find((button) => {
      const textElements = button.findAllByType(Text);
      return textElements.some((text) => text.props.children === 'Try Again');
    });

    act(() => {
      retryButton?.props.onPress();
    });

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when dismiss button is pressed', () => {
    const component = renderer.create(<ErrorDialog {...defaultProps} />);
    const instance = component.root;

    const pressables = instance.findAllByType(Pressable);
    const dismissButton = pressables.find((button) => {
      const textElements = button.findAllByType(Text);
      return textElements.some((text) => text.props.children === 'OK');
    });

    act(() => {
      dismissButton?.props.onPress();
    });

    expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
  });

  it('shows retry loading state', () => {
    const component = renderer.create(<ErrorDialog {...defaultProps} isRetrying={true} onRetry={jest.fn()} />);

    const instance = component.root;
    const textElements = instance.findAllByType(Text);
    const retryingText = textElements.find((el) => el.props.children === 'Retrying...');

    expect(retryingText).toBeTruthy();
  });

  it('hides retry button when showRetry is false', () => {
    const component = renderer.create(<ErrorDialog {...defaultProps} showRetry={false} />);

    const instance = component.root;
    const textElements = instance.findAllByType(Text);
    const retryText = textElements.find((el) => el.props.children === 'Try Again');

    expect(retryText).toBeUndefined();
  });

  it('uses custom title and button text', () => {
    const component = renderer.create(
      <ErrorDialog
        {...defaultProps}
        title="Custom Error"
        retryText="Retry Now"
        dismissText="Close"
        onRetry={jest.fn()}
      />,
    );

    const instance = component.root;
    const textElements = instance.findAllByType(Text);

    const titleText = textElements.find((el) => el.props.children === 'Custom Error');
    const retryText = textElements.find((el) => el.props.children === 'Retry Now');
    const dismissText = textElements.find((el) => el.props.children === 'Close');

    expect(titleText).toBeTruthy();
    expect(retryText).toBeTruthy();
    expect(dismissText).toBeTruthy();
  });
});
