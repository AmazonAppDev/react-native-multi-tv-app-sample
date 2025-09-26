import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SpatialNavigationFocusableView, DefaultFocus, SpatialNavigationRoot } from 'react-tv-space-navigation';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { scaledPixels } from '@/hooks/useScale';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(drawer)');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    try {
      setError('');
      await login(username.trim(), password);
      // Navigation will happen automatically due to the useEffect above
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Failed to login. Please check your credentials.';

      if (err.name === 'UserNotFoundException') {
        errorMessage = 'User not found. Please check your username.';
      } else if (err.name === 'NotAuthorizedException') {
        errorMessage = 'Invalid password. Please try again.';
      } else if (err.name === 'UserNotConfirmedException') {
        errorMessage = 'Please confirm your account before signing in.';
      }

      setError(errorMessage);
    }
  };

  return (
    <SpatialNavigationRoot isActive={true}>
      <ImageBackground source={require('../assets/images/logo.png')} style={styles.background} blurRadius={20}>
        <LinearGradient colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.95)']} style={styles.overlay}>
          <View style={styles.container}>
            {/* Logo/Title Section */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>Multi-TV Gaming Experience</Text>
              <Text style={styles.subtitle}>Amazon GameLift Streams</Text>
              <View style={styles.divider} />
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Sign In</Text>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.inputContainer}>
                <DefaultFocus>
                  <SpatialNavigationFocusableView>
                    {({ isFocused }) => (
                      <View style={[styles.inputWrapper, isFocused && styles.inputFocused]}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                          style={[styles.input, isFocused && styles.inputTextFocused]}
                          value={username}
                          onChangeText={setUsername}
                          placeholder="Enter your email"
                          placeholderTextColor="#666"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          editable={!isLoading}
                        />
                      </View>
                    )}
                  </SpatialNavigationFocusableView>
                </DefaultFocus>

                <SpatialNavigationFocusableView>
                  {({ isFocused }) => (
                    <View style={[styles.inputWrapper, isFocused && styles.inputFocused]}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <TextInput
                        style={[styles.input, isFocused && styles.inputTextFocused]}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        placeholderTextColor="#666"
                        secureTextEntry
                        editable={!isLoading}
                      />
                    </View>
                  )}
                </SpatialNavigationFocusableView>
              </View>

              {/* Login Button */}
              <SpatialNavigationFocusableView onSelect={handleLogin}>
                {({ isFocused }) => (
                  <LinearGradient
                    colors={isFocused ? ['#4facfe', '#00f2fe'] : ['#3498db', '#2980b9']}
                    style={[styles.loginButton, isFocused && styles.loginButtonFocused]}
                  >
                    <Text style={[styles.loginButtonText, isFocused && styles.loginButtonTextFocused]}>
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </LinearGradient>
                )}
              </SpatialNavigationFocusableView>

              {/* Help Text */}
              <Text style={styles.helpText}>Use your AWS Cognito credentials</Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Powered by AWS</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SpatialNavigationRoot>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaledPixels(60),
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: scaledPixels(60),
  },
  title: {
    fontSize: scaledPixels(56),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: scaledPixels(12),
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: scaledPixels(24),
    color: '#b0b0b0',
    textAlign: 'center',
    marginBottom: scaledPixels(30),
  },
  divider: {
    width: scaledPixels(100),
    height: scaledPixels(3),
    backgroundColor: '#3498db',
    borderRadius: scaledPixels(2),
  },
  formContainer: {
    width: '100%',
    maxWidth: scaledPixels(500),
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: scaledPixels(20),
    padding: scaledPixels(40),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  formTitle: {
    fontSize: scaledPixels(32),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: scaledPixels(40),
  },
  errorText: {
    color: '#e74c3c',
    fontSize: scaledPixels(18),
    marginBottom: scaledPixels(20),
    textAlign: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: scaledPixels(12),
    borderRadius: scaledPixels(8),
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  inputContainer: {
    gap: scaledPixels(24),
    marginBottom: scaledPixels(40),
  },
  inputWrapper: {
    borderRadius: scaledPixels(12),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: scaledPixels(20),
    transition: 'all 0.3s ease',
  },
  inputFocused: {
    borderColor: '#3498db',
    backgroundColor: 'rgba(52,152,219,0.1)',
    transform: [{ scale: 1.02 }],
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  inputLabel: {
    fontSize: scaledPixels(16),
    color: '#b0b0b0',
    marginBottom: scaledPixels(8),
    fontWeight: '500',
  },
  input: {
    fontSize: scaledPixels(20),
    color: '#ffffff',
    padding: 0,
  },
  inputTextFocused: {
    color: '#ffffff',
  },
  loginButton: {
    borderRadius: scaledPixels(12),
    paddingVertical: scaledPixels(20),
    paddingHorizontal: scaledPixels(40),
    alignItems: 'center',
    marginBottom: scaledPixels(24),
  },
  loginButtonFocused: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  loginButtonText: {
    fontSize: scaledPixels(22),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loginButtonTextFocused: {
    color: '#ffffff',
  },
  helpText: {
    fontSize: scaledPixels(16),
    color: '#888',
    textAlign: 'center',
    lineHeight: scaledPixels(22),
  },
  footer: {
    position: 'absolute',
    bottom: scaledPixels(40),
    alignItems: 'center',
  },
  footerText: {
    fontSize: scaledPixels(14),
    color: '#666',
  },
});
