import { IComponentInstance } from '@amazon-devices/react-native-kepler';
import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';
import React from 'react';
import { Platform } from 'react-native';

// Default video resolution settings based on platform (TV vs mobile/web)
const DEFAULT_ABR_WIDTH: number = Platform.isTV ? 3840 : 1919;
const DEFAULT_ABR_HEIGHT: number = Platform.isTV ? 2160 : 1079;

// Skip interval for seek operations (in seconds)
const SKIP_INTERVAL_SECONDS = 10;

// Status types returned when deinitializing the media player
type MediaPlayerDeInitStatus = 'success' | 'timedout' | 'invalid';

/**
 * Video format types supported by the player
 */
export enum VideoFileTypes {
  MP4 = 'MP4',
  HLS = 'HLS',
  DASH = 'DASH',
}

/**
 * VideoHandler Class
 *
 * This class manages video playback functionality for Vega/Kepler platform including:
 * - Video player initialization and destruction
 * - Loading different video formats (MP4, HLS)
 * - Handling video events (play, pause, seek, error, etc.)
 * - Buffering state management
 * - Integration with Kepler Media Controls (KMC)
 */
export class VideoHandler {
  // Core video player references
  /** Reference to the main video player instance */
  public videoRef: React.MutableRefObject<VideoPlayer | null>;

  /** Current video URI */
  public videoUri: string;

  /** Poster image URI */
  public posterUri: string;

  /** Current video format type (MP4, HLS, etc.) */
  public selectedFileType: VideoFileTypes;

  // State management functions passed from React components
  /** Updates video initialization status */
  public setIsVideoInitialized: React.Dispatch<React.SetStateAction<boolean>>;

  /** Updates video ended status */
  public setIsVideoEnded: React.Dispatch<React.SetStateAction<boolean>>;

  /** Updates video error status */
  public setIsVideoError: React.Dispatch<React.SetStateAction<boolean>>;

  /** Updates current playback time */
  public setCurrentTime: React.Dispatch<React.SetStateAction<number>>;

  /** Updates total video duration */
  public setDuration: React.Dispatch<React.SetStateAction<number>>;

  /** Updates buffering indicator visibility */
  public setShowBuffering: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * Constructor - Initializes the VideoHandler with required dependencies
   */
  constructor(
    videoRef: React.MutableRefObject<VideoPlayer | null>,
    videoUri: string,
    posterUri: string,
    setIsVideoInitialized: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVideoEnded: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVideoError: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
    setDuration: React.Dispatch<React.SetStateAction<number>>,
    setShowBuffering: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    this.videoRef = videoRef;
    this.videoUri = videoUri;
    this.posterUri = posterUri;
    this.selectedFileType = this.detectVideoFormat(videoUri);
    this.setIsVideoInitialized = setIsVideoInitialized;
    this.setIsVideoEnded = setIsVideoEnded;
    this.setIsVideoError = setIsVideoError;
    this.setCurrentTime = setCurrentTime;
    this.setDuration = setDuration;
    this.setShowBuffering = setShowBuffering;
  }

  /**
   * Detects video format based on URI
   */
  private detectVideoFormat(uri: string): VideoFileTypes {
    const lowerUri = uri.toLowerCase();
    if (lowerUri.includes('.m3u8')) {
      return VideoFileTypes.HLS;
    } else if (lowerUri.includes('.mpd')) {
      return VideoFileTypes.DASH;
    }
    return VideoFileTypes.MP4;
  }

  /**
   * Updates the video URI and format
   */
  setVideoUri = (uri: string, posterUri?: string) => {
    this.videoUri = uri;
    if (posterUri) {
      this.posterUri = posterUri;
    }
    this.selectedFileType = this.detectVideoFormat(uri);
  };

  /**
   * Prepares and initializes the video player for playback
   *
   * This method:
   * 1. Destroys any existing video elements
   * 2. Creates a new VideoPlayer instance if needed
   * 3. Sets up Kepler Media Controls (KMC) integration
   * 4. Initializes the video player
   * 5. Sets up event listeners
   * 6. Loads the video content
   */
  preBufferVideo = async (componentInstance?: IComponentInstance) => {
    await this.destroyVideoElements();
    console.info(
      '[VideoHandler] - preBufferVideo - Attempt to prebuffer Video Player',
    );

    if (this.videoRef.current == null) {
      console.info(
        '[VideoHandler] - preBufferVideo - Current video is null, create new Video Player',
      );
      this.videoRef.current = new VideoPlayer();
    }
    (global as any).gmedia = this.videoRef.current;

    // KMC (Kepler Media Controls) integration
    if (componentInstance) {
      try {
        console.info(
          '[VideoHandler] - preBufferVideo - KMC: set Media Control Focus',
        );
        const { AppOverrideMediaControlHandler } = await import('./AppOverrideMediaControlHandler.kepler');
        await this.videoRef.current.setMediaControlFocus(
          componentInstance,
          new AppOverrideMediaControlHandler(
            this.videoRef.current as VideoPlayer,
            false,
          ),
        );
      } catch (error) {
        console.error('[VideoHandler] - Error during KMC execution', error);
      }
    }

    // Initialize the video player and set up content loading
    this.videoRef.current
      .initialize()
      .then(() => {
        console.log('[VideoHandler] - Video Player Initialized');
        this.setupEventListeners();
        this.videoRef!!.current!!.autoplay = false;
        this.loadVideoElements();
      })
      .catch((error) => {
        console.error('[VideoHandler] - Failed to initialize Video');
        console.error(error);
        this.setIsVideoError(true);
      });
  };

  /**
   * Loads video content and configures player settings
   */
  loadVideoElements = () => {
    if (this.videoRef !== null && this.videoRef.current !== null) {
      this.videoRef.current.autoplay = false;
      this.videoRef.current.defaultSeekIntervalInSec = SKIP_INTERVAL_SECONDS;

      // For now, load as static media (MP4). Future enhancement: add Shaka player for HLS/DASH
      this.loadStaticMediaPlayer(this.videoRef.current);
    }
  };

  /**
   * Loads static media content (MP4 files)
   */
  loadStaticMediaPlayer = (video: {
    src: string;
    autoplay: boolean;
    pause: () => void;
    load: () => void;
  }) => {
    video.src = this.videoUri;
    video.pause();
    console.log(
      `[VideoHandler] - loadStaticMediaPlayer - Loading with: ${video.src}`,
    );
    video.load();
  };

  // === VIDEO EVENT HANDLERS ===

  /**
   * Handles the 'loadedmetadata' event
   */
  onLoadedMetadata = () => {
    if (this.videoRef.current) {
      console.log('[VideoHandler] - onLoadedMetadata');
      const duration = this.videoRef.current.duration || 0;
      this.setDuration(duration);
      this.setIsVideoInitialized(true);
    }
  };

  /**
   * Handles the 'ended' event
   */
  onEnded = () => {
    if (this.videoRef.current?.ended) {
      console.log('[VideoHandler] - onEnded');
      this.setIsVideoEnded(true);
    }
  };

  /**
   * Handles video playback errors
   */
  onError = (event: any) => {
    if (!event?.target) {
      console.error('[VideoHandler] - Invalid error event');
      this.setIsVideoError(true);
      return;
    }

    const target = event.target;
    const error = target.mediaControlStateUtil?.mError;
    const errorMessage = error?.message_ || 'Unknown error';

    console.error(
      '[VideoHandler] - Playback Error:\n' +
        `Format: ${this.selectedFileType}\n` +
        `URI: ${this.videoUri}\n` +
        `Details: ${errorMessage}`,
    );
    this.setIsVideoError(true);
  };

  /**
   * Handles the 'timeupdate' event
   */
  onTimeUpdate = () => {
    if (this.videoRef.current) {
      const currentTime = this.videoRef.current.currentTime || 0;
      this.setCurrentTime(currentTime);
    }

    // For static media (MP4), use timeupdate to hide buffering
    if (this.selectedFileType === VideoFileTypes.MP4) {
      this.setShowBuffering(false);
    }
  };

  /**
   * Handles the 'waiting' event - shows buffering indicator
   */
  onWaiting = () => {
    console.log('[VideoHandler] - onWaiting');
    this.setShowBuffering(true);
  };

  /**
   * Handles the 'seeking' event - shows buffering indicator
   */
  onSeeking = () => {
    console.log('[VideoHandler] - onSeeking');
    this.setShowBuffering(true);
  };

  /**
   * Handles the 'seeked' event - hides buffering indicator
   */
  onSeeked = () => {
    console.log('[VideoHandler] - onSeeked');
    this.setShowBuffering(false);
  };

  /**
   * Handles the 'playing' event - hides buffering indicator
   */
  onPlaying = () => {
    console.log('[VideoHandler] - onPlaying');
    this.setShowBuffering(false);
  };

  // === EVENT LISTENER MANAGEMENT ===

  /**
   * Sets up all video event listeners
   */
  setupEventListeners = () => {
    this.videoRef.current?.addEventListener(
      'loadedmetadata',
      this.onLoadedMetadata,
    );
    this.videoRef.current?.addEventListener('timeupdate', this.onTimeUpdate);
    this.videoRef.current?.addEventListener('ended', this.onEnded);
    this.videoRef.current?.addEventListener('error', this.onError);
    this.videoRef.current?.addEventListener('waiting', this.onWaiting);
    this.videoRef.current?.addEventListener('seeking', this.onSeeking);
    this.videoRef.current?.addEventListener('seeked', this.onSeeked);
    this.videoRef.current?.addEventListener('playing', this.onPlaying);
  };

  /**
   * Removes all video event listeners
   */
  removeEventListeners = () => {
    this.videoRef.current?.removeEventListener(
      'loadedmetadata',
      this.onLoadedMetadata,
    );
    this.videoRef.current?.removeEventListener('timeupdate', this.onTimeUpdate);
    this.videoRef.current?.removeEventListener('ended', this.onEnded);
    this.videoRef.current?.removeEventListener('error', this.onError);
    this.videoRef.current?.removeEventListener('waiting', this.onWaiting);
    this.videoRef.current?.removeEventListener('seeking', this.onSeeking);
    this.videoRef.current?.removeEventListener('seeked', this.onSeeked);
    this.videoRef.current?.removeEventListener('playing', this.onPlaying);
  };

  // === CLEANUP AND DESTRUCTION ===

  /**
   * Synchronously destroys the media player and cleans up resources
   */
  destroyMediaPlayerSync = (timeout: number = 1500): boolean => {
    console.log('[VideoHandler] - Starting synchronous media player destruction');

    try {
      // Pause current playback
      if (this.videoRef.current) {
        console.log('[VideoHandler] - Pausing media');
        this.videoRef.current.pause();
      }

      // Remove all event listeners
      this.removeEventListeners();

      // Deinitialize the main video player
      if (this.videoRef.current) {
        console.log('[VideoHandler] - Deinitializing media synchronously');
        const result: MediaPlayerDeInitStatus =
          this.videoRef.current.deinitializeSync(timeout);

        if (result !== 'success') {
          console.error(`[VideoHandler] - Deinitialize sync failed - ${result}`);
          return false;
        }

        console.log('[VideoHandler] - Deinitialize sync completed successfully');
        (global as any).gmedia = null;
        this.videoRef.current = null;
      }

      console.log('[VideoHandler] - Sync destruction completed');
      return true;
    } catch (err) {
      console.error('[VideoHandler] - Error during destruction: ', err);
      return false;
    }
  };

  /**
   * Destroys video elements and cleans up resources
   */
  destroyVideoElements = (): boolean => {
    if (!this.videoRef.current) {
      console.log('[VideoHandler] - No video reference to destroy');
      return false;
    }

    console.log('[VideoHandler] - Triggering synchronous video elements destruction');
    return this.destroyMediaPlayerSync();
  };

  /**
   * Play the video
   */
  play = () => {
    if (this.videoRef.current) {
      console.log('[VideoHandler] - Play');
      this.videoRef.current.play();
    }
  };

  /**
   * Pause the video
   */
  pause = () => {
    if (this.videoRef.current) {
      console.log('[VideoHandler] - Pause');
      this.videoRef.current.pause();
    }
  };

  /**
   * Seek to a specific time
   */
  seek = (time: number) => {
    if (this.videoRef.current) {
      console.log(`[VideoHandler] - Seek to ${time}`);
      this.videoRef.current.currentTime = time;
    }
  };

  /**
   * Get current paused state
   */
  isPaused = (): boolean => {
    return this.videoRef.current?.paused ?? true;
  };
}
