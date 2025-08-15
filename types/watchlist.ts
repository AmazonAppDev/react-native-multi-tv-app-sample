/**
 * Watchlist data models and types
 * Matches the existing moviesData structure for consistency
 */

export interface WatchlistItem {
  id: string | number;
  title: string;
  description: string;
  headerImage: string;
  movie: string;
  duration?: number;
  addedAt: number; // Timestamp when added to watchlist
}

export interface WatchlistStorage {
  version: number;
  items: WatchlistItem[];
}

export interface WatchlistContextType {
  watchlist: WatchlistItem[];
  isInWatchlist: (id: string | number) => boolean;
  addToWatchlist: (item: Omit<WatchlistItem, 'addedAt'>) => Promise<void>;
  removeFromWatchlist: (id: string | number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isRetrying?: boolean;
  retryLoadWatchlist?: () => Promise<void>;
  clearError?: () => void;
}