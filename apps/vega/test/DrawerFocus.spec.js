/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0 */
import React from 'react';
import {Text} from 'react-native';
import {act, create} from 'react-test-renderer';
import {SpatialNavigation, SpatialNavigationRoot, SpatialNavigationFocusableView, DefaultFocus} from 'react-tv-space-navigation';
import {MenuProvider, useMenuContext} from '../../../packages/shared-ui/src/components/MenuContext';
import VegaCustomDrawerContent from '../src/components/VegaCustomDrawerContent';

const mockNavigation = {closeDrawer: jest.fn(), navigate: jest.fn()};
jest.mock('@amazon-devices/react-navigation__native', () => ({
  useNavigation: () => mockNavigation,
}));
jest.mock('@amazon-devices/react-navigation__drawer', () => ({
  DrawerContentScrollView: require('react-native').View,
}));
jest.mock('@multi-tv/shared-ui', () => ({
  ...require('../../../packages/shared-ui/src/components/MenuContext'),
  scaledPixels: value => value,
  colors: {},
  useTheme: () => require('../../../packages/shared-ui/src/theme/accessibility').defaultTheme,
  safeZones: {titleSafe: {vertical: 0}, actionSafe: {horizontal: 0}},
}), {virtual: true});

function Content({onSelect}) {
  const {isOpen} = useMenuContext();
  return <SpatialNavigationRoot isActive={!isOpen}>
    <DefaultFocus><SpatialNavigationFocusableView onSelect={onSelect}>
      {() => <Text>Content item</Text>}
    </SpatialNavigationFocusableView></DefaultFocus>
  </SpatialNavigationRoot>;
}

describe('Vega drawer focus handoff', () => {
  it('closes the focused drawer on Right and routes Enter to the content', async () => {
    const listeners = new Set();
    SpatialNavigation.configureRemoteControl({
      remoteControlSubscriber: callback => { listeners.add(callback); return callback; },
      remoteControlUnsubscriber: callback => listeners.delete(callback),
    });
    const onSelect = jest.fn();
    let tree;
    await act(async () => {
      tree = create(<MenuProvider>
        <VegaCustomDrawerContent navigation={mockNavigation} />
        <Content onSelect={onSelect} />
      </MenuProvider>);
    });
    const press = async direction => {
      await act(async () => { [...listeners].forEach(listener => listener(direction)); });
    };
    try {
      await press('right');
      expect(mockNavigation.closeDrawer).toHaveBeenCalledTimes(1);
      await press('enter');
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    } finally {
      await act(async () => tree.unmount());
    }
  });
});
