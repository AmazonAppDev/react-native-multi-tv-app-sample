import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import CustomDrawerContent from '../CustomDrawerContent';
import { MenuProvider } from '../MenuContext';

// Mock the required modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }),
}));

jest.mock('@react-navigation/drawer', () => ({
  DrawerContentScrollView: ({ children }: any) => children,
}));

jest.mock('react-tv-space-navigation', () => ({
  SpatialNavigationRoot: ({ children }: any) => children,
  SpatialNavigationFocusableView: ({ children }: any) => children({ isFocused: false }),
  DefaultFocus: ({ children }: any) => children,
}));

jest.mock('@/hooks/useScale', () => ({
  scaledPixels: (value: number) => value,
}));

describe('CustomDrawerContent', () => {
  it('renders all drawer menu items including watchlist', () => {
    const component = renderer.create(
      <MenuProvider>
        <CustomDrawerContent />
      </MenuProvider>,
    );

    const instance = component.root;
    const textElements = instance.findAllByType(Text);

    // Extract text content from all Text elements
    const textContents = textElements.map((el) => el.props.children);

    // Check that all menu items are rendered
    expect(textContents).toContain('Home');
    expect(textContents).toContain('Explore');
    expect(textContents).toContain('TV');
    expect(textContents).toContain('Watchlist');
  });

  it('renders user profile information', () => {
    const component = renderer.create(
      <MenuProvider>
        <CustomDrawerContent />
      </MenuProvider>,
    );

    const instance = component.root;
    const textElements = instance.findAllByType(Text);
    const textContents = textElements.map((el) => el.props.children);

    expect(textContents).toContain('Pioneer Tom');
    expect(textContents).toContain('Switch account');
  });
});
