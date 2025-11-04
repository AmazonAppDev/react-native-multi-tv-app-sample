import mitt from 'mitt';
import KeyEvent from 'react-native-keyevent';
import { SupportedKeys } from './SupportedKeys';
import { RemoteControlManagerInterface } from './RemoteControlManager.interface';

const KEY_CODE_MAPPING: Record<number, SupportedKeys> = {
  21: SupportedKeys.Left,
  22: SupportedKeys.Right,
  20: SupportedKeys.Down,
  19: SupportedKeys.Up,
  66: SupportedKeys.Enter,
  23: SupportedKeys.Enter,
  67: SupportedKeys.Back,
  85: SupportedKeys.PlayPause,
  89: SupportedKeys.Rewind,
  90: SupportedKeys.FastForward,
};

class RemoteControlManager implements RemoteControlManagerInterface {
  private eventEmitter = mitt<{ keyDown: SupportedKeys }>();

  constructor() {
    KeyEvent.onKeyDownListener(this.handleKeyDown);
  }

  private handleKeyDown = (keyEvent: { keyCode: number }): void => {
    const mappedKey = KEY_CODE_MAPPING[keyEvent.keyCode];
    if (mappedKey) {
      console.log(`Key pressed: ${mappedKey}`);
      this.eventEmitter.emit('keyDown', mappedKey);
    }
  };

  addKeydownListener = (listener: (event: SupportedKeys) => void): ((event: SupportedKeys) => void) => {
    this.eventEmitter.on('keyDown', listener);
    console.log('Key listener added');
    return listener;
  };

  removeKeydownListener = (listener: (event: SupportedKeys) => void): void => {
    this.eventEmitter.off('keyDown', listener);
    console.log('Key listener removed');
  };

  emitKeyDown = (key: SupportedKeys): void => {
    this.eventEmitter.emit('keyDown', key);
  };

  cleanup = (): void => {
    KeyEvent.removeKeyDownListener();
  };
}

export default new RemoteControlManager();