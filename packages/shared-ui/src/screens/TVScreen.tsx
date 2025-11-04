// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text } from 'react-native';
import { DefaultFocus, SpatialNavigationFocusableView, SpatialNavigationRoot } from 'react-tv-space-navigation';
import { scaledPixels } from '../hooks/useScale';
import { useMenuContext } from '../components/MenuContext';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Direction } from '@bam.tech/lrud';

export default function TVScreen() {
  const styles = tvStyles;
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
            <Text style={styles.title}>TV Screen</Text>
          </SpatialNavigationFocusableView>
        </DefaultFocus>
      </View>
    </SpatialNavigationRoot>
  );
}

const tvStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: scaledPixels(32),
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: scaledPixels(20),
    },
  });
