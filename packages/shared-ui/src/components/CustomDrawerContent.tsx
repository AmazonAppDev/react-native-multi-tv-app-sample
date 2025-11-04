import { scaledPixels } from '../hooks/useScale';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { View, StyleSheet, Image, Platform, Text } from 'react-native';
import { DefaultFocus, SpatialNavigationFocusableView, SpatialNavigationRoot } from 'react-tv-space-navigation';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/types';
import { useMenuContext } from '../components/MenuContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomDrawerContent(props: any) {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const styles = drawerStyles;
  const { top, right, bottom, left } = useSafeAreaInsets();
  const drawerItems = [
    { name: 'Home', label: 'Home' },
    { name: 'Explore', label: 'Explore' },
    { name: 'TV', label: 'TV' },
  ] as const;

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
          <Image source={require('../assets/images/logo.png')} style={styles.profilePic} />
          <Text style={styles.userName}>Pioneer Tom</Text>
          <Text style={styles.switchAccount}>Switch account</Text>
        </View>
        {drawerItems.map((item, index) =>
          index === 0 ? (
            <DefaultFocus key={index}>
              <SpatialNavigationFocusableView
                onSelect={() => {
                  toggleMenu(false);
                  navigation.navigate(item.name as keyof DrawerParamList);
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
                toggleMenu(false);
                navigation.navigate(item.name as keyof DrawerParamList);
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

const drawerStyles = StyleSheet.create({
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
