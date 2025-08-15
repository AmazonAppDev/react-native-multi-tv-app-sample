# WatchlistIndicator Component

A visual indicator component that displays a bookmark icon overlay on grid items to show when content is saved in the user's watchlist.

## Features

- **TV-Optimized Design**: Uses `scaledPixels` for proper sizing on TV screens
- **Non-Interactive**: Doesn't interfere with focus management or navigation
- **High Visibility**: Gold bookmark icon with shadow for visibility on various backgrounds
- **Focus-Aware**: Adjusts shadow intensity when parent item is focused
- **Conditional Rendering**: Only renders when `isVisible` is true

## Usage

```tsx
import React from 'react';
import { WatchlistIndicator } from './WatchlistIndicator';
import { useWatchlist } from './WatchlistContext';

// Example usage in a grid item component
const GridItem = ({ item, isFocused }) => {
  const { isInWatchlist } = useWatchlist();
  
  return (
    <View style={styles.gridItem}>
      <Image source={{ uri: item.headerImage }} style={styles.image} />
      
      {/* Watchlist indicator overlay */}
      <WatchlistIndicator 
        isVisible={isInWatchlist(item.id)}
        isFocused={isFocused}
      />
      
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );
};
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isVisible` | `boolean` | Yes | - | Whether the indicator should be visible |
| `isFocused` | `boolean` | No | `false` | Whether the parent item is currently focused |

## Design Specifications

- **Size**: 24x32 pixels (scaled for TV)
- **Position**: Top-right corner with 8px margin
- **Color**: Gold (#FFD700) with darker gold border (#FFA500)
- **Shadow**: Drop shadow for visibility on various backgrounds
- **Shape**: Bookmark with triangular notch at bottom

## Requirements Fulfilled

- **6.1**: Displays visual indicator (bookmark icon) when item is in watchlist
- **6.4**: Non-interactive design doesn't interfere with TV remote navigation
- **6.5**: TV-safe colors and sizing ensure visibility from typical viewing distances

## Testing

The component includes comprehensive tests covering:
- Visibility logic based on `isVisible` prop
- Focus state styling variations
- Component structure and positioning
- Accessibility considerations
- Default prop handling

Run tests with:
```bash
npm test -- --testPathPattern="WatchlistIndicator.test.tsx"
```