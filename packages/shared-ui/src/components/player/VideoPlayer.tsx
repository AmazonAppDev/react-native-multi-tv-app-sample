import React, { useMemo } from "react";
import Video, { VideoRef } from "react-native-video";
import {
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";

interface VideoPlayerProps {
  movie: string;
  headerImage: string;
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

      // Memoize source object to prevent unnecessary re-renders
      const videoSource = useMemo(() => ({ uri: movie }), [movie]);

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
        <TouchableWithoutFeedback>
          <Video
            ref={ref}
            source={videoSource}
            style={videoStyle}
            controls={controls}
            paused={paused}
            onBuffer={({ isBuffering }) => onBuffer(isBuffering)}
            onProgress={({ currentTime }) => onProgress(currentTime)}
            onLoad={({ duration }) => onLoad(duration)}
            onEnd={onEnd}
            poster={posterConfig}
            resizeMode="cover"
          />
        </TouchableWithoutFeedback>
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
