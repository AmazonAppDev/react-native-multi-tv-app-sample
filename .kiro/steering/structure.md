# Project Structure

## Root Directory Organization
```
├── app/                    # Expo Router app directory (file-based routing)
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── assets/                 # Static assets (images, fonts, icons)
├── android/                # Android/Android TV native code
├── ios/                    # iOS/tvOS native code
└── node_modules/           # Dependencies
```

## App Directory Structure (Expo Router)
```
app/
├── (drawer)/              # Drawer navigation group
│   ├── _layout.tsx        # Drawer layout configuration
│   ├── index.tsx          # Home screen (main content grid)
│   ├── explore.tsx        # Explore screen
│   └── tv.tsx             # TV screen
├── remote-control/        # Remote control management modules
├── _layout.tsx            # Root layout with providers
├── details.tsx            # Content details screen
├── player.tsx             # Video player screen
├── +html.tsx              # Custom HTML document (web)
└── +not-found.tsx         # 404 error screen
```

## Components Directory
```
components/
├── player/                # Video player related components
│   ├── Controls.tsx       # Player control buttons
│   ├── ExitButton.tsx     # Exit/back button
│   ├── SeekBar.tsx        # Video seek bar
│   └── VideoPlayer.tsx    # Main video player component
├── __tests__/             # Component tests
├── CustomDrawerContent.tsx # Custom drawer navigation content
├── FocusablePressable.tsx  # TV-optimized pressable component
├── LoadingIndicator.tsx    # Loading spinner component
└── MenuContext.tsx         # Menu state context provider
```

## Assets Organization
```
assets/
├── fonts/                 # Custom fonts (SpaceMono)
├── images/                # App images and graphics
└── tv_icons/              # TV platform specific icons
    ├── icon-400x240.png   # Android TV banner
    ├── icon-800x480.png   # Small icon 2x
    ├── icon-1280x768.png  # Apple TV icon
    └── icon-1920x720.png  # Top shelf images
```

## Key Architectural Patterns

### File-Based Routing
- Uses Expo Router with file-based routing convention
- Route groups with parentheses: `(drawer)` for drawer navigation
- Special files: `_layout.tsx` for layouts, `+not-found.tsx` for error pages

### Component Patterns
- **TV-Optimized Components**: All interactive components use `SpatialNavigationFocusableView`
- **Focus Management**: Components handle focused/unfocused states for TV navigation
- **Scaling**: Use `scaledPixels()` hook for responsive sizing across TV screen sizes
- **Context Providers**: Menu state managed through React Context

### Platform-Specific Files
- TV-specific implementations can use `.tv.tsx` extension
- Platform-specific code in `*.ios.tv.tsx` or `*.android.tv.tsx`
- Metro resolver automatically picks TV-specific files when `EXPO_TV=1`

### Remote Control Integration
- Remote control logic centralized in `app/remote-control/` directory
- Platform-specific implementations for iOS and Android TV
- Key event handling through `react-native-keyevent` library

### Styling Conventions
- StyleSheet.create() for component styles
- Responsive scaling using custom `scaledPixels` hook
- TV-optimized focus states with distinct visual feedback
- Dark theme as default for TV viewing experience