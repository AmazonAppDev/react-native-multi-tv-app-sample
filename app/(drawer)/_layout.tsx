import { useNavigation } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { SpatialNavigationRoot } from 'react-tv-space-navigation';
import { Direction } from '@bam.tech/lrud';
import { DrawerActions } from '@react-navigation/native';
import { useMenuContext } from '../../components/MenuContext';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import { scaledPixels } from '@/hooks/useScale';

export default function DrawerLayout() {
  const styles = useDrawerStyles();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const navigation = useNavigation();

  console.log('isMenuOpen:', isMenuOpen);

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      console.log("Direction " + movement);
      if (movement === 'right') {
        navigation.dispatch(DrawerActions.closeDrawer());
        toggleMenu(false);
      }
    },
    [toggleMenu, navigation],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SpatialNavigationRoot
        isActive={isMenuOpen}
        onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
        <Drawer 
          drawerContent={CustomDrawerContent} 
          defaultStatus="open"
          screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: '#3498db', // Changed to a blue color
            drawerActiveTintColor: '#ffffff',
            drawerInactiveTintColor: '#bdc3c7',
            drawerStyle: styles.drawerStyle,
            drawerLabelStyle: styles.drawerLabelStyle,
          }}>
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: 'Home',
              title: 'index',
            }}
          />
          <Drawer.Screen
            name="explore"
            options={{
              drawerLabel: 'Explore',
              title: 'explore',
            }}
          />
          <Drawer.Screen
            name="tv"
            options={{
              drawerLabel: 'TV',
              title: 'tv',
            }}
          />
        </Drawer>
      </SpatialNavigationRoot>
    </GestureHandlerRootView>
  );
}

const useDrawerStyles = function () {
  return StyleSheet.create({
    drawerStyle: {
      width: scaledPixels(300),
      backgroundColor: '#2c3e50', // Dark blue background
      paddingTop: scaledPixels(0), // Add some top padding
    },
    drawerLabelStyle: {
      fontSize: scaledPixels(18),
      fontWeight: 'bold',
      marginLeft: scaledPixels(10), // Add some left margin
    },
  });
};