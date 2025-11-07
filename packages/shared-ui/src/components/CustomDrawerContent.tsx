import { scaledPixels } from '../hooks/useScale';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { View, StyleSheet, Image, Platform, Text } from 'react-native';
import { DefaultFocus, SpatialNavigationFocusableView, SpatialNavigationRoot } from 'react-tv-space-navigation';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/types';
import { useMenuContext } from '../components/MenuContext';
import { safeZones, colors } from '../theme';

export default function CustomDrawerContent(props: any) {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const styles = drawerStyles;
  const drawerItems = [
    { name: 'Home', label: 'Home' },
    { name: 'Explore', label: 'Explore' },
    { name: 'TV', label: 'TV' },
  ] as const;

  return (
    <SpatialNavigationRoot isActive={isMenuOpen}>
      <View style={styles.drawerContainer}>
        {/* Gradient-like scrim overlay */}
        <View style={styles.scrimOverlay} />
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

        {/* Settings button at bottom */}
        <View style={styles.footer}>
          <SpatialNavigationFocusableView
            onSelect={() => {
              toggleMenu(false);
              navigation.navigate('Settings');
            }}
          >
            {({ isFocused }) => (
              <View style={[styles.settingsButton, isFocused && styles.settingsButtonFocused]}>
                <View style={styles.cogIcon}>
                  <Text style={[styles.cogIconText, isFocused && styles.cogIconTextFocused]}>⚙</Text>
                </View>
              </View>
            )}
          </SpatialNavigationFocusableView>
        </View>
      </View>
    </SpatialNavigationRoot>
  );
}

const drawerStyles = StyleSheet.create({
    drawerContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    scrimOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      opacity: 0.9,
    },
    container: {
      flex: 1,
      paddingTop: scaledPixels(safeZones.titleSafe.vertical),
    },
    header: {
      paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
      paddingVertical: scaledPixels(24),
      marginBottom: scaledPixels(16),
    },
    profilePic: {
      width: scaledPixels(200),
      height: scaledPixels(200),
      borderRadius: scaledPixels(24),
      borderWidth: scaledPixels(4),
      borderColor: colors.border,
    },
    userName: {
      color: colors.text,
      fontSize: scaledPixels(36),
      fontWeight: '600',
      marginTop: scaledPixels(20),
    },
    switchAccount: {
      color: colors.textSecondary,
      fontSize: scaledPixels(22),
      marginTop: scaledPixels(8),
    },
    searchContainer: {
      backgroundColor: colors.cardElevated,
      padding: scaledPixels(16),
      marginHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
      marginVertical: scaledPixels(12),
      borderRadius: scaledPixels(8),
    },
    searchText: {
      color: colors.textSecondary,
      fontSize: scaledPixels(20),
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scaledPixels(20),
      paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
      marginHorizontal: scaledPixels(16),
      marginVertical: scaledPixels(6),
      borderRadius: scaledPixels(8),
      minHeight: scaledPixels(72),
      borderWidth: scaledPixels(3),
      borderColor: 'transparent',
    },
    menuItemFocused: {
      backgroundColor: colors.focusBackground,
      borderColor: colors.focusBorder,
      transform: [{ scale: 1.05 }],
      shadowColor: colors.focus,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.6,
      shadowRadius: scaledPixels(12),
      elevation: 8,
    },
    icon: {
      width: scaledPixels(32),
      height: scaledPixels(32),
      marginRight: scaledPixels(20),
    },
    menuText: {
      color: colors.text,
      fontSize: scaledPixels(36),
      fontWeight: '500',
    },
    menuTextFocused: {
      color: colors.textOnPrimary,
      fontWeight: '600',
    },
    footer: {
      paddingHorizontal: scaledPixels(16),
      paddingBottom: scaledPixels(safeZones.actionSafe.vertical),
      paddingTop: scaledPixels(16),
      borderTopWidth: scaledPixels(2),
      borderTopColor: colors.border,
    },
    settingsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scaledPixels(20),
      paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
      borderRadius: scaledPixels(8),
      minHeight: scaledPixels(72),
      borderWidth: scaledPixels(3),
      borderColor: 'transparent',
    },
    settingsButtonFocused: {
      backgroundColor: colors.focusBackground,
      borderColor: colors.focusBorder,
      transform: [{ scale: 1.05 }],
      shadowColor: colors.focus,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.6,
      shadowRadius: scaledPixels(12),
      elevation: 8,
    },
    cogIcon: {
      width: scaledPixels(64),
      height: scaledPixels(64),
      justifyContent: 'center',
      alignItems: 'center',
    },
    cogIconText: {
      fontSize: scaledPixels(48),
      color: colors.text,
    },
    cogIconTextFocused: {
      color: colors.textOnPrimary,
    },
  });
