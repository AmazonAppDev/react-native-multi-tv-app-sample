/**
 * WatchlistButton Component
 *
 * Reusable button component for add/remove watchlist functionality.
 * Optimized for TV navigation with proper focus states and visual feedback.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator, View } from 'react-native';
import { scaledPixels } from '@/hooks/useScale';
import { SpatialNavigationFocusableView } from 'react-tv-space-navigation';
import { useWatchlist } from './WatchlistContext';
import { WatchlistItem } from '../types/watchlist';
import { useErrorHandler } from '../hooks/useErrorHandler';
import ToastNotification from './ToastNotification';

interface WatchlistButtonProps {
  item: Omit<WatchlistItem, 'addedAt'>;
  style?: ViewStyle;
  onSuccess?: (action: 'added' | 'removed') => void;
  onError?: (error: string) => void;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = React.memo(({ item, style, onSuccess, onError }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const [operationProgress, setOperationProgress] = useState(0);

  // Enhanced error handling
  const { error, isRetrying, handleError, retry, clearError } = useErrorHandler({
    maxRetries: 2,
    retryDelay: 500,
  });

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const isInList = useMemo(() => isInWatchlist(item.id), [isInWatchlist, item.id]);
  const buttonText = useMemo(() => (isInList ? 'Remove from Watchlist' : 'Add to Watchlist'), [isInList]);

  const performOperation = useCallback(async () => {
    if (isInList) {
      await removeFromWatchlist(item.id);
      return 'removed';
    } else {
      await addToWatchlist(item);
      return 'added';
    }
  }, [isInList, removeFromWatchlist, item, addToWatchlist]);

  const handlePress = useCallback(async () => {
    if (isOperationLoading || isRetrying) return;

    setIsOperationLoading(true);
    setShowSuccessFeedback(false);
    setOperationProgress(0);
    clearError();

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setOperationProgress((prev) => Math.min(prev + 20, 80));
      }, 50);

      const action = await performOperation();

      clearInterval(progressInterval);
      setOperationProgress(100);

      // Show success feedback
      setShowSuccessFeedback(true);
      setToastMessage(`${action === 'added' ? 'Added to' : 'Removed from'} watchlist`);
      setToastType('success');
      setShowToast(true);

      onSuccess?.(action);

      setTimeout(() => {
        setShowSuccessFeedback(false);
        setOperationProgress(0);
      }, 1500);
    } catch (err) {
      setOperationProgress(0);
      handleError(err, 'watchlist operation');

      setToastMessage('Operation failed. Tap to retry.');
      setToastType('error');
      setShowToast(true);

      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      onError?.(errorMessage);
    } finally {
      setIsOperationLoading(false);
    }
  }, [isOperationLoading, isRetrying, performOperation, onSuccess, handleError, onError, clearError]);

  const handleRetry = useCallback(async () => {
    await retry(async () => {
      const action = await performOperation();

      setToastMessage(`${action === 'added' ? 'Added to' : 'Removed from'} watchlist`);
      setToastType('success');
      setShowToast(true);

      onSuccess?.(action);
    });
  }, [retry, performOperation, onSuccess]);

  const renderButtonContent = useCallback(
    (isFocused: boolean) => {
      if (isOperationLoading || isRetrying) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={isFocused ? '#000' : '#fff'} style={styles.loadingSpinner} />
            <Text style={[isFocused ? styles.buttonTextFocused : styles.buttonText, styles.loadingText]}>
              {isRetrying ? 'Retrying...' : isInList ? 'Removing...' : 'Adding...'}
            </Text>
            {operationProgress > 0 && (
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${operationProgress}%` },
                    { backgroundColor: isFocused ? '#000' : '#fff' },
                  ]}
                />
              </View>
            )}
          </View>
        );
      }

      if (showSuccessFeedback) {
        return (
          <Text style={[isFocused ? styles.buttonTextFocused : styles.buttonText, styles.successText]}>
            {isInList ? 'Added!' : 'Removed!'}
          </Text>
        );
      }

      if (error) {
        return (
          <Text style={[isFocused ? styles.buttonTextFocused : styles.buttonText, styles.errorText]}>Tap to retry</Text>
        );
      }

      return <Text style={[isFocused ? styles.buttonTextFocused : styles.buttonText]}>{buttonText}</Text>;
    },
    [isOperationLoading, isRetrying, isInList, showSuccessFeedback, error, buttonText, operationProgress],
  );

  return (
    <>
      <SpatialNavigationFocusableView onSelect={error ? handleRetry : handlePress}>
        {({ isFocused }) => (
          <Pressable
            style={[
              styles.button,
              isFocused && styles.buttonFocused,
              isInList && styles.removeButton,
              isInList && isFocused && styles.removeButtonFocused,
              (isOperationLoading || isRetrying) && styles.buttonLoading,
              error && styles.errorButton,
              error && isFocused && styles.errorButtonFocused,
              style,
            ]}
            onPress={error ? handleRetry : handlePress}
            disabled={isOperationLoading || isRetrying}
          >
            {renderButtonContent(isFocused)}
          </Pressable>
        )}
      </SpatialNavigationFocusableView>

      {/* Toast Notification */}
      <ToastNotification
        visible={showToast}
        message={toastMessage}
        type={toastType}
        duration={3000}
        onHide={() => setShowToast(false)}
      />
    </>
  );
});

WatchlistButton.displayName = 'WatchlistButton';

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: scaledPixels(15),
    paddingHorizontal: scaledPixels(20),
    borderRadius: scaledPixels(5),
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: scaledPixels(200),
  },
  buttonFocused: {
    backgroundColor: '#fff',
  },
  removeButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.25)', // Red tint for remove action
  },
  removeButtonFocused: {
    backgroundColor: '#ff3b30', // Solid red when focused
  },
  buttonLoading: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: scaledPixels(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextFocused: {
    color: '#000',
    fontSize: scaledPixels(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    marginRight: scaledPixels(8),
  },
  loadingText: {
    // Inherits from buttonText/buttonTextFocused
  },
  successText: {
    // Inherits from buttonText/buttonTextFocused
    fontWeight: '600',
  },
  errorButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.25)',
  },
  errorButtonFocused: {
    backgroundColor: '#ff3b30',
  },
  errorText: {
    // Inherits from buttonText/buttonTextFocused
    fontWeight: '600',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scaledPixels(3),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: scaledPixels(1.5),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: scaledPixels(1.5),
    transition: 'width 0.3s ease',
  },
});

export default WatchlistButton;
