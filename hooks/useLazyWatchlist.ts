/**
 * Hook for lazy loading watchlist items to improve performance with large datasets
 * Implements virtual scrolling and pagination for optimal memory usage
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { WatchlistItem } from '../types/watchlist';

interface LazyWatchlistOptions {
  pageSize?: number;
  preloadPages?: number;
  enableVirtualization?: boolean;
}

interface LazyWatchlistResult {
  visibleItems: WatchlistItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  loadPage: (page: number) => void;
  getItemLayout: (data: any, index: number) => { length: number; offset: number; index: number };
}

export const useLazyWatchlist = (
  allItems: WatchlistItem[],
  options: LazyWatchlistOptions = {}
): LazyWatchlistResult => {
  const {
    pageSize = 20,
    preloadPages = 1,
    enableVirtualization = true,
  } = options;

  const [currentPage, setCurrentPage] = useState(0);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([0]));
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(allItems.length / pageSize);
  const hasMore = currentPage < totalPages - 1;

  // Memoize visible items to prevent unnecessary recalculations
  const visibleItems = useMemo(() => {
    if (!enableVirtualization || allItems.length <= pageSize) {
      return allItems;
    }

    const items: WatchlistItem[] = [];
    const pagesToLoad = Array.from(loadedPages).sort((a, b) => a - b);
    
    pagesToLoad.forEach(page => {
      const startIndex = page * pageSize;
      const endIndex = Math.min(startIndex + pageSize, allItems.length);
      items.push(...allItems.slice(startIndex, endIndex));
    });

    return items;
  }, [allItems, loadedPages, pageSize, enableVirtualization]);

  // Load more items (next page)
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate async loading delay
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadedPages(prev => new Set([...prev, currentPage + 1]));
      setIsLoading(false);
    }, 100);
  }, [isLoading, hasMore, currentPage]);

  // Load specific page
  const loadPage = useCallback((page: number) => {
    if (page < 0 || page >= totalPages || loadedPages.has(page)) return;

    setIsLoading(true);
    
    setTimeout(() => {
      setLoadedPages(prev => new Set([...prev, page]));
      setCurrentPage(Math.max(currentPage, page));
      setIsLoading(false);
    }, 100);
  }, [totalPages, loadedPages, currentPage]);

  // Preload adjacent pages for smoother scrolling
  useEffect(() => {
    if (!enableVirtualization || preloadPages === 0) return;

    const pagesToPreload: number[] = [];
    
    // Preload pages around current page
    for (let i = -preloadPages; i <= preloadPages; i++) {
      const page = currentPage + i;
      if (page >= 0 && page < totalPages && !loadedPages.has(page)) {
        pagesToPreload.push(page);
      }
    }

    if (pagesToPreload.length > 0) {
      // Preload with a slight delay to not block main thread
      setTimeout(() => {
        pagesToPreload.forEach(page => loadPage(page));
      }, 50);
    }
  }, [currentPage, totalPages, loadedPages, preloadPages, enableVirtualization, loadPage]);

  // Optimized getItemLayout for FlatList performance
  const getItemLayout = useCallback((data: any, index: number) => {
    const ITEM_HEIGHT = 300; // Height of each watchlist item + margin
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * Math.floor(index / 4), // 4 items per row
      index,
    };
  }, []);

  // Clean up loaded pages when items change significantly
  useEffect(() => {
    if (allItems.length === 0) {
      setLoadedPages(new Set([0]));
      setCurrentPage(0);
    }
  }, [allItems.length]);

  return {
    visibleItems,
    totalItems: allItems.length,
    currentPage,
    totalPages,
    isLoading,
    hasMore,
    loadMore,
    loadPage,
    getItemLayout,
  };
};

// Hook for managing watchlist item visibility in viewport
export const useWatchlistViewport = (itemCount: number) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  
  const updateVisibleRange = useCallback((viewableItems: any[]) => {
    if (viewableItems.length === 0) return;
    
    const start = Math.max(0, viewableItems[0].index - 5); // Buffer before
    const end = Math.min(itemCount, viewableItems[viewableItems.length - 1].index + 5); // Buffer after
    
    setVisibleRange({ start, end });
  }, [itemCount]);

  return {
    visibleRange,
    updateVisibleRange,
  };
};

export default useLazyWatchlist;