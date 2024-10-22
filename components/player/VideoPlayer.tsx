import React from "react";
import Video, {
  OnLoadData,
  OnProgressData,
  VideoRef,
} from "react-native-video";
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
    const styles = useVideoPlayerStyles();
    return (
      <TouchableWithoutFeedback>
        <Video
          ref={ref}
          source={{ uri: movie }}
          style={styles.video}
          controls={controls}
          paused={paused}
          onBuffer={({ isBuffering }) => onBuffer(isBuffering)}
          onProgress={({ currentTime }: OnProgressData) =>
            onProgress(currentTime)
          }
          onLoad={({ duration }: OnLoadData) => onLoad(duration)}
          onEnd={onEnd}
          poster={{
            source: { uri: headerImage },
            resizeMode: "cover",
            style: { width: "100%", height: "100%" },
          }}
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>
    );
  },
);

const useVideoPlayerStyles = () => {
  return StyleSheet.create({
    video: {
      width: "100%",
      height: width * (9 / 16),
    },
  });
};

export default VideoPlayer;
