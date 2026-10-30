/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

// The remote's Play/Pause must toggle playback once. With Kepler Media Controls (KMC) focus, the system sends the key
// to the media control handler, so VideoHandler says so (mediaControlsActive) and the player screen leaves the key to
// it; the screen's paused state follows the player's own 'play' and 'pause' events.

jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  VideoPlayer: jest.fn(),
  KeplerMediaControlHandler: class {},
}));

import {VideoHandler} from '@multi-tv/shared-ui/src/utils/VideoHandler.kepler';

/** A stand-in for the W3C VideoPlayer: records listeners and media control focus. */
function fakePlayer(opts: {focusFails?: boolean} = {}) {
  const listeners: Record<string, () => void> = {};
  return {
    listeners,
    paused: true,
    autoplay: true,
    setMediaControlFocus: jest.fn(() =>
      opts.focusFails
        ? Promise.reject(new Error('no focus'))
        : Promise.resolve(),
    ),
    initialize: jest.fn(() => Promise.resolve()),
    addEventListener: jest.fn((name: string, fn: () => void) => {
      listeners[name] = fn;
    }),
    removeEventListener: jest.fn((name: string) => {
      delete listeners[name];
    }),
    pause: jest.fn(),
    play: jest.fn(),
    deinitializeSync: jest.fn(() => 'success'),
  };
}

function handlerFor(
  player: ReturnType<typeof fakePlayer>,
  setPaused = jest.fn(),
) {
  const ref = {current: player} as any;
  const noop = jest.fn();
  // destroyVideoElements() runs first and clears the ref; hand the same fake back as the "new" player.
  const {VideoPlayer} = jest.requireMock(
    '@amazon-devices/react-native-w3cmedia',
  );
  VideoPlayer.mockImplementation(() => player);
  const handler = new VideoHandler(
    ref,
    'https://example.com/video.mp4',
    '',
    noop,
    noop,
    noop,
    noop,
    noop,
    noop,
    setPaused,
  );
  return {handler, ref, setPaused};
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('VideoHandler: the remote Play/Pause key is handled once', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('says media controls handle the key once KMC has focus', async () => {
    const player = fakePlayer();
    const {handler} = handlerFor(player);
    expect(handler.mediaControlsActive).toBe(false);
    await handler.preBufferVideo({} as any);
    expect(player.setMediaControlFocus).toHaveBeenCalledTimes(1);
    expect(handler.mediaControlsActive).toBe(true);
  });

  it('leaves the key to the screen without a component instance, or when KMC focus fails', async () => {
    const withoutInstance = handlerFor(fakePlayer()).handler;
    await withoutInstance.preBufferVideo();
    expect(withoutInstance.mediaControlsActive).toBe(false);

    const refused = handlerFor(fakePlayer({focusFails: true})).handler;
    await refused.preBufferVideo({} as any);
    expect(refused.mediaControlsActive).toBe(false);
  });

  it("follows the player's 'play' and 'pause' events, so the on-screen button matches a toggle by the media controls", async () => {
    const player = fakePlayer();
    const {handler, setPaused} = handlerFor(player);
    await handler.preBufferVideo({} as any);
    await flush(); // initialize() resolves, then the listeners are set up
    player.listeners.pause();
    expect(setPaused).toHaveBeenLastCalledWith(true);
    player.listeners.play();
    expect(setPaused).toHaveBeenLastCalledWith(false);
  });

  it('forgets the media control focus when the player is destroyed', async () => {
    const {handler} = handlerFor(fakePlayer());
    await handler.preBufferVideo({} as any);
    expect(handler.destroyVideoElements()).toBe(true);
    expect(handler.mediaControlsActive).toBe(false);
  });
});
