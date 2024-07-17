import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import RemoteControlManager from './RemoteControlManager';
import { SupportedKeys } from './SupportedKeys';
import { useMenuContext } from '../../components/MenuContext';

export const GoBackConfiguration: React.FC = () => {
  const router = useRouter();
  const { isOpen: isMenuOpen } = useMenuContext();

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      if (isMenuOpen) {
        console.log('Menu is open during back navigation');
      }
    }
  }, [router, isMenuOpen]);

  useEffect(() => {
    const remoteControlListener = (pressedKey: SupportedKeys) => {
      if (pressedKey === SupportedKeys.Back) {
        handleBackPress();
      }
    };

    RemoteControlManager.addKeydownListener(remoteControlListener);
    return () => RemoteControlManager.removeKeydownListener(remoteControlListener);
  }, [handleBackPress]);

  return null;
};