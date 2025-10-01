import React, { useRef } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SpatialNavigationFocusableView } from 'react-tv-space-navigation';
import { useRouter } from 'expo-router';
import awsconfig from '../../../aws-exports';
import { useAuth } from '../../../context/AuthContext';
import { scaledPixels } from '@/hooks/useScale';
import { Game } from '../../../utils/gamesConfig';

interface GameLiftWebViewProps {
  onError?: (error: string) => void;
  game?: Game;
  onBack?: () => void;
}

export default function GameLiftWebView({ onError, game, onBack }: GameLiftWebViewProps) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const webViewRef = useRef<any>(null);

  // Load SDK content for native platforms (device can't load external scripts from require()'d HTML)
  const [sdkContent, setSdkContent] = React.useState<string | null>(null);
  const [webViewLoaded, setWebViewLoaded] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      // Fetch SDK from Metro server to inject inline
      fetch('http://localhost:8081/gameliftstreams-1.0.0.js')
        .then((res) => res.text())
        .then((content) => setSdkContent(content))
        .catch((err) => {
          console.error('Failed to load SDK:', err);
          onError?.('Failed to load GameLift SDK');
        });
    }
  }, []);

  // Inject SDK when both WebView and SDK content are ready (native only)
  React.useEffect(() => {
    if (webViewLoaded && sdkContent && Platform.OS !== 'web') {
      // Override console to capture WebView logs via postMessage
      webViewRef.current?.injectJavaScript(`
        (function() {
          const originalLog = console.log;
          const originalError = console.error;
          console.log = function(...args) {
            originalLog.apply(console, args);
            window.ReactNativeWebView?.postMessage(JSON.stringify({type: 'console-log', message: args.join(' ')}));
          };
          console.error = function(...args) {
            originalError.apply(console, args);
            window.ReactNativeWebView?.postMessage(JSON.stringify({type: 'console-error', message: args.join(' ')}));
          };
        })();
        true;
      `);

      // Inject SDK inline (can't use <script src> with require()'d HTML)
      setTimeout(() => {
        webViewRef.current?.injectJavaScript(`
          (function() {
            try {
              const script = document.createElement('script');
              script.textContent = ${JSON.stringify(sdkContent)};
              document.head.appendChild(script);
              
              // Initialize config variables and add TV remote support
              setTimeout(() => {
                if (typeof window.apiConfig === 'undefined') window.apiConfig = null;
                if (typeof window.authToken === 'undefined') window.authToken = null;
                
                // Add TV remote key handling (Enter key triggers button clicks)
                document.addEventListener('keydown', function(e) {
                  if (e.keyCode === 23 || e.keyCode === 13 || e.key === 'Enter') {
                    const streamBtn = document.getElementById('stream-btn');
                    const fullscreenBtn = document.getElementById('fullscreen-btn');
                    
                    if (streamBtn && streamBtn.offsetParent !== null) {
                      streamBtn.click();
                      e.preventDefault();
                    } else if (fullscreenBtn && fullscreenBtn.offsetParent !== null) {
                      fullscreenBtn.click();
                      e.preventDefault();
                    }
                  }
                });
              }, 50);
            } catch (e) {
              console.error('Failed to inject SDK: ' + e.message);
            }
          })();
          true;
        `);
      }, 100);
    }
  }, [webViewLoaded, sdkContent]);

  // Handle web platform messages - must be at top level before any conditional returns
  React.useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Message from iframe:', data);

        if (data.type === 'requestConfig' || data.type === 'webview-ready') {
          sendConfigurationToIframe();
        } else if (data.type === 'navigate-back') {
          onBack?.();
        }
      } catch (error) {
        console.error('Error handling iframe message:', error);
      }
    };

    const sendConfigurationToIframe = () => {
      const iframe = document.querySelector('iframe[title="GameLift Streams"]') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            type: 'configure',
            apiConfig: { endpoint: awsconfig.API.REST['gamelift-api'].endpoint },
          }),
          '*',
        );

        iframe.contentWindow.postMessage(
          JSON.stringify({
            type: 'auth-token',
            token: token,
          }),
          '*',
        );

        if (game) {
          iframe.contentWindow.postMessage(
            JSON.stringify({
              type: 'game-config',
              game: {
                streamGroupId: game.streamGroupId,
                applicationId: game.applicationId,
                region: game.region,
              },
            }),
            '*',
          );
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [token, game, onBack]);

  const handleBackPress = () => {
    if (Platform.OS === 'web') {
      // For web platform, use iframe
      const iframe = document.querySelector('iframe[title="GameLift Streams"]') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            type: 'check-stream-and-navigate',
          }),
          '*',
        );
      } else {
        onBack?.();
      }
    } else if (webViewRef.current) {
      // For native platforms, use WebView
      webViewRef.current.injectJavaScript(`
        (function() {
          try {
            const streamBtn = document.getElementById('stream-btn');
            const isStreaming = streamBtn && streamBtn.textContent.includes('End Game');
            
            if (isStreaming) {
              // Use the custom modal function that should be available
              if (typeof showConfirmationModal === 'function') {
                showConfirmationModal(
                  'End Game Session',
                  'You have an active game session. Do you want to end it and return to games?',
                  () => {
                    toggleStream();
                    setTimeout(() => {
                      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'navigate-back'}));
                    }, 1000);
                  },
                  () => {
                    // User cancelled - do nothing
                  }
                );
              } else {
                // Fallback to browser confirm if custom modal not available
                if (confirm('You have an active game session. Do you want to end it and return to games?')) {
                  toggleStream();
                  setTimeout(() => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'navigate-back'}));
                  }, 1000);
                }
              }
            } else {
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'navigate-back'}));
            }
          } catch (error) {
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'navigate-back'}));
          }
        })();
        true;
      `);
    } else {
      onBack?.();
    }
  };

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
    return (
      <View style={styles.container}>
        {onBack && (
          <View style={styles.backButtonContainer}>
            <SpatialNavigationFocusableView onSelect={handleBackPress}>
              {({ isFocused }) => (
                <LinearGradient
                  colors={isFocused ? ['#e74c3c', '#c0392b'] : ['#34495e', '#2c3e50']}
                  style={[styles.backButton, isFocused && styles.backButtonFocused]}
                >
                  <Text style={styles.backButtonText}>← Back to Games</Text>
                </LinearGradient>
              )}
            </SpatialNavigationFocusableView>
          </View>
        )}
        <iframe
          src="./assets/gamelift-web/index.html"
          style={{
            width: '100%',
            height: onBack ? 'calc(100% - 80px)' : '100%',
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

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // Handle console logs from WebView
      if (data.type === 'console-log') {
        console.log('WebView:', data.message);
        return;
      }
      if (data.type === 'console-error') {
        console.error('WebView Error:', data.message);
        return;
      }

      console.log('Message from WebView:', data);

      if (data.type === 'requestConfig' || data.type === 'webview-ready') {
        sendConfiguration();
      } else if (data.type === 'navigate-back') {
        onBack?.();
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const sendConfiguration = () => {
    try {
      const apiConfig = {
        endpoint: awsconfig.API.REST['gamelift-api'].endpoint,
      };

      if (Platform.OS === 'web') {
        // For web platform (iframe), use postMessage
        webViewRef.current?.postMessage(JSON.stringify({ type: 'configure', apiConfig }));
        webViewRef.current?.postMessage(JSON.stringify({ type: 'auth-token', token: token }));
      } else {
        // For native platforms (WebView), inject directly into window
        // This is necessary because postMessage doesn't work reliably with require()'d HTML
        webViewRef.current?.injectJavaScript(`
          (function() {
            window.apiConfig = ${JSON.stringify(apiConfig)};
            window.authToken = ${JSON.stringify(token)};
            
            // Also set on globalThis for broader compatibility
            if (typeof globalThis !== 'undefined') {
              globalThis.apiConfig = window.apiConfig;
              globalThis.authToken = window.authToken;
            }
            
            // Call showStreamingInterface to display the UI
            if (typeof showStreamingInterface === 'function') {
              showStreamingInterface();
            }
          })();
          true;
        `);
      }

      // Send game configuration if available
      if (game) {
        if (Platform.OS === 'web') {
          webViewRef.current?.postMessage(
            JSON.stringify({
              type: 'game-config',
              game: {
                streamGroupId: game.streamGroupId,
                applicationId: game.applicationId,
                region: game.region,
              },
            }),
          );
        } else {
          // For native, directly set form values
          webViewRef.current?.injectJavaScript(`
            document.getElementById('sgId').value = ${JSON.stringify(game.streamGroupId || '')};
            document.getElementById('appId').value = ${JSON.stringify(game.applicationId || '')};
            document.getElementById('region').value = ${JSON.stringify(game.region || 'us-west-2')};
            true;
          `);
        }
      }
    } catch (error) {
      console.error('Failed to send configuration:', error);
      onError?.('Configuration error: ' + (error as Error).message);
    }
  };

  const getWebViewSource = () => {
    if (Platform.OS === 'android') {
      // React Native best practice - use require for bundled assets
      return require('../../../assets/gamelift-web/index.html');
    } else if (Platform.OS === 'ios') {
      return require('../../../assets/gamelift-web/index.html');
    } else {
      return { uri: './assets/gamelift-web/index.html' };
    }
  };

  return (
    <View style={styles.container}>
      {onBack && (
        <View style={styles.backButtonContainer}>
          <SpatialNavigationFocusableView onSelect={handleBackPress}>
            {({ isFocused }) => (
              <LinearGradient
                colors={isFocused ? ['#e74c3c', '#c0392b'] : ['#34495e', '#2c3e50']}
                style={[styles.backButton, isFocused && styles.backButtonFocused]}
              >
                <Text style={styles.backButtonText}>← Back to Games</Text>
              </LinearGradient>
            )}
          </SpatialNavigationFocusableView>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={getWebViewSource()}
        style={[styles.webview, onBack && { marginTop: scaledPixels(60) }]}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlaybook={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        mixedContentMode="compatibility"
        originWhitelist={['*']}
        cacheEnabled={false}
        incognito={true}
        // Make WebView focusable for TV
        focusable={true}
        onConsoleMessage={(event) => {
          console.log('WebView Console:', event.nativeEvent.message);
        }}
        onLoad={() => {
          setWebViewLoaded(true);

          // Request focus for TV remote
          setTimeout(() => {
            webViewRef.current?.requestFocus?.();
          }, 500);

          if (Platform.OS === 'web') {
            // For web, inject script tag with relative path
            webViewRef.current?.injectJavaScript(`
              (function() {
                const script = document.createElement('script');
                script.src = './gameliftstreams-1.0.0.js';
                script.onload = () => console.log('GameLift SDK loaded');
                script.onerror = (e) => console.error('Failed to load SDK:', e);
                document.head.appendChild(script);
              })();
              true;
            `);
          }
        }}
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
  backButtonContainer: {
    position: 'absolute',
    top: scaledPixels(20),
    left: scaledPixels(20),
    zIndex: 1000,
  },
  backButton: {
    paddingHorizontal: scaledPixels(20),
    paddingVertical: scaledPixels(12),
    borderRadius: scaledPixels(8),
  },
  backButtonFocused: {
    transform: [{ scale: 1.05 }],
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: scaledPixels(18),
    fontWeight: '600',
  },
});
