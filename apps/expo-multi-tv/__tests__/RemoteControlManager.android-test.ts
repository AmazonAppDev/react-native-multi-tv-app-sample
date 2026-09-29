import KeyEvent from 'react-native-keyevent';
import RemoteControlManager from '../../../packages/shared-ui/src/app/remote-control/RemoteControlManager.android';
import { SupportedKeys } from '../../../packages/shared-ui/src/app/remote-control/SupportedKeys';

jest.mock('react-native-keyevent', () => ({
  __esModule: true,
  default: {
    onKeyDownListener: jest.fn(),
    onKeyUpListener: jest.fn(),
    removeKeyDownListener: jest.fn(),
    removeKeyUpListener: jest.fn(),
  },
}));

const keyEventMock = KeyEvent as jest.Mocked<typeof KeyEvent>;
const onKeyDown = keyEventMock.onKeyDownListener.mock.calls[0][0];

describe('RemoteControlManager.android', () => {
  const listener = jest.fn();

  beforeAll(() => {
    RemoteControlManager.addKeydownListener(listener);
  });

  beforeEach(() => {
    listener.mockClear();
  });

  afterAll(() => {
    RemoteControlManager.removeKeydownListener(listener);
  });

  it('emits directional keys on key down', () => {
    onKeyDown({ keyCode: 22 });

    expect(listener).toHaveBeenCalledWith(SupportedKeys.Right);
  });

  it.each([23, 66])('emits Enter for key code %i on key down', (keyCode) => {
    onKeyDown({ keyCode });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(SupportedKeys.Enter);
  });
});
