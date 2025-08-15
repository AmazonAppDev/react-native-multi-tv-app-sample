# WatchlistButton Component

A reusable button component for adding and removing items from the user's watchlist. Optimized for TV navigation with proper focus states and visual feedback.

## Features

- **TV-Optimized Navigation**: Uses `SpatialNavigationFocusableView` for remote control navigation
- **Dynamic State**: Automatically switches between "Add to Watchlist" and "Remove from Watchlist" based on current state
- **Visual Feedback**: Shows loading states and success feedback
- **Error Handling**: Proper async error handling with callback support
- **Consistent Styling**: Follows existing app patterns with `scaledPixels` for TV viewing

## Usage

```tsx
import WatchlistButton from '@/components/WatchlistButton';
import { WatchlistItem } from '@/types/watchlist';

const item: Omit<WatchlistItem, 'addedAt'> = {
  id: '1',
  title: 'Movie Title',
  description: 'Movie description',
  headerImage: 'https://example.com/image.jpg',
  movie: 'https://example.com/video.mp4',
  duration: 120,
};

// Basic usage
<WatchlistButton item={item} />

// With callbacks
<WatchlistButton 
  item={item}
  onSuccess={(action) => {
    console.log(`Item ${action} successfully`);
  }}
  onError={(error) => {
    console.error('Watchlist operation failed:', error);
  }}
/>

// With custom styling
<WatchlistButton 
  item={item}
  style={{ marginTop: 20 }}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `item` | `Omit<WatchlistItem, 'addedAt'>` | Yes | The item to add/remove from watchlist |
| `style` | `ViewStyle` | No | Custom styles to apply to the button |
| `onSuccess` | `(action: 'added' \| 'removed') => void` | No | Callback when operation succeeds |
| `onError` | `(error: string) => void` | No | Callback when operation fails |

## States

The button automatically handles different visual states:

1. **Add to Watchlist** - When item is not in watchlist (default background)
2. **Remove from Watchlist** - When item is in watchlist (red tinted background)
3. **Loading** - Shows spinner and "Adding..." or "Removing..." text
4. **Success** - Briefly shows "Added!" or "Removed!" feedback

## TV Navigation

- Fully compatible with TV remote controls
- Proper focus states with visual feedback
- Follows existing app focus patterns (white background when focused)
- Disabled state prevents multiple operations

## Requirements Fulfilled

- **1.1**: Add to watchlist button on details page
- **1.2**: Visual feedback for add/remove operations
- **1.3**: Proper error handling for async operations
- **1.5**: TV remote control accessibility
- **2.1**: Remove from watchlist functionality
- **2.2**: Visual feedback for removal
- **2.3**: Error handling for remove operations