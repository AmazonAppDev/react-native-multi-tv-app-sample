import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { createDrawerNavigator } from '@amazon-devices/react-navigation__drawer';
import { useNavigation, DrawerActions } from '@amazon-devices/react-navigation__native';
import { SpatialNavigationRoot } from 'react-tv-space-navigation';
import { Direction } from '@bam.tech/lrud';
import { useMenuContext, scaledPixels, HomeScreen, ExploreScreen, TVScreen } from '@multi-tv/shared-ui';
import VegaCustomDrawerContent from '../components/VegaCustomDrawerContent';
import { DrawerParamList } from './types';

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerSyncWrapper() {
  const { isOpen: isMenuOpen } = useMenuContext();
  const navigation = useNavigation();

  console.log('isMenuOpen:', isMenuOpen);

  // Open drawer on mount if menu context says it should be open
  useEffect(() => {
    if (isMenuOpen) {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  }, []);

  return null;
}

export default function VegaDrawerNavigator() {
  const styles = useDrawerStyles();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const navigation = useNavigation();

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      console.log('Direction ' + movement);
      if (movement === 'right') {
        navigation.dispatch(DrawerActions.closeDrawer());
        toggleMenu(false);
      }
    },
    [toggleMenu, navigation],
  );

  return (
    <View style={{ flex: 1 }}>
      <SpatialNavigationRoot
        isActive={isMenuOpen}
        onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
      >
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
        </Drawer.Navigator>
        <DrawerSyncWrapper />
      </SpatialNavigationRoot>
    </View>
  );
}

const useDrawerStyles = function () {
  return StyleSheet.create({
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
};
