import {
  SelectedTrackType,
  TextTrackType,
  type ISO639_1,
  type SelectedTrack,
  type TextTracks,
} from 'react-native-video';
import type { CaptionTrack } from '../../data/moviesData';

/** The viewer's Closed Captions setting, as read by expo-tv-accessibility-settings. */
export type CaptionPreference = {
  /** False where the TV setting can't be read (Apple TV, web). */
  supported: boolean;
  enabled: boolean;
  /** Caption language chosen in the TV settings (BCP 47, e.g. "es-MX"), or null for the device default. */
  locale: string | null;
};

/** A title's sidecar captions as react-native-video text tracks. */
export function toTextTracks(captions: CaptionTrack[]): TextTracks {
  return captions.map((track) => ({
    title: track.label ?? track.language,
    language: track.language as ISO639_1,
    type: TextTrackType.VTT,
    uri: track.url,
  }));
}

const baseLanguage = (locale: string | null | undefined) => locale?.split('-')[0].toLowerCase();

const deviceLocale = () => Intl.DateTimeFormat().resolvedOptions().locale;

/**
 * The caption track to show for the viewer's Closed Captions setting:
 * - captions off → none;
 * - captions on → the track in the viewer's caption language, else in the device language, else the first track;
 * - setting unavailable (Apple TV, web) → the platform player applies its own system preference.
 *
 * Always an explicit language on Android: react-native-video's Android player only selects text tracks
 * by language, title or index.
 */
export function selectCaptionTrack(
  textTracks: TextTracks,
  preference: CaptionPreference,
  fallbackLocale: string = deviceLocale(),
): SelectedTrack {
  if (!preference.supported) return { type: SelectedTrackType.SYSTEM };
  if (!preference.enabled || textTracks.length === 0) return { type: SelectedTrackType.DISABLED };
  const byLanguage = (language?: string) => textTracks.find((track) => track.language.toLowerCase() === language);
  const track =
    byLanguage(baseLanguage(preference.locale)) ?? byLanguage(baseLanguage(fallbackLocale)) ?? textTracks[0];
  return { type: SelectedTrackType.LANGUAGE, value: track.language };
}
