import React from 'react';
import { AccessibilityInfo } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import {
  AccessibilityProvider,
  useAccessibility,
} from '../../../packages/shared-ui/src/components/AccessibilityContext';
import { colors } from '../../../packages/shared-ui/src/theme/colors';
import { highContrastColors } from '../../../packages/shared-ui/src/theme/accessibility';

type Listener = (enabled: boolean) => void;

const info = AccessibilityInfo as jest.Mocked<typeof AccessibilityInfo>;
let listeners: Record<string, Listener>;
let removed: string[];

// What the provider exposes, as of the latest render.
let current: ReturnType<typeof useAccessibility>;
const Probe = () => {
  current = useAccessibility();
  return null;
};

const renderProvider = async (
  props: { initialOverrides?: Parameters<typeof AccessibilityProvider>[0]['initialOverrides'] } = {},
) => {
  let renderer: TestRenderer.ReactTestRenderer | undefined;
  await act(async () => {
    renderer = TestRenderer.create(
      <AccessibilityProvider {...props}>
        <Probe />
      </AccessibilityProvider>,
    );
  });
  return renderer!;
};

const os = (settings: { reduceMotion: boolean; highContrast: boolean }) => {
  info.isReduceMotionEnabled.mockResolvedValue(settings.reduceMotion);
  info.isHighTextContrastEnabled.mockResolvedValue(settings.highContrast);
};

beforeEach(() => {
  listeners = {};
  removed = [];
  info.addEventListener.mockImplementation(((eventName: string, handler: Listener) => {
    listeners[eventName] = handler;
    return { remove: () => removed.push(eventName) };
  }) as never);
  os({ reduceMotion: false, highContrast: false });
});

describe('AccessibilityProvider', () => {
  it('starts from the device settings', async () => {
    os({ reduceMotion: true, highContrast: true });
    await renderProvider();

    expect(current.systemPreferences).toEqual({ highContrast: true, largerText: false, reduceMotion: true });
    expect(current.preferences).toEqual(current.systemPreferences);
    expect(current.theme.colors).toBe(highContrastColors);
    expect(current.theme.focus.scale).toBe(1);
  });

  it('follows the device when a setting changes while the app is open', async () => {
    await renderProvider();
    expect(current.preferences.reduceMotion).toBe(false);

    await act(async () => listeners.reduceMotionChanged(true));
    expect(current.preferences.reduceMotion).toBe(true);

    await act(async () => listeners.highTextContrastChanged(true));
    expect(current.theme.colors).toBe(highContrastColors);
  });

  it('lets a choice made in Settings win over the device, until the viewer asks to follow the device again', async () => {
    os({ reduceMotion: true, highContrast: false });
    await renderProvider();

    await act(async () => current.setPreference('reduceMotion', false));
    await act(async () => current.setPreference('highContrast', true));
    expect(current.preferences).toEqual({ highContrast: true, largerText: false, reduceMotion: false });
    expect(current.overrides).toEqual({ highContrast: true, reduceMotion: false });

    // A device change does not undo the viewer's choice...
    await act(async () => listeners.highTextContrastChanged(false));
    expect(current.preferences.highContrast).toBe(true);

    // ...until they ask to follow the device again.
    await act(async () => current.resetToSystem());
    expect(current.overrides).toEqual({});
    expect(current.preferences).toEqual({ highContrast: false, largerText: false, reduceMotion: true });
    expect(current.theme.colors).toBe(colors);
  });

  it('accepts a starting choice, for a saved profile or a test', async () => {
    await renderProvider({ initialOverrides: { largerText: true } });
    expect(current.preferences.largerText).toBe(true);
    expect(current.theme.fontScale).toBe(1.25);
  });

  it('keeps the defaults on a platform that cannot report a setting, or fails to', async () => {
    const original = info.isHighTextContrastEnabled;
    // tvOS has no high-text-contrast query, and a native module may be missing.
    (info as { isHighTextContrastEnabled?: unknown }).isHighTextContrastEnabled = undefined;
    info.isReduceMotionEnabled.mockRejectedValue(null);
    try {
      await renderProvider();
      expect(current.preferences).toEqual({ highContrast: false, largerText: false, reduceMotion: false });
      expect(Object.keys(listeners)).toEqual(['reduceMotionChanged']);
    } finally {
      info.isHighTextContrastEnabled = original;
    }
  });

  it('keeps the defaults when a listener throws because its native module is missing', async () => {
    // On Vega OS, addEventListener calls the native module directly, so a missing module throws.
    info.addEventListener.mockImplementation((() => {
      throw new Error('AccessibilityInfo native module is not available');
    }) as never);
    const renderer = await renderProvider();
    expect(current.preferences).toEqual({ highContrast: false, largerText: false, reduceMotion: false });
    await act(async () => renderer.unmount());
  });

  it('stops listening when it unmounts', async () => {
    const renderer = await renderProvider();
    await act(async () => renderer.unmount());
    expect(removed.sort()).toEqual(['highTextContrastChanged', 'reduceMotionChanged']);
  });

  it('gives the standard theme to a screen rendered without a provider', async () => {
    await act(async () => {
      TestRenderer.create(<Probe />);
    });
    expect(current.theme.colors).toBe(colors);
    expect(current.theme.fontScale).toBe(1);
  });
});
