import React, { useRef, useState, useEffect } from "react";
import { View, Platform, StyleSheet, Animated } from "react-native";
import { SpatialNavigationRoot } from "react-tv-space-navigation";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { router, Stack } from "expo-router";
import RemoteControlManager from "@/app/remote-control/RemoteControlManager";
import { SupportedKeys } from "@/app/remote-control/SupportedKeys";
import Controls from "@/components/player/Controls";
import ExitButton from "@/components/player/ExitButton";
import LoadingIndicator from "@/components/LoadingIndicator";
import { VideoRef } from "react-native-video";
import VideoPlayer from "@/components/player/VideoPlayer";

const SHOW_NATIVE_CONTROLS = Platform.OS === "ios";

interface PlayerParams extends Record<string, any> {
  movie: string;
  headerImage: string;
}

export default function PlayerScreen() {
  const { movie, headerImage } = useLocalSearchParams<PlayerParams>();
  const isFocused = useIsFocused();
  const [paused, setPaused] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(false);
  const [isVideoBuffering, setIsVideoBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const videoRef = useRef<VideoRef>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const controlsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (SHOW_NATIVE_CONTROLS) return;

    const handleKeyDown = (key: SupportedKeys) => {
      switch (key) {
        case SupportedKeys.Right:
        case SupportedKeys.Rewind:
          seek(currentTimeRef.current + 10);
          break;
        case SupportedKeys.Left:
        case SupportedKeys.FastForward:
          seek(currentTimeRef.current - 10);
          break;
        case SupportedKeys.Back:
          router.back();
          break;
        case SupportedKeys.PlayPause:
          togglePausePlay();
          break;
        default:
          showControls();
          break;
      }
    };

    const listener = RemoteControlManager.addKeydownListener(handleKeyDown);
    return () => {
      RemoteControlManager.removeKeydownListener(listener);
    };
  }, []);

  const seek = (time: number) => {
    if (time < 0) {
      time = 0;
    } else if (time > durationRef.current) {
      time = durationRef.current;
    }
    videoRef.current?.seek(time);
    currentTimeRef.current = time;
    setCurrentTime(time);
    showControls();
  };

  const showControls = () => {
    setControlsVisible(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setControlsVisible(false);
      });
    }, 3000);
  };

  const togglePausePlay = () => {
    setPaused((prev) => !prev);
    showControls();
  };

  const styles = usePlayerStyles();

  return (
    <SpatialNavigationRoot isActive={isFocused && Platform.OS === "android"}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <VideoPlayer
          ref={videoRef}
          movie={movie}
          headerImage={headerImage}
          paused={paused}
          controls={SHOW_NATIVE_CONTROLS}
          onBuffer={setIsVideoBuffering}
          onProgress={setCurrentTime}
          onLoad={(duration) => (durationRef.current = duration)}
          onEnd={() => setPaused(true)}
        />

        {!SHOW_NATIVE_CONTROLS && controlsVisible && !!durationRef.current && (
          <Animated.View
            style={[styles.controlsContainer, { opacity: controlsOpacity }]}
          >
            {isVideoBuffering && <LoadingIndicator />}
            <ExitButton onSelect={() => router.back()} />
            <Controls
              paused={paused}
              onPlayPause={togglePausePlay}
              currentTime={currentTime}
              duration={durationRef.current}
            />
          </Animated.View>
        )}
      </View>
    </SpatialNavigationRoot>
  );
}

const usePlayerStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },
    controlsContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "space-between",
      zIndex: 1,
    },
  });
};
