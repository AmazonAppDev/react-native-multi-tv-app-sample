/**
 * Home Screen Integration Tests
 * Tests for watchlist indicator integration in the home screen grid
 */

import React from 'react';
import renderer from 'react-test-renderer';
import IndexScreen from '../(drawer)/index';
import { WatchlistProvider } from '../../components/WatchlistContext';
import { MenuProvider } from '../../components/MenuContext';

// Mock the navigation hooks
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

// Mock the spatial navigation components
jest.mock('react-tv-space-navigation', () => ({
  SpatialNavigationFocusableView: ({ children, onFocus, onSelect }: any) => {
    const mockProps = { isFocused: false };
    return children(mockProps);
  },
  SpatialNavigationRoot: ({ children }: any) => children,
  SpatialNavigationScrollView: ({ children }: any) => children,
  SpatialNavigationNode: ({ children }: any) => children,
  SpatialNavigationVirtualizedList: ({ renderItem, data }: any) => {
    // Render first few items for testing
    return data.slice(0, 3).map((item: any, index: number) => renderItem({ item, index }));
  },
  DefaultFocus: ({ children }: any) => children,
}));

// Mock the scale hook
jest.mock('../../hooks/useScale', () => ({
  scaledPixels: (value: number) => value,
}));

// Mock AsyncStorage for WatchlistStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('IndexScreen Watchlist Integration', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return renderer.create(
      <MenuProvider>
        <WatchlistProvider>{component}</WatchlistProvider>
      </MenuProvider>,
    );
  };

  it('renders without crashing with watchlist integration', () => {
    // The screen should render successfully without throwing
    expect(() => renderWithProviders(<IndexScreen />)).not.toThrow();
  });

  it('includes watchlist context integration', () => {
    const component = renderWithProviders(<IndexScreen />);
    const tree = component.toJSON();

    // The component should render successfully with watchlist integration
    expect(tree).toBeTruthy();
  });
});
