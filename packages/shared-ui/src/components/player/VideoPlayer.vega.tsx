import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  KeplerVideoSurfaceView,
  KeplerCaptionsView,
  VideoPlayer as W3CVideoPlayer,
} from '@amazon-devices/react-native-w3cmedia';

/**
 * VideoPlayer component for Vega/Kepler platform
 *
 * This component uses Kepler-specific video rendering with:
 * - KeplerVideoSurfaceView: Native video surface for hardware-accelerated playback
 * - KeplerCaptionsView: Native caption/subtitle rendering
 * - W3C Media VideoPlayer: Standards-based video playback API
 *
 * Unlike the standard VideoPlayer that uses react-native-video, this Kepler
 * implementation leverages Amazon's native video stack for optimal Fire TV performance.
 */

export interface KeplerVideoPlayerProps {
  /** Video URI - can be MP4, HLS (.m3u8), or DASH (.mpd) */
  movie: string;
  /** Poster image URI */
  headerImage: string;
  /** Whether to show captions */
  showCaptions?: boolean;
  /** Callback when video surface is created */
  onSurfaceViewCreated: (surfaceHandle: string) => void;
  /** Callback when video surface is destroyed */
  onSurfaceViewDestroyed: (surfaceHandle: string) => void;
  /** Callback when caption view is created */
  onCaptionViewCreated?: (captionHandle: string) => void;
  /** Callback when caption view is destroyed */
  onCaptionViewDestroyed?: (captionHandle: string) => void;
  /** Whether video is initialized and ready */
  isVideoInitialized: boolean;
}

/**
 * Ref interface exposed to parent components
 * This matches the react-native-video VideoRef interface for compatibility
 */
export interface KeplerVideoRef {
  /** W3C Media VideoPlayer instance */
  videoPlayer: W3CVideoPlayer | null;
  /** Get current playback time */
  getCurrentTime: () => number;
  /** Get total video duration */
  getDuration: () => number;
  /** Check if video is paused */
  isPaused: () => boolean;
}

/**
 * Kepler Video Player Component
 *
 * Renders a video player using Amazon Kepler's native video components.
 * This provides better performance and integration with Fire TV compared
 * to the standard react-native-video player.
 *
 * The component manages:
 * - Video surface lifecycle (creation/destruction)
 * - Caption view lifecycle (creation/destruction)
 * - Surface handle management
 *
 * The actual video playback logic is handled by VideoHandler class which
 * manages the W3C Media VideoPlayer instance.
 */
const VideoPlayer = forwardRef<KeplerVideoRef, KeplerVideoPlayerProps>(
  (
    {
      onSurfaceViewCreated,
      onSurfaceViewDestroyed,
      onCaptionViewCreated,
      onCaptionViewDestroyed,
      showCaptions = false,
      isVideoInitialized,
    },
    ref,
  ) => {
    // Internal state for video player (managed externally by VideoHandler)
    const videoPlayerRef = React.useRef<W3CVideoPlayer | null>(null);

    /**
     * Handle surface view creation
     * Called when KeplerVideoSurfaceView is mounted
     */
    const handleSurfaceCreated = useCallback(
      (surfaceHandle: string) => {
        console.info('[VideoPlayer.kepler] - Surface view created:', surfaceHandle);
        onSurfaceViewCreated(surfaceHandle);
      },
      [onSurfaceViewCreated],
    );

    /**
     * Handle surface view destruction
     * Called when KeplerVideoSurfaceView is unmounted
     */
    const handleSurfaceDestroyed = useCallback(
      (surfaceHandle: string) => {
        console.info('[VideoPlayer.kepler] - Surface view destroyed:', surfaceHandle);
        onSurfaceViewDestroyed(surfaceHandle);
      },
      [onSurfaceViewDestroyed],
    );

    /**
     * Handle caption view creation
     * Called when KeplerCaptionsView is mounted
     */
    const handleCaptionCreated = useCallback(
      (captionHandle: string) => {
        console.info('[VideoPlayer.kepler] - Caption view created:', captionHandle);
        onCaptionViewCreated?.(captionHandle);
      },
      [onCaptionViewCreated],
    );

    /**
     * Handle caption view destruction
     * Called when KeplerCaptionsView is unmounted
     */
    const handleCaptionDestroyed = useCallback(
      (captionHandle: string) => {
        console.info('[VideoPlayer.kepler] - Caption view destroyed:', captionHandle);
        onCaptionViewDestroyed?.(captionHandle);
      },
      [onCaptionViewDestroyed],
    );

    /**
     * Expose ref methods to parent components
     * This provides a compatible interface with react-native-video
     */
    useImperativeHandle(ref, () => ({
      videoPlayer: videoPlayerRef.current,
      getCurrentTime: () => videoPlayerRef.current?.currentTime || 0,
      getDuration: () => videoPlayerRef.current?.duration || 0,
      isPaused: () => videoPlayerRef.current?.paused ?? true,
    }));

    return (
      <>
        {/* Render video surface only when video is initialized */}
        {isVideoInitialized && (
          <>
            {/* Native video surface for hardware-accelerated playback */}
            <KeplerVideoSurfaceView
              style={styles.videoSurface}
              onSurfaceViewCreated={handleSurfaceCreated}
              onSurfaceViewDestroyed={handleSurfaceDestroyed}
              testID="kepler-video-surface-view"
            />

            {/* Native caption view for subtitle rendering */}
            <KeplerCaptionsView
              style={styles.captions}
              onCaptionViewCreated={handleCaptionCreated}
              onCaptionViewDestroyed={handleCaptionDestroyed}
              show={showCaptions}
              testID="kepler-captions-view"
            />
          </>
        )}
      </>
    );
  },
);

VideoPlayer.displayName = 'VideoPlayer';

const styles = StyleSheet.create({
  videoSurface: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  captions: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default VideoPlayer;
