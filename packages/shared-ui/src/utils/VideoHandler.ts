import React from 'react';

/**
 * VideoHandler for non-Kepler platforms (Android, iOS, Web)
 *
 * This is a stub implementation that provides the same interface as VideoHandler.kepler.ts
 * but is designed for platforms that don't use Kepler/W3C Media APIs.
 *
 * For actual video playback on these platforms, react-native-video is used directly
 * in the VideoPlayer component.
 */

export enum VideoFileTypes {
  MP4 = 'MP4',
  HLS = 'HLS',
  DASH = 'DASH',
}

/**
 * Stub VideoHandler for non-Kepler platforms
 * This class provides compatibility but most functionality is handled by react-native-video directly
 */
export class VideoHandler {
  public videoUri: string;
  public posterUri: string;
  public selectedFileType: VideoFileTypes;

  constructor(
    videoRef: any,
    videoUri: string,
    posterUri: string,
    setIsVideoInitialized: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVideoEnded: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVideoError: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
    setDuration: React.Dispatch<React.SetStateAction<number>>,
    setShowBuffering: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    this.videoUri = videoUri;
    this.posterUri = posterUri;
    this.selectedFileType = this.detectVideoFormat(videoUri);
  }

  private detectVideoFormat(uri: string): VideoFileTypes {
    const lowerUri = uri.toLowerCase();
    if (lowerUri.includes('.m3u8')) {
      return VideoFileTypes.HLS;
    } else if (lowerUri.includes('.mpd')) {
      return VideoFileTypes.DASH;
    }
    return VideoFileTypes.MP4;
  }

  setVideoUri = (uri: string, posterUri?: string) => {
    this.videoUri = uri;
    if (posterUri) {
      this.posterUri = posterUri;
    }
    this.selectedFileType = this.detectVideoFormat(uri);
  };

  // Stub methods - not used on non-Kepler platforms
  preBufferVideo = async (componentInstance?: any) => {
    console.log('[VideoHandler] - preBufferVideo not implemented for this platform');
  };

  destroyVideoElements = (): boolean => {
    console.log('[VideoHandler] - destroyVideoElements not implemented for this platform');
    return true;
  };

  play = () => {
    console.log('[VideoHandler] - play not implemented for this platform');
  };

  pause = () => {
    console.log('[VideoHandler] - pause not implemented for this platform');
  };

  seek = (time: number) => {
    console.log('[VideoHandler] - seek not implemented for this platform');
  };

  isPaused = (): boolean => {
    return true;
  };
}
