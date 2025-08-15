/**
 * useErrorHandler Hook
 * 
 * Comprehensive error handling hook with retry functionality and user feedback.
 * Provides consistent error handling patterns across the app.
 * 
 * Requirements: 1.3, 2.3, 5.4
 */

import { useState, useCallback, useRef } from 'react';
import { WatchlistStorageError } from '../services/WatchlistStorage';
import { STORAGE_ERRORS } from '../constants/storage';

export interface ErrorState {
  error: string | null;
  isRetrying: boolean;
  retryCount: number;
}

export interface ErrorHandlerOptions {
  maxRetries?: number;
  retryDelay?: number;
  showToast?: boolean;
  logErrors?: boolean;
}

export interface UseErrorHandlerReturn {
  error: string | null;
  isRetrying: boolean;
  retryCount: number;
  handleError: (error: unknown, context?: string) => void;
  retry: (operation: () => Promise<void>) => Promise<void>;
  clearError: () => void;
  getErrorMessage: (error: unknown) => string;
}

const DEFAULT_OPTIONS: Required<ErrorHandlerOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  showToast: true,
  logErrors: true,
};

export const useErrorHandler = (
  options: ErrorHandlerOptions = {}
): UseErrorHandlerReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isRetrying: false,
    retryCount: 0,
  });
  
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  /**
   * Gets a user-friendly error message from various error types
   */
  const getErrorMessage = useCallback((error: unknown): string => {
    if (error instanceof WatchlistStorageError) {
      switch (error.type) {
        case STORAGE_ERRORS.CORRUPTED_DATA:
          return 'Your watchlist data was corrupted and has been reset. You can start adding items again.';
        case STORAGE_ERRORS.STORAGE_FULL:
          return 'Your device storage is full. Please free up some space or remove items from your watchlist.';
        case STORAGE_ERRORS.NETWORK_ERROR:
          return 'Network connection issue. Please check your internet connection and try again.';
        default:
          return 'Failed to save your watchlist. Please try again.';
      }
    }

    if (error instanceof Error) {
      // Handle specific error messages
      if (error.message.includes('Network request failed')) {
        return 'Network connection issue. Please check your internet connection and try again.';
      }
      if (error.message.includes('timeout')) {
        return 'The operation timed out. Please try again.';
      }
      if (error.message.includes('quota')) {
        return 'Storage quota exceeded. Please free up some space on your device.';
      }
      
      return error.message || 'An unexpected error occurred. Please try again.';
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'An unexpected error occurred. Please try again.';
  }, []);

  /**
   * Handles errors with logging and user feedback
   */
  const handleError = useCallback((error: unknown, context?: string) => {
    const errorMessage = getErrorMessage(error);
    
    if (config.logErrors) {
      console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    }

    setErrorState(prev => ({
      ...prev,
      error: errorMessage,
    }));
  }, [getErrorMessage, config.logErrors]);

  /**
   * Retries a failed operation with exponential backoff
   */
  const retry = useCallback(async (operation: () => Promise<void>) => {
    if (errorState.retryCount >= config.maxRetries) {
      handleError(new Error('Maximum retry attempts reached. Please try again later.'));
      return;
    }

    setErrorState(prev => ({
      ...prev,
      isRetrying: true,
      retryCount: prev.retryCount + 1,
    }));

    try {
      // Calculate delay with exponential backoff
      const delay = config.retryDelay * Math.pow(2, errorState.retryCount);
      
      if (delay > 0) {
        await new Promise(resolve => {
          retryTimeoutRef.current = setTimeout(resolve, delay);
        });
      }

      await operation();
      
      // Success - clear error state
      setErrorState({
        error: null,
        isRetrying: false,
        retryCount: 0,
      });
    } catch (retryError) {
      setErrorState(prev => ({
        ...prev,
        isRetrying: false,
      }));
      
      handleError(retryError, 'retry operation');
    }
  }, [errorState.retryCount, config.maxRetries, config.retryDelay, handleError]);

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    setErrorState({
      error: null,
      isRetrying: false,
      retryCount: 0,
    });
  }, []);

  return {
    error: errorState.error,
    isRetrying: errorState.isRetrying,
    retryCount: errorState.retryCount,
    handleError,
    retry,
    clearError,
    getErrorMessage,
  };
};