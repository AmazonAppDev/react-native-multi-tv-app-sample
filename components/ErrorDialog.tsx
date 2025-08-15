/**
 * ErrorDialog Component
 *
 * TV-optimized error dialog with retry functionality and user-friendly messaging.
 * Designed for 10-foot viewing experience with proper focus management.
 *
 * Requirements: 1.3, 2.3, 5.4
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ActivityIndicator } from 'react-native';
import { scaledPixels } from '@/hooks/useScale';
import { SpatialNavigationFocusableView, SpatialNavigationRoot, DefaultFocus } from 'react-tv-space-navigation';

export interface ErrorDialogProps {
  visible: boolean;
  title?: string;
  message: string;
  showRetry?: boolean;
  retryText?: string;
  dismissText?: string;
  isRetrying?: boolean;
  onRetry?: () => void;
  onDismiss: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
  visible,
  title = 'Something went wrong',
  message,
  showRetry = true,
  retryText = 'Try Again',
  dismissText = 'OK',
  isRetrying = false,
  onRetry,
  onDismiss,
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <SpatialNavigationRoot isActive={visible}>
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            {/* Error Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Message */}
            <Text style={styles.message}>{message}</Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {showRetry && onRetry && (
                <DefaultFocus>
                  <SpatialNavigationFocusableView onSelect={onRetry}>
                    {({ isFocused }) => (
                      <Pressable
                        style={[styles.button, styles.retryButton, isFocused && styles.buttonFocused]}
                        onPress={onRetry}
                        disabled={isRetrying}
                      >
                        <View style={styles.buttonContent}>
                          {isRetrying && (
                            <ActivityIndicator
                              size="small"
                              color={isFocused ? '#000' : '#fff'}
                              style={styles.buttonSpinner}
                            />
                          )}
                          <Text style={[styles.buttonText, isFocused && styles.buttonTextFocused]}>
                            {isRetrying ? 'Retrying...' : retryText}
                          </Text>
                        </View>
                      </Pressable>
                    )}
                  </SpatialNavigationFocusableView>
                </DefaultFocus>
              )}

              <SpatialNavigationFocusableView onSelect={onDismiss}>
                {({ isFocused }) => (
                  <Pressable
                    style={[
                      styles.button,
                      styles.dismissButton,
                      isFocused && styles.buttonFocused,
                      !showRetry && styles.singleButton,
                    ]}
                    onPress={onDismiss}
                  >
                    <Text style={[styles.buttonText, isFocused && styles.buttonTextFocused]}>{dismissText}</Text>
                  </Pressable>
                )}
              </SpatialNavigationFocusableView>
            </View>
          </View>
        </View>
      </SpatialNavigationRoot>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaledPixels(40),
  },
  dialog: {
    backgroundColor: '#1a1a1a',
    borderRadius: scaledPixels(12),
    padding: scaledPixels(40),
    maxWidth: scaledPixels(600),
    minWidth: scaledPixels(400),
    alignItems: 'center',
    borderWidth: scaledPixels(2),
    borderColor: '#333',
  },
  iconContainer: {
    marginBottom: scaledPixels(20),
  },
  errorIcon: {
    fontSize: scaledPixels(60),
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    fontSize: scaledPixels(28),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: scaledPixels(16),
  },
  message: {
    color: '#ccc',
    fontSize: scaledPixels(20),
    textAlign: 'center',
    lineHeight: scaledPixels(28),
    marginBottom: scaledPixels(32),
    maxWidth: scaledPixels(500),
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: scaledPixels(16),
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    paddingVertical: scaledPixels(16),
    paddingHorizontal: scaledPixels(32),
    borderRadius: scaledPixels(8),
    minWidth: scaledPixels(140),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scaledPixels(2),
    borderColor: 'transparent',
  },
  retryButton: {
    backgroundColor: '#007AFF',
  },
  dismissButton: {
    backgroundColor: '#666',
  },
  singleButton: {
    backgroundColor: '#007AFF',
  },
  buttonFocused: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSpinner: {
    marginRight: scaledPixels(8),
  },
  buttonText: {
    color: '#fff',
    fontSize: scaledPixels(18),
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextFocused: {
    color: '#000',
  },
});

export default ErrorDialog;
