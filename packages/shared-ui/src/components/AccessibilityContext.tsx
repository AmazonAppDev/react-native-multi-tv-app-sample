import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  AccessibilityPreferences,
  Theme,
  createTheme,
  defaultAccessibilityPreferences,
  defaultTheme,
} from '../theme/accessibility';

interface AccessibilityContextType {
  /** What the app uses: the device settings, with any choice made in Settings on top. */
  preferences: AccessibilityPreferences;
  /** What the device reports, where the platform reports it. */
  systemPreferences: AccessibilityPreferences;
  /** The choices made in Settings. Empty means "follow the device". */
  overrides: Partial<AccessibilityPreferences>;
  setPreference: (key: keyof AccessibilityPreferences, value: boolean) => void;
  /** Forget the choices made in Settings and follow the device again. */
  resetToSystem: () => void;
  theme: Theme;
}

// Without a provider, screens get the standard theme and the switches do nothing.
const AccessibilityContext = createContext<AccessibilityContextType>({
  preferences: defaultAccessibilityPreferences,
  systemPreferences: defaultAccessibilityPreferences,
  overrides: {},
  setPreference: () => {},
  resetToSystem: () => {},
  theme: defaultTheme,
});

type Subscription = { remove: () => void } | undefined;

// Each platform reports a different subset: Android TV, Fire OS and Vega OS report reduce motion
// and high text contrast, tvOS reports reduce motion, the web reads prefers-reduced-motion. Vega OS
// sends no reduceMotionChanged event, so there reduce motion is read once, at launch.
// A query the platform does not have, or one that fails, leaves the default in place, and so does
// a listener that throws because its native module is missing.
const watchSystemSetting = (
  query: (() => Promise<boolean>) | undefined,
  eventName: 'reduceMotionChanged' | 'highTextContrastChanged',
  onChange: (enabled: boolean) => void,
): Subscription => {
  if (typeof query !== 'function') {
    return undefined;
  }
  query.call(AccessibilityInfo).then(onChange, () => {});
  try {
    return AccessibilityInfo.addEventListener(eventName, onChange) as Subscription;
  } catch {
    return undefined;
  }
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
  /** Start with these choices instead of following the device (tests, or a saved profile). */
  initialOverrides?: Partial<AccessibilityPreferences>;
}

export const AccessibilityProvider = ({ children, initialOverrides = {} }: AccessibilityProviderProps) => {
  const [systemPreferences, setSystemPreferences] = useState(defaultAccessibilityPreferences);
  const [overrides, setOverrides] = useState<Partial<AccessibilityPreferences>>(initialOverrides);

  useEffect(() => {
    let active = true;
    const update = (key: keyof AccessibilityPreferences) => (enabled: boolean) => {
      if (active) {
        setSystemPreferences((current) => (current[key] === enabled ? current : { ...current, [key]: enabled }));
      }
    };
    const subscriptions = [
      watchSystemSetting(AccessibilityInfo.isReduceMotionEnabled, 'reduceMotionChanged', update('reduceMotion')),
      watchSystemSetting(
        AccessibilityInfo.isHighTextContrastEnabled,
        'highTextContrastChanged',
        update('highContrast'),
      ),
    ];
    // Larger text has no system query on purpose: React Native already scales <Text> by the
    // device font size where the platform has one, so reading it here would apply it twice.
    return () => {
      active = false;
      subscriptions.forEach((subscription) => subscription?.remove());
    };
  }, []);

  const setPreference = useCallback((key: keyof AccessibilityPreferences, value: boolean) => {
    setOverrides((current) => ({ ...current, [key]: value }));
  }, []);

  const resetToSystem = useCallback(() => setOverrides({}), []);

  const preferences = useMemo(() => ({ ...systemPreferences, ...overrides }), [systemPreferences, overrides]);
  const theme = useMemo(() => createTheme(preferences), [preferences]);

  const value = useMemo(
    () => ({ preferences, systemPreferences, overrides, setPreference, resetToSystem, theme }),
    [preferences, systemPreferences, overrides, setPreference, resetToSystem, theme],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};

export const useAccessibility = (): AccessibilityContextType => useContext(AccessibilityContext);

/** The theme for the current accessibility preferences. */
export const useTheme = (): Theme => useContext(AccessibilityContext).theme;
