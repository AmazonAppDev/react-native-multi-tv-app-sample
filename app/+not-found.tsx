import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { scaledPixels } from '@/hooks/useScale'; // Assuming you have this utility

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.errorText}>404</Text>
        <Text style={styles.messageText}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scaledPixels(20),
    backgroundColor: '#f8f8f8', // Light background color
  },
  errorText: {
    fontSize: scaledPixels(72),
    fontWeight: 'bold',
    color: '#e74c3c', // Red color for error
    marginBottom: scaledPixels(20),
  },
  messageText: {
    fontSize: scaledPixels(18),
    color: '#34495e', // Dark blue color for message
    textAlign: 'center',
    marginBottom: scaledPixels(30),
  },
  link: {
    marginTop: scaledPixels(15),
    paddingVertical: scaledPixels(15),
    paddingHorizontal: scaledPixels(25),
    backgroundColor: '#3498db', // Blue background for link
    borderRadius: scaledPixels(5),
  },
  linkText: {
    color: '#ffffff', // White text for link
    fontSize: scaledPixels(16),
    fontWeight: 'bold',
  },
});