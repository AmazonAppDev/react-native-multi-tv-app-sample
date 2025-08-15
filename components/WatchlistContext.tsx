/**
 * WatchlistContext Provider
 *
 * Provides global state management for watchlist functionality.
 * Handles CRUD operations, loading states, and error handling.
 *
 * Requirements: 1.2, 1.3, 2.2, 2.3, 5.1, 5.3, 5.5
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { WatchlistItem, WatchlistContextType } from '../types/watchlist';
import { WatchlistStorage, WatchlistStorageError } from '../services/WatchlistStorage';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useWatchlistPerformance } from '../hooks/usePerformanceMonitor';

// Create the context
const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

// Custom hook to use the watchlist context
export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

interface WatchlistProviderProps {
  children: React.ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  // State management
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Enhanced error handling
  const { error, isRetrying, handleError, retry, clearError } = useErrorHandler({
    maxRetries: 3,
    retryDelay: 1000,
    logErrors: true,
  });

  // Performance monitoring
  const { trackLoadOperation, trackAddOperation, trackRemoveOperation, getMemoryUsage, logSummary } =
    useWatchlistPerformance();

  // Initialize watchlist data on mount
  useEffect(() => {
    loadWatchlist();
  }, []);

  // Cleanup performance monitoring on unmount
  useEffect(() => {
    return () => {
      logSummary();
    };
  }, [logSummary]);

  /**
   * Loads watchlist data from storage
   * Handles initial loading and error recovery
   */
  const loadWatchlist = useCallback(async () => {
    const endTracking = trackLoadOperation();

    try {
      setIsLoading(true);
      clearError();

      const items = await WatchlistStorage.getWatchlist();
      setWatchlist(items);

      // Log performance for large datasets
      if (items.length > 100) {
        console.log(`[Performance] Loaded ${items.length} watchlist items, Memory: ${getMemoryUsage()} bytes`);
      }
    } catch (err) {
      handleError(err, 'loading watchlist');

      // If data was corrupted and reset, start with empty watchlist
      if (err instanceof WatchlistStorageError && err.type === 'CORRUPTED_DATA') {
        setWatchlist([]);
      }
    } finally {
      setIsLoading(false);
      endTracking();
    }
  }, [handleError, clearError, trackLoadOperation, getMemoryUsage]);

  /**
   * Retries loading the watchlist
   */
  const retryLoadWatchlist = useCallback(async () => {
    await retry(loadWatchlist);
  }, [retry, loadWatchlist]);

  /**
   * Checks if an item is in the watchlist
   *
   * @param id The ID of the item to check
   * @returns boolean indicating if item is in watchlist
   */
  const isInWatchlist = useCallback(
    (id: string | number): boolean => {
      return watchlist.some((item) => item.id === id);
    },
    [watchlist],
  );

  /**
   * Adds an item to the watchlist
   * Provides optimistic UI updates and error handling
   *
   * @param item The item to add (without addedAt timestamp)
   */
  const addToWatchlist = useCallback(
    async (item: Omit<WatchlistItem, 'addedAt'>): Promise<void> => {
      const endTracking = trackAddOperation();

      // Check if item is already in watchlist
      if (isInWatchlist(item.id)) {
        endTracking();
        return; // Item already exists, no need to add
      }

      // Optimistic update - add item immediately to UI
      const optimisticItem: WatchlistItem = {
        ...item,
        addedAt: Date.now(),
      };

      const previousWatchlist = watchlist;
      setWatchlist((prev) => [...prev, optimisticItem]);
      clearError();

      try {
        // Persist to storage
        const updatedWatchlist = await WatchlistStorage.addItem(item);

        // Update state with the actual stored data (in case of any differences)
        setWatchlist(updatedWatchlist);
      } catch (err) {
        // Revert optimistic update on error
        setWatchlist(previousWatchlist);
        handleError(err, 'adding item to watchlist');

        // Re-throw error so calling components can handle it
        throw err;
      } finally {
        endTracking();
      }
    },
    [watchlist, isInWatchlist, handleError, clearError, trackAddOperation],
  );

  /**
   * Removes an item from the watchlist
   * Provides optimistic UI updates and error handling
   *
   * @param id The ID of the item to remove
   */
  const removeFromWatchlist = useCallback(
    async (id: string | number): Promise<void> => {
      const endTracking = trackRemoveOperation();

      // Check if item exists in watchlist
      if (!isInWatchlist(id)) {
        endTracking();
        return; // Item doesn't exist, no need to remove
      }

      // Optimistic update - remove item immediately from UI
      const previousWatchlist = watchlist;
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
      clearError();

      try {
        // Persist to storage
        const updatedWatchlist = await WatchlistStorage.removeItem(id);

        // Update state with the actual stored data
        setWatchlist(updatedWatchlist);
      } catch (err) {
        // Revert optimistic update on error
        setWatchlist(previousWatchlist);
        handleError(err, 'removing item from watchlist');

        // Re-throw error so calling components can handle it
        throw err;
      } finally {
        endTracking();
      }
    },
    [watchlist, isInWatchlist, handleError, clearError, trackRemoveOperation],
  );

  // Context value
  const contextValue: WatchlistContextType = {
    watchlist,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isLoading,
    error,
    isRetrying,
    retryLoadWatchlist,
    clearError,
  };

  return <WatchlistContext.Provider value={contextValue}>{children}</WatchlistContext.Provider>;
};

export default WatchlistProvider;
