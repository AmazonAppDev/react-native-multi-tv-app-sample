import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { SpatialNavigationFocusableView, SpatialNavigationRoot } from 'react-tv-space-navigation';
import { scaledPixels } from '@/hooks/useScale';
import { useIsFocused } from '@react-navigation/native';

export default function PlayerScreen() {
  const isFocused = useIsFocused();

  const styles = usePlayerStyles();

  return (
    <SpatialNavigationRoot isActive={isFocused}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <SpatialNavigationFocusableView>
        <Text style={styles.title}>Video Player</Text>
        </SpatialNavigationFocusableView>
        <Text style={styles.subtitle}>Your content is loading...</Text>
      </View>
    </SpatialNavigationRoot>
  );
}

const usePlayerStyles = function() {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: scaledPixels(48),
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: scaledPixels(20),
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    subtitle: {
      fontSize: scaledPixels(24),
      color: '#aaa',
      textAlign: 'center',
      marginTop: scaledPixels(10),
    },
  });
};