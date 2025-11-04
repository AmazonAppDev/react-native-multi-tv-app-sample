import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text } from 'react-native';
import { DefaultFocus, SpatialNavigationFocusableView, SpatialNavigationRoot } from 'react-tv-space-navigation';
import { scaledPixels } from '../hooks/useScale';
import { useMenuContext } from '../components/MenuContext';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import { Direction } from '@bam.tech/lrud';
import { useCallback, useState } from 'react';

export default function ExploreScreen() {
  const styles = exploreStyles;
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;
  const navigation = useNavigation();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === 'left' && focusedIndex === 0) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, focusedIndex, navigation],
  );

  return (
    <SpatialNavigationRoot isActive={isActive} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <View style={styles.container}>
        <DefaultFocus>
          <SpatialNavigationFocusableView>
            <Text style={styles.title}>Explore Screen</Text>
          </SpatialNavigationFocusableView>
        </DefaultFocus>
      </View>
    </SpatialNavigationRoot>
  );
}

const exploreStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    title: {
      fontSize: scaledPixels(32),
      fontWeight: 'bold',
      alignSelf: 'center',
      color: '#fff',
      marginBottom: scaledPixels(20),
    },
  });
