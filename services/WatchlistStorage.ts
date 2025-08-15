/**
 * WatchlistStorage Service
 * 
 * Handles persistent storage of watchlist items using AsyncStorage.
 * Provides CRUD operations with error handling and data validation.
 * 
 * Requirements: 5.1, 5.2, 5.4, 5.5
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { WatchlistItem, WatchlistStorage as WatchlistStorageType } from '../types/watchlist';
import {
  STORAGE_KEYS,
  STORAGE_VERSION,
  DEFAULT_WATCHLIST_STORAGE,
  STORAGE_ERRORS,
  StorageErrorType,
} from '../constants/storage';

export class WatchlistStorageError extends Error {
  constructor(
    message: string,
    public type: StorageErrorType,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'WatchlistStorageError';
  }
}

export class WatchlistStorage {
  /**
   * Retrieves the complete watchlist from AsyncStorage
   * Handles data validation and migration if needed
   * 
   * @returns Promise<WatchlistItem[]> Array of watchlist items
   * @throws WatchlistStorageError on storage failures or corrupted data
   */
  static async getWatchlist(): Promise<WatchlistItem[]> {
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEYS.WATCHLIST_ITEMS);
        
        if (!storedData) {
          // No data exists, return empty array
          return [];
        }

        const parsedData = JSON.parse(storedData) as WatchlistStorageType;
        
        // Validate and migrate data if necessary
        const validatedData = this.validateAndMigrateData(parsedData);
        
        return validatedData.items;
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Corrupted JSON data
          console.warn('Corrupted watchlist data detected, resetting to empty state');
          await this.resetWatchlist();
          throw new WatchlistStorageError(
            'Your watchlist data was corrupted and has been reset. You can start adding items again.',
            STORAGE_ERRORS.CORRUPTED_DATA,
            error
          );
        }
        
        if (error instanceof WatchlistStorageError) {
          throw error;
        }
        
        // Check if it's a network-related error
        if (error instanceof Error && (
          error.message.includes('Network') || 
          error.message.includes('timeout') ||
          error.message.includes('connection')
        )) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Network error, retrying... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            continue;
          }
          
          throw new WatchlistStorageError(
            'Network connection issue. Please check your internet connection and try again.',
            STORAGE_ERRORS.NETWORK_ERROR,
            error
          );
        }
        
        throw new WatchlistStorageError(
          'Failed to load your watchlist. Please try again.',
          STORAGE_ERRORS.UNKNOWN_ERROR,
          error as Error
        );
      }
    }
    
    // This should never be reached, but TypeScript requires it
    throw new WatchlistStorageError(
      'Failed to load your watchlist after multiple attempts.',
      STORAGE_ERRORS.UNKNOWN_ERROR
    );
  }

  /**
   * Saves the complete watchlist to AsyncStorage
   * 
   * @param items Array of watchlist items to save
   * @throws WatchlistStorageError on storage failures
   */
  static async saveWatchlist(items: WatchlistItem[]): Promise<void> {
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        const storageData: WatchlistStorageType = {
          version: STORAGE_VERSION,
          items: this.validateWatchlistItems(items),
        };

        await AsyncStorage.setItem(
          STORAGE_KEYS.WATCHLIST_ITEMS,
          JSON.stringify(storageData)
        );
        
        return; // Success
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('quota') || error.message.includes('storage full')) {
            throw new WatchlistStorageError(
              'Your device storage is full. Please free up some space or remove items from your watchlist.',
              STORAGE_ERRORS.STORAGE_FULL,
              error
            );
          }
          
          // Check if it's a network-related error
          if ((error.message.includes('Network') || 
               error.message.includes('timeout') ||
               error.message.includes('connection')) && 
              retryCount < maxRetries) {
            retryCount++;
            console.log(`Network error saving watchlist, retrying... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            continue;
          }
        }
        
        throw new WatchlistStorageError(
          'Failed to save your watchlist changes. Please try again.',
          STORAGE_ERRORS.UNKNOWN_ERROR,
          error as Error
        );
      }
    }
  }

  /**
   * Adds a new item to the watchlist
   * 
   * @param item The item to add (without addedAt timestamp)
   * @returns Promise<WatchlistItem[]> Updated watchlist
   * @throws WatchlistStorageError on storage failures or if item already exists
   */
  static async addItem(item: Omit<WatchlistItem, 'addedAt'>): Promise<WatchlistItem[]> {
    try {
      const currentWatchlist = await this.getWatchlist();
      
      // Check if item already exists
      const existingItem = currentWatchlist.find(
        (watchlistItem) => watchlistItem.id === item.id
      );
      
      if (existingItem) {
        // Item already exists, return current watchlist without changes
        return currentWatchlist;
      }
      
      // Create new item with timestamp
      const newItem: WatchlistItem = {
        ...item,
        addedAt: Date.now(),
      };
      
      // Validate the new item
      this.validateWatchlistItem(newItem);
      
      const updatedWatchlist = [...currentWatchlist, newItem];
      await this.saveWatchlist(updatedWatchlist);
      
      return updatedWatchlist;
    } catch (error) {
      if (error instanceof WatchlistStorageError) {
        throw error;
      }
      
      throw new WatchlistStorageError(
        'Failed to add item to watchlist',
        STORAGE_ERRORS.UNKNOWN_ERROR,
        error as Error
      );
    }
  }

  /**
   * Removes an item from the watchlist by ID
   * 
   * @param id The ID of the item to remove
   * @returns Promise<WatchlistItem[]> Updated watchlist
   * @throws WatchlistStorageError on storage failures
   */
  static async removeItem(id: string | number): Promise<WatchlistItem[]> {
    try {
      const currentWatchlist = await this.getWatchlist();
      
      const updatedWatchlist = currentWatchlist.filter(
        (item) => item.id !== id
      );
      
      await this.saveWatchlist(updatedWatchlist);
      
      return updatedWatchlist;
    } catch (error) {
      if (error instanceof WatchlistStorageError) {
        throw error;
      }
      
      throw new WatchlistStorageError(
        'Failed to remove item from watchlist',
        STORAGE_ERRORS.UNKNOWN_ERROR,
        error as Error
      );
    }
  }

  /**
   * Clears all watchlist data (used for error recovery)
   * 
   * @returns Promise<void>
   */
  static async resetWatchlist(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.WATCHLIST_ITEMS);
    } catch (error) {
      throw new WatchlistStorageError(
        'Failed to reset watchlist',
        STORAGE_ERRORS.UNKNOWN_ERROR,
        error as Error
      );
    }
  }

  /**
   * Validates and migrates storage data to current version
   * 
   * @param data Raw storage data
   * @returns Validated and migrated storage data
   * @throws WatchlistStorageError if data is invalid
   */
  private static validateAndMigrateData(data: any): WatchlistStorageType {
    // Check if data has the expected structure
    if (!data || typeof data !== 'object') {
      throw new WatchlistStorageError(
        'Invalid storage data format',
        STORAGE_ERRORS.CORRUPTED_DATA
      );
    }

    // Handle missing version (legacy data)
    if (!data.version) {
      console.log('Migrating legacy watchlist data to version 1');
      data = {
        version: STORAGE_VERSION,
        items: Array.isArray(data) ? data : data.items || [],
      };
    }

    // Handle version mismatches (future versions)
    if (data.version > STORAGE_VERSION) {
      console.warn(`Watchlist data version ${data.version} is newer than supported version ${STORAGE_VERSION}`);
      // For now, we'll try to use the data as-is
    }

    // Validate items array
    if (!Array.isArray(data.items)) {
      throw new WatchlistStorageError(
        'Watchlist items must be an array',
        STORAGE_ERRORS.CORRUPTED_DATA
      );
    }

    // Validate each item
    const validatedItems = data.items
      .map((item: any, index: number) => {
        try {
          return this.validateWatchlistItem(item);
        } catch (error) {
          console.warn(`Removing invalid watchlist item at index ${index}:`, error);
          return null;
        }
      })
      .filter((item: WatchlistItem | null): item is WatchlistItem => item !== null);

    return {
      version: STORAGE_VERSION,
      items: validatedItems,
    };
  }

  /**
   * Validates a single watchlist item
   * 
   * @param item Item to validate
   * @returns Validated item
   * @throws Error if item is invalid
   */
  private static validateWatchlistItem(item: any): WatchlistItem {
    if (!item || typeof item !== 'object') {
      throw new Error('Item must be an object');
    }

    const requiredFields = ['id', 'title', 'description', 'headerImage', 'movie'];
    for (const field of requiredFields) {
      if (!item[field] || typeof item[field] !== 'string') {
        if (field === 'id' && (typeof item[field] === 'number')) {
          continue; // ID can be string or number
        }
        throw new Error(`Missing or invalid required field: ${field}`);
      }
    }

    // Validate optional fields
    if (item.duration !== undefined && typeof item.duration !== 'number') {
      throw new Error('Duration must be a number');
    }

    if (item.addedAt !== undefined && typeof item.addedAt !== 'number') {
      throw new Error('addedAt must be a number');
    }

    return {
      id: item.id,
      title: item.title,
      description: item.description,
      headerImage: item.headerImage,
      movie: item.movie,
      duration: item.duration,
      addedAt: item.addedAt || Date.now(),
    };
  }

  /**
   * Validates an array of watchlist items
   * 
   * @param items Items to validate
   * @returns Validated items array
   */
  private static validateWatchlistItems(items: WatchlistItem[]): WatchlistItem[] {
    if (!Array.isArray(items)) {
      throw new Error('Items must be an array');
    }

    return items.map((item, index) => {
      try {
        return this.validateWatchlistItem(item);
      } catch (error) {
        throw new Error(`Invalid item at index ${index}: ${error}`);
      }
    });
  }
}