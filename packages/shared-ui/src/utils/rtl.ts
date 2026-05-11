import { I18nManager } from 'react-native';
import { Direction } from '@bam.tech/lrud';

export function isRTL(): boolean {
  return I18nManager.isRTL;
}

export function getOpenDrawerDirection(): Direction {
  return I18nManager.isRTL ? 'right' : 'left';
}

export function getCloseDrawerDirection(): Direction {
  return I18nManager.isRTL ? 'left' : 'right';
}
