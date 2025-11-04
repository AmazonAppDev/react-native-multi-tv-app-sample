import { IMediaSessionId, ITimeValue } from '@amazon-devices/kepler-media-controls';
import {
  KeplerMediaControlHandler,
  VideoPlayer,
} from '@amazon-devices/react-native-w3cmedia';

const SKIP_INTERVAL_SECONDS = 10;

/**
 * AppOverrideMediaControlHandler
 *
 * Custom media control handler for Kepler platform that extends KeplerMediaControlHandler.
 * This class handles remote control events from Fire TV remotes and integrates them
 * with the W3C Media VideoPlayer.
 *
 * You can override methods from KeplerMediaControlHandler class as needed.
 * This implementation demonstrates overriding common media control actions.
 */
export class AppOverrideMediaControlHandler extends KeplerMediaControlHandler {
  private videoPlayer: VideoPlayer | null = null;
  private clientOverrideNeeded: boolean = false;
  private static SEEK_BACKWARD: number = -SKIP_INTERVAL_SECONDS;
  private static SEEK_FORWARD: number = SKIP_INTERVAL_SECONDS;

  /**
   * Constructor
   * @param videoPlayer - W3C Media VideoPlayer instance
   * @param overrideNeeded - If true, uses custom handling; if false, uses default handler
   */
  constructor(videoPlayer: VideoPlayer, overrideNeeded: boolean) {
    super();
    this.videoPlayer = videoPlayer;
    this.clientOverrideNeeded = overrideNeeded;
  }

  /**
   * Handles play command from remote control
   */
  async handlePlay(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Custom handling
      console.log('[AppOverrideMediaControlHandler] - Custom handlePlay()');
      this.videoPlayer?.play();
    } else {
      // Default handler
      console.log('[AppOverrideMediaControlHandler] - Default handlePlay()');
      super.handlePlay(mediaSessionId);
    }
  }

  /**
   * Handles pause command from remote control
   */
  async handlePause(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Custom handling
      console.log('[AppOverrideMediaControlHandler] - Custom handlePause()');
      this.videoPlayer?.pause();
    } else {
      // Default handler
      console.log('[AppOverrideMediaControlHandler] - Default handlePause()');
      super.handlePause(mediaSessionId);
    }
  }

  /**
   * Handles stop command from remote control
   */
  async handleStop(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Custom handling
      console.log('[AppOverrideMediaControlHandler] - Custom handleStop()');
      this.videoPlayer?.pause();
    } else {
      // Default handler
      console.log('[AppOverrideMediaControlHandler] - Default handleStop()');
      super.handleStop(mediaSessionId);
    }
  }

  /**
   * Handles play/pause toggle from remote control
   */
  async handleTogglePlayPause(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Custom handling
      console.log('[AppOverrideMediaControlHandler] - Custom handleTogglePlayPause()');
      if (this.videoPlayer?.paused) {
        console.log('[AppOverrideMediaControlHandler] - Player is paused, initiating play');
        this.videoPlayer?.play();
      } else {
        console.log('[AppOverrideMediaControlHandler] - Player is playing, initiating pause');
        this.videoPlayer?.pause();
      }
    } else {
      // Default handler
      console.log('[AppOverrideMediaControlHandler] - Default handleTogglePlayPause()');
      super.handleTogglePlayPause(mediaSessionId);
    }
  }

  /**
   * Handles start over command from remote control
   */
  async handleStartOver(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Custom handling
      console.log('[AppOverrideMediaControlHandler] - Custom handleStartOver()');
      this.videoPlayer!.currentTime = 0;
      this.videoPlayer?.play();
    } else {
      // Default handler
      console.log('[AppOverrideMediaControlHandler] - Default handleStartOver()');
      super.handleStartOver(mediaSessionId);
    }
  }

  /**
   * Handles fast forward command from remote control
   * Note: Fast forward/rewind can be disabled here if handled by custom seek bar
   */
  async handleFastForward(mediaSessionId?: IMediaSessionId) {
    console.log(
      '[AppOverrideMediaControlHandler] - Fast forward disabled (handled by seek bar). mediaSessionId:',
      mediaSessionId,
    );
    // Optionally implement custom fast forward logic here
  }

  /**
   * Handles rewind command from remote control
   * Note: Fast forward/rewind can be disabled here if handled by custom seek bar
   */
  async handleRewind(mediaSessionId?: IMediaSessionId) {
    console.log(
      '[AppOverrideMediaControlHandler] - Rewind disabled (handled by seek bar). mediaSessionId:',
      mediaSessionId,
    );
    // Optionally implement custom rewind logic here
  }

  /**
   * Handles seek command from remote control
   */
  async handleSeek(position: ITimeValue, mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Custom handling
      console.log('[AppOverrideMediaControlHandler] - Custom handleSeek()');
      super.handleSeek(position, mediaSessionId);
    } else {
      // Default handler
      console.log('[AppOverrideMediaControlHandler] - Default handleSeek()');
      super.handleSeek(position, mediaSessionId);
    }
  }
}
