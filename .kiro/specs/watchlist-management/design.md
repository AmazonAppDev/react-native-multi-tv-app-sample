# Design Document

## Overview

The watchlist feature will be implemented as a comprehensive content management system that integrates seamlessly with the existing TV app architecture. The design follows the established patterns of the app, including React Context for state management, Expo Router for navigation, and react-tv-space-navigation for TV-optimized focus management.

The feature consists of four main components:
1. **Watchlist Context Provider** - Global state management for watchlist data
2. **Watchlist Screen** - Dedicated screen for viewing saved content
3. **Watchlist Controls** - Add/remove buttons integrated into existing screens
4. **Storage Service** - Persistent data storage using AsyncStorage

## Architecture

### Component Architecture

```
WatchlistProvider (Context)
├── WatchlistScreen (New Route)
│   ├── WatchlistGrid (Content Display)
│   └── EmptyState (No Items View)
├── WatchlistButton (Details Screen Integration)
└── WatchlistIndicator (Grid Item Overlay)
```

### Data Flow

```
User Action → WatchlistContext → AsyncStorage → UI Update
     ↑                                            ↓
     └────────── Visual Feedback ←────────────────┘
```

### Navigation Integration

The watchlist will be added to the existing drawer navigation structure:
- New drawer menu item: "Watchlist"
- New route: `app/(drawer)/watchlist.tsx`
- Integration with existing `CustomDrawerContent.tsx`

## Components and Interfaces

### 1. Watchlist Context Provider

**Location:** `components/WatchlistContext.tsx`

**Interface:**
```typescript
interface WatchlistItem {
  id: string | number;
  title: string;
  description: string;
  headerImage: string;
  movie: string;
  duration?: number;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  isInWatchlist: (id: string | number) => boolean;
  addToWatchlist: (item: WatchlistItem) => Promise<void>;
  removeFromWatchlist: (id: string | number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
```

**Responsibilities:**
- Manage global watchlist state
- Provide CRUD operations for watchlist items
- Handle persistence through AsyncStorage
- Provide loading and error states

### 2. Watchlist Screen

**Location:** `app/(drawer)/watchlist.tsx`

**Features:**
- Grid layout matching the existing home screen design
- TV-optimized navigation using SpatialNavigationRoot
- Empty state when no items are saved
- Focus management for remote control navigation
- Integration with existing scaledPixels hook for responsive design

**Layout:**
- Header with "My Watchlist" title
- Grid of watchlist items (4 items per row on TV)
- Each item shows poster, title, and remove option
- Empty state with helpful messaging

### 3. Watchlist Button Component

**Location:** `components/WatchlistButton.tsx`

**Features:**
- Toggle button for add/remove functionality
- TV-optimized focus states
- Visual feedback for state changes
- Integration with existing FocusablePressable pattern

**States:**
- "Add to Watchlist" (when item not in watchlist)
- "Remove from Watchlist" (when item is in watchlist)
- Loading state during async operations

### 4. Watchlist Indicator

**Location:** `components/WatchlistIndicator.tsx`

**Features:**
- Small bookmark icon overlay on grid items
- Appears on items that are in the watchlist
- Positioned in top-right corner of thumbnails
- TV-safe colors and sizing

### 5. Storage Service

**Location:** `services/WatchlistStorage.ts`

**Interface:**
```typescript
class WatchlistStorage {
  static async getWatchlist(): Promise<WatchlistItem[]>
  static async saveWatchlist(items: WatchlistItem[]): Promise<void>
  static async addItem(item: WatchlistItem): Promise<WatchlistItem[]>
  static async removeItem(id: string | number): Promise<WatchlistItem[]>
}
```

**Features:**
- AsyncStorage integration for persistence
- Error handling for corrupted data
- Automatic data migration if needed
- Performance optimization for large lists

## Data Models

### WatchlistItem Model

```typescript
interface WatchlistItem {
  id: string | number;           // Unique identifier
  title: string;                 // Movie/show title
  description: string;           // Content description
  headerImage: string;           // Poster/thumbnail URL
  movie: string;                 // Video URL
  duration?: number;             // Duration in minutes (optional)
  addedAt: number;              // Timestamp when added
}
```

### Storage Schema

**AsyncStorage Key:** `@watchlist_items`

**Data Format:**
```json
{
  "version": 1,
  "items": [
    {
      "id": "0",
      "title": "Sintel",
      "description": "...",
      "headerImage": "...",
      "movie": "...",
      "duration": 100,
      "addedAt": 1642678800000
    }
  ]
}
```

## Error Handling

### Storage Errors
- **Corrupted Data:** Reset to empty watchlist with user notification
- **Storage Full:** Display error message and prevent new additions
- **Network Issues:** Cache operations and retry when connection restored

### UI Error States
- **Loading Failures:** Show retry button with error message
- **Empty States:** Friendly messaging with guidance
- **Operation Failures:** Toast notifications for add/remove failures

### Error Recovery
- Automatic retry for transient failures
- Graceful degradation when storage unavailable
- User-friendly error messages optimized for TV viewing

## Testing Strategy

### Unit Tests
- **WatchlistContext:** State management and async operations
- **WatchlistStorage:** Data persistence and error handling
- **WatchlistButton:** User interactions and state changes
- **WatchlistIndicator:** Visual state rendering

### Integration Tests
- **Navigation Flow:** Drawer → Watchlist screen → Item details
- **Cross-Screen State:** Add item on details, verify on watchlist screen
- **Persistence:** Add items, restart app, verify data restored
- **Focus Management:** Remote control navigation through all components

### TV-Specific Tests
- **Focus States:** All interactive elements properly focusable
- **Remote Control:** D-pad navigation works correctly
- **Screen Sizes:** Responsive design across different TV resolutions
- **Performance:** Smooth animations and transitions on TV hardware

### Test Data
- Use existing `moviesData` array for consistent test scenarios
- Mock AsyncStorage for isolated unit tests
- Test with empty, small, and large watchlist datasets
- Verify behavior with corrupted storage data

## Implementation Notes

### TV Optimization Considerations
- All interactive elements use `SpatialNavigationFocusableView`
- Focus indicators follow existing app patterns (white border)
- Text sizes use `scaledPixels()` for TV viewing distances
- Colors optimized for TV displays and viewing conditions

### Performance Considerations
- Lazy loading for large watchlists
- Efficient re-renders using React.memo where appropriate
- Debounced storage operations to prevent excessive writes
- Optimistic UI updates for better perceived performance

### Accessibility
- Proper focus management for screen readers
- High contrast visual indicators
- Clear visual feedback for all state changes
- Keyboard navigation support for web platform

### Platform Compatibility
- AsyncStorage works across all target platforms (iOS, Android, Web)
- Responsive design adapts to different screen sizes
- Platform-specific optimizations where needed
- Consistent behavior across Android TV, Fire TV, and tvOS