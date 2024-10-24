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
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SettingScreen() {
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

  const menuItems = [
    { id: 'language', label: 'Language' },
    { id: 'sound', label: 'Sound' },
    { id: 'display', label: 'Display' },
  ];

  const submenus = {
    language: ['English', 'French', 'Spanish'],
  };
  const [selectedMenuItem, setSelectedMenuItem] = useState('language'); 
  const [focusedMenuItem, setFocusedMenuItem] = useState('language'); 
  const [selectedSubmenuItem, setSelectedSubmenuItem] = useState("English");

  return (
    <SpatialNavigationRoot isActive={isActive}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.heading}>Account</Text>
      <View style={styles.container}>
        
      <DefaultFocus>
      <SpatialNavigationFocusableView>
      <View style={styles.container}>
       
      {/* Main Menu (Left) */}
      <View style={styles.mainMenu}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              focusedMenuItem === item.id && styles.focusedMenuItem,
              selectedMenuItem === item.id && styles.selectedMenu,
            ]}
            onPress={() => setSelectedMenuItem(item.id)} 
            onFocus={() => setFocusedMenuItem(item.id)} 
            onBlur={() => setFocusedMenuItem(null)} 
          >
            <Text style={[styles.menuText, selectedMenuItem === item.id && styles.selectedMenuItem]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submenu (Right) */}
     {submenus[selectedMenuItem] && <View style={styles.submenu}>
      <Text style={styles.title}>Settings</Text>
        {selectedMenuItem && submenus[selectedMenuItem]?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.submenuItem, selectedSubmenuItem === option && styles.focusedSubMenuItem]}
            onPress={() => console.log(`Selected: ${option}`)} 
          >
            <Text style={[styles.submenuText, selectedSubmenuItem === option && styles.selectedSubmenuText]}>{option}</Text>
          {selectedSubmenuItem === option &&
              <Icon name="check" size={20} color="#00FF00" style={[styles.checkIcon, selectedSubmenuItem === option && styles.selectedCheckIcon]} />
          }
          </TouchableOpacity>
        ))}
      </View>
}
    </View>
      </SpatialNavigationFocusableView>
      </DefaultFocus>
      </View>
    </SpatialNavigationRoot>
  );
}

const useTVStyles = function() {
  return StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      },
      heading: {
        fontSize: scaledPixels(32),
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: scaledPixels(80),
      },
      title: {
        fontSize: scaledPixels(32),
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: scaledPixels(20),
      },
      mainMenu: {
        width: '40%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        verticalAlign: 'top',
        marginRight: 20,
        marginTop: 2,
      },
      menuItem: {
        width: '100%',
        padding: 15,
        marginBottom: 6,
        backgroundColor: '#444',
        borderRadius: 8,
      },
      menuText: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
      },
      focusedMenuItem: {
        backgroundColor: '#FFFFFF', 
        borderColor: '#fff',
        borderWidth: 2,
      },
      selectedMenu: {
        backgroundColor: '#fff', 
        borderColor: '#fff',
        borderWidth: 2,
      },
      selectedMenuItem: {
        color: '#000', 
      },
      submenu: {
        flex: 1, 
        justifyContent: 'flex-start',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#222',
        borderRadius: 8,
      },
      submenuItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#222',
        borderRadius: 8,
        marginBottom: 8,
        justifyContent: 'space-between',
      },
      focusedSubMenuItem: {
        backgroundColor: '#EEE',
        borderColor: '#fff',
        borderWidth: 2,
        color: '#000',
      },
      submenuText: {
        fontSize: 18,
        color: '#fff',
      },
      checkIcon: {
        justifyContent: 'flex-end',
        color: '#FFF',
      },
      selectedSubmenuText: {
        color: '#000',
      },
      selectedCheckIcon: {
        color: '#000',
      },
  });
};