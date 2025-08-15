/**
 * ErrorBoundary Component
 *
 * React error boundary for catching and handling component errors.
 * Provides TV-optimized error recovery UI with retry functionality.
 *
 * Requirements: 1.3, 2.3, 5.4
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { scaledPixels } from '@/hooks/useScale';
import { SpatialNavigationFocusableView, SpatialNavigationRoot, DefaultFocus } from 'react-tv-space-navigation';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      errorInfo: errorInfo.componentStack,
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <SpatialNavigationRoot isActive={true}>
          <View style={styles.container}>
            <View style={styles.errorContainer}>
              {/* Error Icon */}
              <Text style={styles.errorIcon}>💥</Text>

              {/* Error Title */}
              <Text style={styles.errorTitle}>Oops! Something went wrong</Text>

              {/* Error Message */}
              <Text style={styles.errorMessage}>
                The app encountered an unexpected error. This usually happens due to a temporary issue.
              </Text>

              {/* Error Details (only in development) */}
              {__DEV__ && this.state.error && (
                <View style={styles.errorDetails}>
                  <Text style={styles.errorDetailsTitle}>Error Details:</Text>
                  <Text style={styles.errorDetailsText}>{this.state.error.message}</Text>
                </View>
              )}

              {/* Retry Button */}
              <DefaultFocus>
                <SpatialNavigationFocusableView onSelect={this.handleRetry}>
                  {({ isFocused }) => (
                    <Pressable
                      style={[styles.retryButton, isFocused && styles.retryButtonFocused]}
                      onPress={this.handleRetry}
                    >
                      <Text style={[styles.retryButtonText, isFocused && styles.retryButtonTextFocused]}>
                        Try Again
                      </Text>
                    </Pressable>
                  )}
                </SpatialNavigationFocusableView>
              </DefaultFocus>
            </View>
          </View>
        </SpatialNavigationRoot>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaledPixels(40),
  },
  errorContainer: {
    alignItems: 'center',
    maxWidth: scaledPixels(600),
  },
  errorIcon: {
    fontSize: scaledPixels(80),
    marginBottom: scaledPixels(24),
  },
  errorTitle: {
    color: '#fff',
    fontSize: scaledPixels(32),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: scaledPixels(16),
  },
  errorMessage: {
    color: '#ccc',
    fontSize: scaledPixels(20),
    textAlign: 'center',
    lineHeight: scaledPixels(28),
    marginBottom: scaledPixels(32),
  },
  errorDetails: {
    backgroundColor: '#1a1a1a',
    padding: scaledPixels(20),
    borderRadius: scaledPixels(8),
    marginBottom: scaledPixels(32),
    width: '100%',
  },
  errorDetailsTitle: {
    color: '#ff6b6b',
    fontSize: scaledPixels(16),
    fontWeight: 'bold',
    marginBottom: scaledPixels(8),
  },
  errorDetailsText: {
    color: '#ccc',
    fontSize: scaledPixels(14),
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: scaledPixels(16),
    paddingHorizontal: scaledPixels(32),
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: 'transparent',
  },
  retryButtonFocused: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: scaledPixels(20),
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButtonTextFocused: {
    color: '#000',
  },
});

export default ErrorBoundary;
