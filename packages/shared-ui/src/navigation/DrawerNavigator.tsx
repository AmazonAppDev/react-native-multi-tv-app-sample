import { useCallback, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { SpatialNavigationRoot } from 'react-tv-space-navigation';
import { Direction } from '@bam.tech/lrud';
import { useMenuContext } from '../components/MenuContext';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { scaledPixels } from '../hooks/useScale';
import { DrawerParamList } from './types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import TVScreen from '../screens/TVScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerSyncWrapper() {
  const { isOpen: isMenuOpen } = useMenuContext();
  const navigation = useNavigation();

  // Open drawer on mount if menu context says it should be open
  useEffect(() => {
    if (isMenuOpen) {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  }, []);

  return null;
}

export default function DrawerNavigator() {
  const styles = drawerStyles;
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const navigation = useNavigation();

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === 'right') {
        navigation.dispatch(DrawerActions.closeDrawer());
        toggleMenu(false);
      }
    },
    [toggleMenu, navigation],
  );

  const navigationContent = (
    <SpatialNavigationRoot
      isActive={isMenuOpen}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <Drawer.Navigator
        drawerContent={CustomDrawerContent}
        initialRouteName="Home"
        defaultStatus="open"
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: '#3498db',
          drawerActiveTintColor: '#ffffff',
          drawerInactiveTintColor: '#bdc3c7',
          drawerStyle: styles.drawerStyle,
          drawerLabelStyle: styles.drawerLabelStyle,
          // Use 'front' type to allow drawer to open/close (collapse/expand)
          // Disable swipe gestures since we use remote control navigation
          drawerType: 'front',
          swipeEnabled: false,
          // Disable animations to avoid Reanimated worklet issues on TV
          animationEnabled: false,
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerLabel: 'Home',
          }}
        />
        <Drawer.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            drawerLabel: 'Explore',
          }}
        />
        <Drawer.Screen
          name="TV"
          component={TVScreen}
          options={{
            drawerLabel: 'TV',
          }}
        />
      </Drawer.Navigator>
      <DrawerSyncWrapper />
    </SpatialNavigationRoot>
  );

  // On TV platforms, don't use GestureHandlerRootView as we use remote control navigation
  if (Platform.isTV) {
    return <View style={{ flex: 1 }}>{navigationContent}</View>;
  }

  // On mobile/web, use GestureHandlerRootView for swipe gestures
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {navigationContent}
    </GestureHandlerRootView>
  );
}

const drawerStyles = StyleSheet.create({
    drawerStyle: {
      width: scaledPixels(300),
      backgroundColor: '#2c3e50',
      paddingTop: scaledPixels(0),
    },
    drawerLabelStyle: {
      fontSize: scaledPixels(18),
      fontWeight: 'bold',
      marginLeft: scaledPixels(10),
    },
  });
