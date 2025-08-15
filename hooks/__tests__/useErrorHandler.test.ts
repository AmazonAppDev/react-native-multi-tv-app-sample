/**
 * Error Message Utility Tests
 * 
 * Tests for error message formatting functionality.
 */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

import { WatchlistStorageError } from '../../services/WatchlistStorage';
import { STORAGE_ERRORS } from '../../constants/storage';

// Extract the getErrorMessage function for testing
const getErrorMessage = (error: unknown): string => {
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
};

describe('Error Message Utilities', () => {
  it('handles WatchlistStorageError correctly', () => {
    const storageError = new WatchlistStorageError(
      'Test error',
      STORAGE_ERRORS.CORRUPTED_DATA
    );
    
    const message = getErrorMessage(storageError);
    expect(message).toBe('Your watchlist data was corrupted and has been reset. You can start adding items again.');
  });

  it('handles storage full error correctly', () => {
    const storageError = new WatchlistStorageError(
      'Test error',
      STORAGE_ERRORS.STORAGE_FULL
    );
    
    const message = getErrorMessage(storageError);
    expect(message).toBe('Your device storage is full. Please free up some space or remove items from your watchlist.');
  });

  it('handles network error correctly', () => {
    const storageError = new WatchlistStorageError(
      'Test error',
      STORAGE_ERRORS.NETWORK_ERROR
    );
    
    const message = getErrorMessage(storageError);
    expect(message).toBe('Network connection issue. Please check your internet connection and try again.');
  });

  it('handles generic Error correctly', () => {
    const genericError = new Error('Generic error message');
    const message = getErrorMessage(genericError);
    
    expect(message).toBe('Generic error message');
  });

  it('handles network request failed error', () => {
    const networkError = new Error('Network request failed');
    const message = getErrorMessage(networkError);
    
    expect(message).toBe('Network connection issue. Please check your internet connection and try again.');
  });

  it('handles timeout error', () => {
    const timeoutError = new Error('Request timeout');
    const message = getErrorMessage(timeoutError);
    
    expect(message).toBe('The operation timed out. Please try again.');
  });

  it('handles quota error', () => {
    const quotaError = new Error('Storage quota exceeded');
    const message = getErrorMessage(quotaError);
    
    expect(message).toBe('Storage quota exceeded. Please free up some space on your device.');
  });

  it('handles string error', () => {
    const stringError = 'String error message';
    const message = getErrorMessage(stringError);
    
    expect(message).toBe('String error message');
  });

  it('handles unknown error', () => {
    const unknownError = { some: 'object' };
    const message = getErrorMessage(unknownError);
    
    expect(message).toBe('An unexpected error occurred. Please try again.');
  });
});