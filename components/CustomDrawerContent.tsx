import { scaledPixels } from '@/hooks/useScale';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { View, StyleSheet, Image, Platform, Text } from 'react-native';
import { DefaultFocus, SpatialNavigationFocusableView, SpatialNavigationRoot } from 'react-tv-space-navigation';
import { useRouter } from 'expo-router';
import { useMenuContext } from '@/components/MenuContext';
import { useAuth } from '@/context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlugins } from '@/core/hooks/usePlugins';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const { user, logout } = useAuth();
  const { menuItems: pluginMenuItems } = usePlugins();
  const styles = useDrawerStyles();
  const { top } = useSafeAreaInsets();

  const coreDrawerItems = [
    { name: '/', label: 'Home' },
    { name: 'explore', label: 'Explore' },
    { name: 'tv', label: 'TV' },
    { name: 'games', label: 'Games' },
  ];

  // Combine core items with plugin items
  const allDrawerItems = [
    ...coreDrawerItems,
    ...pluginMenuItems.map((item) => ({ name: item.route, label: item.label })),
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toggleMenu(false);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SpatialNavigationRoot isActive={isMenuOpen}>
      <DrawerContentScrollView
        {...props}
        style={styles.container}
        scrollEnabled={false}
        contentContainerStyle={{
          ...(Platform.OS === 'ios' && Platform.isTV && { paddingStart: 0, paddingEnd: 0, paddingTop: 0 }),
        }}
      >
        <View style={styles.header}>
          <Image source={require('@/assets/images/logo.png')} style={styles.profilePic} />
          <Text style={styles.userName}>{user?.email || user?.username || 'Guest User'}</Text>
          <SpatialNavigationFocusableView onSelect={user ? handleLogout : () => router.push('/login')}>
            {({ isFocused }) => (
              <Text style={[styles.switchAccount, isFocused && styles.switchAccountFocused]}>
                {user ? 'Sign Out' : 'Sign In'}
              </Text>
            )}
          </SpatialNavigationFocusableView>
        </View>
        {allDrawerItems.map((item, index) =>
          index === 0 ? (
            <DefaultFocus key={index}>
              <SpatialNavigationFocusableView
                onSelect={() => {
                  console.log(item.name);
                  toggleMenu(false);
                  router.push(item.name);
                }}
              >
                {({ isFocused }) => (
                  <View style={[styles.menuItem, isFocused && styles.menuItemFocused]}>
                    <Text style={[styles.menuText, isFocused && styles.menuTextFocused]}>{item.label}</Text>
                  </View>
                )}
              </SpatialNavigationFocusableView>
            </DefaultFocus>
          ) : (
            <SpatialNavigationFocusableView
              key={index}
              onSelect={() => {
                console.log(item.name);
                toggleMenu(false);
                router.push(item.name);
              }}
            >
              {({ isFocused }) => (
                <View style={[styles.menuItem, isFocused && styles.menuItemFocused]}>
                  <Text style={[styles.menuText, isFocused && styles.menuTextFocused]}>{item.label}</Text>
                </View>
              )}
            </SpatialNavigationFocusableView>
          ),
        )}
      </DrawerContentScrollView>
    </SpatialNavigationRoot>
  );
}

const useDrawerStyles = function () {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      paddingTop: scaledPixels(20),
    },
    header: {
      padding: scaledPixels(16),
    },
    profilePic: {
      width: scaledPixels(180),
      height: scaledPixels(180),
      borderRadius: scaledPixels(20),
    },
    userName: {
      color: 'white',
      fontSize: scaledPixels(32),
      marginTop: scaledPixels(16),
    },
    switchAccount: {
      color: 'gray',
      fontSize: scaledPixels(20),
    },
    switchAccountFocused: {
      color: 'white',
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: scaledPixels(8),
      paddingVertical: scaledPixels(4),
      borderRadius: scaledPixels(4),
    },
    searchContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: scaledPixels(12),
      marginHorizontal: scaledPixels(16),
      marginVertical: scaledPixels(8),
      borderRadius: scaledPixels(4),
    },
    searchText: {
      color: 'gray',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: scaledPixels(16),
      paddingBottom: scaledPixels(8),
      paddingStart: scaledPixels(32),
    },
    menuItemFocused: {
      backgroundColor: 'white',
    },
    icon: {
      width: scaledPixels(24),
      height: scaledPixels(24),
      marginRight: scaledPixels(16),
    },
    menuText: {
      color: 'white',
      fontSize: scaledPixels(32),
    },
    menuTextFocused: {
      color: 'black',
    },
  });
};
