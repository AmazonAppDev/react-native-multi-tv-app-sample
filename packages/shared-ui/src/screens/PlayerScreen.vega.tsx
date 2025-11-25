import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { SpatialNavigationRoot } from 'react-tv-space-navigation';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  IKeplerAppStateManager,
  useKeplerAppStateManager,
} from '@amazon-devices/react-native-kepler';
import { VideoPlayer as W3CVideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import RemoteControlManager from '../app/remote-control/RemoteControlManager';
import { SupportedKeys } from '../app/remote-control/SupportedKeys';
import VideoOverlay from '../components/player/VideoOverlay.vega';
import ExitButton from '../components/player/ExitButton';
import VideoPlayer from '../components/player/VideoPlayer.vega';
import { RootStackParamList } from '../navigation/types';
import { VideoHandler } from '../utils/VideoHandler.kepler';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;
type PlayerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Player'
>;

/**
 * PlayerScreen for Vega/Kepler Platform
 *
 * This Kepler-specific player screen uses W3C Media APIs and Amazon's
 * native video rendering stack for optimal Fire TV performance.
 *
 * Key differences from standard PlayerScreen:
 * - Uses VideoHandler class for video lifecycle management
 * - Uses W3C Media VideoPlayer instead of react-native-video
 * - Integrates with Kepler Media Controls (KMC)
 * - Uses KeplerVideoSurfaceView for hardware-accelerated rendering
 * - Handles Fire TV remote control events
 */
export default function PlayerScreen() {
  const route = useRoute<PlayerScreenRouteProp>();
  const navigation = useNavigation<PlayerScreenNavigationProp>();
  const { movie, headerImage } = route.params;
  const isFocused = useIsFocused();

  // Kepler-specific hooks
  const keplerAppStateManager: IKeplerAppStateManager =
    useKeplerAppStateManager();
  const componentInstance = keplerAppStateManager.getComponentInstance();

  // Video state
  const [paused, setPaused] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(false);
  const [isVideoBuffering, setIsVideoBuffering] = useState<boolean>(true);
  const [isVideoInitialized, setIsVideoInitialized] = useState<boolean>(false);
  const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);
  const [isVideoError, setIsVideoError] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Refs
  const videoRef = useRef<W3CVideoPlayer | null>(null);
  const surfaceHandleRef = useRef<string | null>(null);
  const captionViewHandleRef = useRef<string | null>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const videoHandlerRef = useRef<VideoHandler | null>(null);

  // Update refs when state changes
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  /**
   * Show controls with auto-hide
   */
  const showControls = useCallback(() => {
    setControlsVisible(true);

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 5000);
  }, []);

  /**
   * Seek to a specific time
   */
  const seek = useCallback((time: number) => {
    if (videoHandlerRef.current && durationRef.current) {
      try {
        const clampedTime = Math.max(0, Math.min(time, durationRef.current));
        videoHandlerRef.current.seek(clampedTime);
        setCurrentTime(clampedTime);
        currentTimeRef.current = clampedTime;
        showControls();
      } catch (e) {
        console.warn('[PlayerScreen.kepler] Seek error:', e);
      }
    }
  }, [showControls]);

  /**
   * Toggle play/pause
   */
  const togglePausePlay = useCallback(() => {
    if (videoHandlerRef.current) {
      try {
        if (videoHandlerRef.current.isPaused()) {
          videoHandlerRef.current.play();
          setPaused(false);
        } else {
          videoHandlerRef.current.pause();
          setPaused(true);
        }
        showControls();
      } catch (e) {
        console.warn('[PlayerScreen.kepler] Play/pause error:', e);
      }
    }
  }, [showControls]);

  /**
   * Navigate back with cleanup
   */
  const navigateBack = useCallback(() => {
    console.log('[PlayerScreen.kepler] - Navigating back');

    // Clear surface and caption handles
    if (surfaceHandleRef.current && videoRef.current) {
      videoRef.current.clearSurfaceHandle(surfaceHandleRef.current);
    }
    if (captionViewHandleRef.current && videoRef.current) {
      videoRef.current.clearCaptionViewHandle(captionViewHandleRef.current);
    }

    // Destroy video elements
    videoHandlerRef.current?.destroyVideoElements();
    videoRef.current = null;

    // Navigate back after short delay
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  }, [navigation]);

  /**
   * Initialize video handler and start playback
   */
  useEffect(() => {
    if (!isFocused) return;

    console.log('[PlayerScreen.kepler] - Initializing video handler');

    // Create video handler
    videoHandlerRef.current = new VideoHandler(
      videoRef,
      movie,
      headerImage,
      setIsVideoInitialized,
      setIsVideoEnded,
      setIsVideoError,
      setCurrentTime,
      setDuration,
      setIsVideoBuffering,
    );

    // Start pre-buffering video
    videoHandlerRef.current.preBufferVideo(componentInstance);

    return () => {
      // Cleanup on unmount
      console.log('[PlayerScreen.kepler] - Cleaning up video handler');
      if (surfaceHandleRef.current && videoRef.current) {
        videoRef.current.clearSurfaceHandle(surfaceHandleRef.current);
      }
      if (captionViewHandleRef.current && videoRef.current) {
        videoRef.current.clearCaptionViewHandle(captionViewHandleRef.current);
      }
      videoHandlerRef.current?.destroyVideoElements();
      videoRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie, headerImage, isFocused]);

  /**
   * Handle video end - pause, show controls, and navigate back
   */
  useEffect(() => {
    if (isVideoEnded) {
      setPaused(true);
      setControlsVisible(true);
      navigateBack();
    }
  }, [isVideoEnded, navigateBack]);

  /**
   * Show controls when video starts
   */
  useEffect(() => {
    if (isVideoInitialized && duration > 0) {
      showControls();
    }
  }, [isVideoInitialized, duration, showControls]);

  /**
   * Handle remote control key presses
   */
  useEffect(() => {
    const handleKeyDown = (key: SupportedKeys) => {
      try {
        switch (key) {
          case SupportedKeys.Right:
          case SupportedKeys.FastForward:
            seek(currentTimeRef.current + 10);
            break;
          case SupportedKeys.Left:
          case SupportedKeys.Rewind:
            seek(currentTimeRef.current - 10);
            break;
          case SupportedKeys.Back:
            navigateBack();
            break;
          case SupportedKeys.PlayPause:
            togglePausePlay();
            break;
          default:
            showControls();
            break;
        }
      } catch (e) {
        console.error('[PlayerScreen.kepler] Key handler error:', e);
      }
    };

    const listener = RemoteControlManager.addKeydownListener(handleKeyDown);

    // Setup hardware back button listener
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigateBack();
        return true;
      },
    );

    return () => {
      RemoteControlManager.removeKeydownListener(listener);
      backHandler.remove();
    };
  }, [seek, togglePausePlay, showControls, navigateBack]);

  /**
   * Handle surface view creation
   */
  const onSurfaceViewCreated = useCallback((surfaceHandle: string) => {
    console.log('[PlayerScreen.kepler] - Surface view created:', surfaceHandle);
    surfaceHandleRef.current = surfaceHandle;

    // Set surface handle on video player
    if (videoRef.current) {
      videoRef.current.setSurfaceHandle(surfaceHandle);
      // Start playback once surface is set
      videoRef.current.play();
      setPaused(false);
    }
  }, []);

  /**
   * Handle surface view destruction
   */
  const onSurfaceViewDestroyed = useCallback((surfaceHandle: string) => {
    console.log(
      '[PlayerScreen.kepler] - Surface view destroyed:',
      surfaceHandle,
    );
    if (videoRef.current) {
      videoRef.current.clearSurfaceHandle(surfaceHandle);
    }
    surfaceHandleRef.current = null;
  }, []);

  /**
   * Handle caption view creation
   */
  const onCaptionViewCreated = useCallback((captionHandle: string) => {
    console.log('[PlayerScreen.kepler] - Caption view created:', captionHandle);
    captionViewHandleRef.current = captionHandle;

    if (videoRef.current) {
      videoRef.current.setCaptionViewHandle(captionHandle);
    }
  }, []);

  /**
   * Handle caption view destruction
   */
  const onCaptionViewDestroyed = useCallback((captionHandle: string) => {
    console.log(
      '[PlayerScreen.kepler] - Caption view destroyed:',
      captionHandle,
    );
    if (videoRef.current) {
      videoRef.current.clearCaptionViewHandle(captionHandle);
    }
    captionViewHandleRef.current = null;
  }, []);

  const styles = usePlayerStyles();

  if (isVideoError) {
    return (
      <SpatialNavigationRoot isActive={isFocused}>
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <ExitButton onSelect={navigateBack} />
          </View>
        </View>
      </SpatialNavigationRoot>
    );
  }

  return (
    <SpatialNavigationRoot isActive={isFocused}>
      <View style={styles.container}>
        {/* Kepler Video Player with native surface rendering */}
        <VideoPlayer
          movie={movie}
          headerImage={headerImage}
          showCaptions={false}
          onSurfaceViewCreated={onSurfaceViewCreated}
          onSurfaceViewDestroyed={onSurfaceViewDestroyed}
          onCaptionViewCreated={onCaptionViewCreated}
          onCaptionViewDestroyed={onCaptionViewDestroyed}
          isVideoInitialized={isVideoInitialized}
        />

        {/* Custom controls overlay with buffering indicator */}
        {!!durationRef.current && (
          <VideoOverlay
            visible={controlsVisible}
            paused={paused}
            onPlayPause={togglePausePlay}
            onExit={navigateBack}
            currentTime={currentTime}
            duration={durationRef.current}
            isBuffering={isVideoBuffering}
          />
        )}
      </View>
    </SpatialNavigationRoot>
  );
}

const usePlayerStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    errorContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
  });
};
