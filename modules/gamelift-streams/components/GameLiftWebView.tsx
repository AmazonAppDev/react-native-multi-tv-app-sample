import React, { useRef } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SpatialNavigationFocusableView } from 'react-tv-space-navigation';
import { useRouter } from 'expo-router';
import awsconfig from '../../../aws-exports';
import { useAuth } from '../../../context/AuthContext';
import { scaledPixels } from '@/hooks/useScale';

interface GameLiftWebViewProps {
  onError?: (error: string) => void;
}

export default function GameLiftWebView({ onError }: GameLiftWebViewProps) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated (standard TV app pattern)
  React.useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/login');
    }
  }, [isAuthenticated, token, router]);

  // Show loading while redirecting
  if (!isAuthenticated || !token) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Redirecting to sign in...</Text>
        </View>
      </View>
    );
  }

  // Check if WebView is supported on current platform
  if (Platform.OS === 'web') {
    // For web platform, use iframe and handle messages
    React.useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Message from iframe:', data);

          if (data.type === 'requestConfig') {
            sendConfigurationToIframe();
          }
        } catch (error) {
          console.error('Error handling iframe message:', error);
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }, [token]);

    const sendConfigurationToIframe = () => {
      const iframe = document.querySelector('iframe[title="GameLift Streams"]') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        // Send API config
        iframe.contentWindow.postMessage(
          JSON.stringify({
            type: 'configure',
            apiConfig: { endpoint: awsconfig.API.REST['gamelift-api'].endpoint },
          }),
          '*',
        );

        // Send auth token
        iframe.contentWindow.postMessage(
          JSON.stringify({
            type: 'auth-token',
            token: token,
          }),
          '*',
        );

        console.log('Configuration sent to iframe');
      }
    };

    return (
      <View style={styles.container}>
        <iframe
          src="./assets/gamelift-web/index.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#000',
          }}
          title="GameLift Streams"
        />
      </View>
    );
  }

  // For TV/mobile platforms, dynamically import WebView
  let WebView;
  try {
    WebView = require('react-native-webview').WebView;
  } catch (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>WebView not supported on this platform</Text>
      </View>
    );
  }

  const webViewRef = useRef<any>(null);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Message from WebView:', data);

      if (data.type === 'requestConfig') {
        sendConfiguration();
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const sendConfiguration = () => {
    try {
      // Send API config and auth token separately
      const apiConfig = {
        endpoint: awsconfig.API.REST['gamelift-api'].endpoint,
      };

      console.log('Sending API config:', apiConfig);

      // Send configuration
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: 'configure',
          apiConfig,
        }),
      );

      // Send auth token
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: 'auth-token',
          token: token,
        }),
      );
    } catch (error) {
      console.error('Failed to send configuration:', error);
      onError?.('Configuration error: ' + (error as Error).message);
    }
  };

  const getWebViewSource = () => {
    if (Platform.OS === 'android') {
      return { uri: 'file:///android_asset/gamelift-web/index.html' };
    } else if (Platform.OS === 'ios') {
      return require('../../../assets/gamelift-web/index.html');
    } else {
      return { uri: './assets/gamelift-web/index.html' };
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={getWebViewSource()}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        mixedContentMode="compatibility"
        originWhitelist={['*']}
        onError={(error: any) => {
          console.error('WebView error:', error);
          onError?.('WebView failed to load');
        }}
        onHttpError={(error: any) => {
          console.error('WebView HTTP error:', error);
          onError?.('WebView HTTP error');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: scaledPixels(24),
    textAlign: 'center',
  },
});
