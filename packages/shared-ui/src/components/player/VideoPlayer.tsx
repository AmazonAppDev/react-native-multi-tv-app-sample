import React from "react";
import Video, { VideoRef } from "react-native-video";
import {
  StyleSheet,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

const { width } = Dimensions.get("window");

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

const VideoPlayer = React.forwardRef<VideoRef, VideoPlayerProps>(
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
    const styles = videoPlayerStyles;
    return (
      <TouchableWithoutFeedback>
        <Video
          ref={ref}
          source={{ uri: movie }}
          style={styles.video}
          controls={controls}
          paused={paused}
          onBuffer={({ isBuffering }) => onBuffer(isBuffering)}
          onProgress={({ currentTime }) => onProgress(currentTime)}
          onLoad={({ duration }) => onLoad(duration)}
          onEnd={onEnd}
          poster={
            Platform.OS === "web"
              ? {}
              : {
                  source: { uri: headerImage },
                  resizeMode: "cover",
                  style: { width: "100%", height: "100%" },
                }
          }
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>
    );
  },
);

const videoPlayerStyles = StyleSheet.create({
    video: {
      width: "100%",
      height: width * (9 / 16),
    },
  });

export default VideoPlayer;
