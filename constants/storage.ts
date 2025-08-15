/**
 * Storage constants and schema definitions for watchlist functionality
 */

// AsyncStorage keys
export const STORAGE_KEYS = {
  WATCHLIST_ITEMS: '@watchlist_items',
} as const;

// Storage schema version for data migration
export const STORAGE_VERSION = 1;

// Default storage structure
export const DEFAULT_WATCHLIST_STORAGE = {
  version: STORAGE_VERSION,
  items: [],
} as const;

// Storage error types
export const STORAGE_ERRORS = {
  CORRUPTED_DATA: 'CORRUPTED_DATA',
  STORAGE_FULL: 'STORAGE_FULL',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type StorageErrorType = typeof STORAGE_ERRORS[keyof typeof STORAGE_ERRORS];