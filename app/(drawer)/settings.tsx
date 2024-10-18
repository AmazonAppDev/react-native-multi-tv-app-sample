// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Stack, useNavigation } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { DefaultFocus, SpatialNavigationFocusableView, SpatialNavigationRoot } from 'react-tv-space-navigation';
import { scaledPixels } from '@/hooks/useScale';
import { useMenuContext } from '../../components/MenuContext';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Direction } from '@bam.tech/lrud';

export default function TVScreen() {
  const styles = useTVStyles();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;
  const navigation = useNavigation();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      console.log("Direction " + movement);
      if (movement === 'left' && focusedIndex === 0) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, focusedIndex, navigation],
  );

  const languages = [
    { name: 'English', code: 'en' },
    { name: 'French', code: 'fr' },
    { name: 'Spanish', code: 'es' },
  ]

  return (
    <SpatialNavigationRoot isActive={isActive}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
      <Text style={styles.title}>Setting Screen</Text>
      <View style={styles.section}>
      <Text style={styles.sectionTitle}>Language</Text>
      {languages.map((language, index) =>
       (
        <SpatialNavigationFocusableView key={index} onSelect={() => { console.log(language.name)}}>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>{language.name}</Text>
            <Text style={styles.optionText}>{language.code}</Text>
          </TouchableOpacity>
          </SpatialNavigationFocusableView>
        )
      )}   
       </View> 
      </View> 
    </SpatialNavigationRoot>
  );
}

const useTVStyles = function() {
  return StyleSheet.create({
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
      section: {
        width: '20%',
        marginBottom: 30,
      },
      sectionTitle: {
        fontSize: 24,
        color: '#fefefe',
        fontWeight: 800,
        marginBottom: 15,
      },
      settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#333',
        borderRadius: 8,
        marginBottom: 10,
      },
      settingText: {
        fontSize: 20,
        color: '#fff',
      },
      optionText: {
        fontSize: 20,
        color: '#bbb',
      },
  });
};