import 'react-native-get-random-values';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';

import { MenuProvider } from '../components/MenuContext';
import { GoBackConfiguration } from './remote-control/GoBackConfiguration';
import { PluginManager } from '../core/PluginManager';
import { AuthProvider } from '../context/AuthContext';

import './configureRemoteControl';

// Configure Amplify with aws-exports configuration
Amplify.configure({
  Auth: {
    Cognito: {
      region: awsconfig.aws_cognito_region,
      userPoolId: awsconfig.aws_user_pools_id,
      userPoolClientId: awsconfig.aws_user_pools_web_client_id,
    },
  },
  API: {
    REST: {
      'gamelift-api': {
        endpoint: awsconfig.API.REST['gamelift-api'].endpoint,
      },
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      if (error) {
        console.warn(`Error in loading fonts: ${error}`);
      }
    }
  }, [loaded, error]);

  // Initialize plugins
  useEffect(() => {
    PluginManager.initialize().catch(console.error);

    return () => {
      PluginManager.cleanup().catch(console.error);
    };
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <MenuProvider>
        <ThemeProvider value={DarkTheme}>
          <GoBackConfiguration />
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="details" />
            <Stack.Screen name="player" />
          </Stack>
        </ThemeProvider>
      </MenuProvider>
    </AuthProvider>
  );
}
