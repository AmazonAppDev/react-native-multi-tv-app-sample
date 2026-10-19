import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { createDrawerNavigator } from '@amazon-devices/react-navigation__drawer';
import { useNavigation, DrawerActions } from '@amazon-devices/react-navigation__native';
import { useMenuContext, scaledPixels, HomeScreen, ExploreScreen, TVScreen, SettingsScreen } from '@multi-tv/shared-ui';
import VegaCustomDrawerContent from '../components/VegaCustomDrawerContent';
import { DrawerParamList } from './types';

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

export default function VegaDrawerNavigator() {
  const styles = drawerStyles;
  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator
        drawerContent={VegaCustomDrawerContent}
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
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            drawerLabel: 'Settings',
          }}
        />
      </Drawer.Navigator>
      <DrawerSyncWrapper />
    </View>
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
