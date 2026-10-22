import React, { useMemo, useRef } from "react";
import Video, { VideoRef } from "react-native-video";
import { useTvAccessibilitySettings } from "expo-tv-accessibility-settings";
import {
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
import type { CaptionTrack } from "../../data/moviesData";
import { selectCaptionTrack, toTextTracks } from "./captionTracks";

interface VideoPlayerProps {
  movie: string;
  headerImage: string;
  captions?: CaptionTrack[];
  describedMovie?: string;
  paused: boolean;
  controls: boolean;
  onBuffer: (isBuffering: boolean) => void;
  onProgress: (currentTime: number) => void;
  onLoad: (duration: number) => void;
  onEnd: () => void;
}

const VideoPlayer = React.memo(
  React.forwardRef<VideoRef, VideoPlayerProps>(
    (
      {
        movie,
        headerImage,
        captions,
        describedMovie,
        paused,
        controls,
        onBuffer,
        onProgress,
        onLoad,
        onEnd,
      },
      ref,
    ) => {
      const { width } = useWindowDimensions();

      // Captions follow the TV's Closed Captions setting (Fire TV: Settings > Accessibility), live:
      // turning it on or off, or changing the caption language, applies while the video plays.
      const { supported, closedCaptions, audioDescription } = useTvAccessibilitySettings();
      const textTracks = useMemo(
        () => (captions?.length ? toTextTracks(captions) : undefined),
        [captions],
      );
      const selectedTextTrack = useMemo(
        () =>
          textTracks &&
          selectCaptionTrack(textTracks, {
            supported,
            enabled: closedCaptions.enabled,
            locale: closedCaptions.locale,
          }),
        [textTracks, supported, closedCaptions.enabled, closedCaptions.locale],
      );

      // Audio Description follows the TV setting too: when the title has a described version, it plays
      // instead, and switching mid-video continues from the same position.
      const positionRef = useRef(0);
      const uri = audioDescription.enabled && describedMovie ? describedMovie : movie;

      // Memoize source object to prevent unnecessary re-renders
      const videoSource = useMemo(
        () => ({ uri, textTracks, startPosition: positionRef.current * 1000 }),
        [uri, textTracks],
      );

      // Memoize poster object to prevent unnecessary re-renders
      const posterConfig = useMemo(
        () =>
          Platform.OS === "web"
            ? {}
            : {
                source: { uri: headerImage },
                resizeMode: "cover" as const,
                style: { width: "100%", height: "100%" },
              },
        [headerImage],
      );

      // Calculate video style based on current dimensions
      const videoStyle = useMemo(
        () => [
          videoPlayerStyles.video,
          { height: width * (9 / 16) },
        ],
        [width],
      );

      return (
        <Video
          ref={ref}
          source={videoSource}
          style={videoStyle}
          controls={controls}
          paused={paused}
          onBuffer={({ isBuffering }) => onBuffer(isBuffering)}
          onProgress={({ currentTime }) => {
            positionRef.current = currentTime;
            onProgress(currentTime);
          }}
          onLoad={({ duration }) => onLoad(duration)}
          onEnd={onEnd}
          poster={posterConfig}
          selectedTextTrack={selectedTextTrack}
          resizeMode="cover"
        />
      );
    },
  ),
);

const videoPlayerStyles = StyleSheet.create({
  video: {
    width: "100%",
  },
});

export default VideoPlayer;
