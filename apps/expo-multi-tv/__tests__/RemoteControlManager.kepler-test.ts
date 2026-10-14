import { TVEventHandler } from 'react-native';
import RemoteControlManager from '../../../packages/shared-ui/src/app/remote-control/RemoteControlManager.kepler';
import { SupportedKeys } from '../../../packages/shared-ui/src/app/remote-control/SupportedKeys';

jest.mock('react-native', () => ({
  TVEventHandler: jest.fn().mockImplementation(() => ({
    enable: jest.fn(),
    disable: jest.fn(),
  })),
}));

const handler = (TVEventHandler as unknown as jest.Mock).mock.results[0].value;
const onHWEvent = handler.enable.mock.calls[0][1];

describe('Vega remote selection', () => {
  const listener = jest.fn();

  beforeAll(() => RemoteControlManager.addKeydownListener(listener));
  beforeEach(() => listener.mockClear());
  afterAll(() => RemoteControlManager.removeKeydownListener(listener));

  it.each(['select', 'enter', 'kpenter'])('selects once for a %s press', (eventType) => {
    onHWEvent(null, { eventType, eventKeyAction: 0 });
    onHWEvent(null, { eventType, eventKeyAction: 1 });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(SupportedKeys.Enter);
  });

  it('preserves events without an explicit key action', () => {
    onHWEvent(null, { eventType: 'select' });
    expect(listener).toHaveBeenCalledWith(SupportedKeys.Enter);
  });
});
