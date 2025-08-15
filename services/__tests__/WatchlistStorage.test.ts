/**
 * WatchlistStorage Service Tests
 * 
 * Tests for persistent storage functionality, error handling,
 * data validation, and migration logic.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { WatchlistStorage, WatchlistStorageError } from '../WatchlistStorage';
import { WatchlistItem } from '../../types/watchlist';
import { STORAGE_KEYS, STORAGE_ERRORS } from '../../constants/storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('WatchlistStorage', () => {
  const mockItem: Omit<WatchlistItem, 'addedAt'> = {
    id: '1',
    title: 'Test Movie',
    description: 'A test movie description',
    headerImage: 'https://example.com/image.jpg',
    movie: 'https://example.com/movie.mp4',
    duration: 120,
  };

  const mockWatchlistItem: WatchlistItem = {
    ...mockItem,
    addedAt: 1642678800000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWatchlist', () => {
    it('should return empty array when no data exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await WatchlistStorage.getWatchlist();

      expect(result).toEqual([]);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.WATCHLIST_ITEMS);
    });

    it('should return watchlist items when valid data exists', async () => {
      const storageData = {
        version: 1,
        items: [mockWatchlistItem],
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storageData));

      const result = await WatchlistStorage.getWatchlist();

      expect(result).toEqual([mockWatchlistItem]);
    });

    it('should handle corrupted JSON data', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');
      mockAsyncStorage.removeItem.mockResolvedValue();

      await expect(WatchlistStorage.getWatchlist()).rejects.toThrow(WatchlistStorageError);
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.WATCHLIST_ITEMS);
    });

    it('should migrate legacy data format', async () => {
      const legacyData = [mockWatchlistItem]; // Old format without version
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(legacyData));

      const result = await WatchlistStorage.getWatchlist();

      expect(result).toEqual([mockWatchlistItem]);
    });
  });

  describe('saveWatchlist', () => {
    it('should save watchlist items successfully', async () => {
      mockAsyncStorage.setItem.mockResolvedValue();

      await WatchlistStorage.saveWatchlist([mockWatchlistItem]);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.WATCHLIST_ITEMS,
        JSON.stringify({
          version: 1,
          items: [mockWatchlistItem],
        })
      );
    });

    it('should handle storage quota exceeded error', async () => {
      const quotaError = new Error('quota exceeded');
      mockAsyncStorage.setItem.mockRejectedValue(quotaError);

      await expect(WatchlistStorage.saveWatchlist([mockWatchlistItem])).rejects.toThrow(
        WatchlistStorageError
      );
    });
  });

  describe('addItem', () => {
    it('should add new item to empty watchlist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await WatchlistStorage.addItem(mockItem);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(mockItem);
      expect(result[0].addedAt).toBeGreaterThan(0);
    });

    it('should not add duplicate items', async () => {
      const existingData = {
        version: 1,
        items: [mockWatchlistItem],
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingData));

      const result = await WatchlistStorage.addItem(mockItem);

      expect(result).toEqual([mockWatchlistItem]);
      expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should add item to existing watchlist', async () => {
      const existingData = {
        version: 1,
        items: [mockWatchlistItem],
      };
      const newItem = { ...mockItem, id: '2', title: 'New Movie' };
      
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingData));
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await WatchlistStorage.addItem(newItem);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockWatchlistItem);
      expect(result[1]).toMatchObject(newItem);
    });
  });

  describe('removeItem', () => {
    it('should remove item from watchlist', async () => {
      const existingData = {
        version: 1,
        items: [mockWatchlistItem, { ...mockWatchlistItem, id: '2', title: 'Movie 2' }],
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingData));
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await WatchlistStorage.removeItem('1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should handle removing non-existent item', async () => {
      const existingData = {
        version: 1,
        items: [mockWatchlistItem],
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingData));
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await WatchlistStorage.removeItem('999');

      expect(result).toEqual([mockWatchlistItem]);
    });
  });

  describe('resetWatchlist', () => {
    it('should clear all watchlist data', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await WatchlistStorage.resetWatchlist();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.WATCHLIST_ITEMS);
    });
  });

  describe('data validation', () => {
    it('should validate required fields', async () => {
      const invalidItem = { id: '1', title: 'Test' }; // Missing required fields
      mockAsyncStorage.getItem.mockResolvedValue(null);

      await expect(WatchlistStorage.addItem(invalidItem as any)).rejects.toThrow();
    });

    it('should filter out invalid items during migration', async () => {
      const mixedData = {
        version: 1,
        items: [
          mockWatchlistItem,
          { id: '2' }, // Invalid item missing required fields
          { ...mockWatchlistItem, id: '3', title: 'Valid Movie' },
        ],
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mixedData));

      const result = await WatchlistStorage.getWatchlist();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
    });
  });
});