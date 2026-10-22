import { SelectedTrackType, TextTrackType } from 'react-native-video';
import { selectCaptionTrack, toTextTracks } from '../../../packages/shared-ui/src/components/player/captionTracks';

const tracks = toTextTracks([
  { url: 'https://example.com/en.vtt', language: 'en', label: 'English' },
  { url: 'https://example.com/es.vtt', language: 'es' },
]);

describe('toTextTracks', () => {
  it('maps catalog captions to WebVTT text tracks', () => {
    expect(tracks).toEqual([
      { title: 'English', language: 'en', type: TextTrackType.VTT, uri: 'https://example.com/en.vtt' },
      { title: 'es', language: 'es', type: TextTrackType.VTT, uri: 'https://example.com/es.vtt' },
    ]);
  });
});

describe('selectCaptionTrack', () => {
  const on = { supported: true, enabled: true };

  it('shows no captions when Closed Captions are off', () => {
    expect(selectCaptionTrack(tracks, { supported: true, enabled: false, locale: 'es' }, 'en-US')).toEqual({
      type: SelectedTrackType.DISABLED,
    });
  });

  it("picks the track in the viewer's caption language, ignoring the region", () => {
    expect(selectCaptionTrack(tracks, { ...on, locale: 'es-MX' }, 'en-US')).toEqual({
      type: SelectedTrackType.LANGUAGE,
      value: 'es',
    });
  });

  it('falls back to the device language when no caption language is set', () => {
    expect(selectCaptionTrack(tracks, { ...on, locale: null }, 'es-ES')).toEqual({
      type: SelectedTrackType.LANGUAGE,
      value: 'es',
    });
  });

  it('falls back to the first track when neither language has a track', () => {
    expect(selectCaptionTrack(tracks, { ...on, locale: 'fr' }, 'de-DE')).toEqual({
      type: SelectedTrackType.LANGUAGE,
      value: 'en',
    });
  });

  it("leaves the choice to the platform player where the TV setting can't be read", () => {
    expect(selectCaptionTrack(tracks, { supported: false, enabled: false, locale: null }, 'en-US')).toEqual({
      type: SelectedTrackType.SYSTEM,
    });
  });
});
