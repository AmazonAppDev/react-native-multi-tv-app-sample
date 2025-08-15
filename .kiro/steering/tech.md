# Technology Stack

## Core Framework
- **React Native**: v0.74.2 (using react-native-tvos fork for TV support)
- **Expo**: ~51.0.13 with TV-specific configuration
- **TypeScript**: ~5.3.3 with strict mode enabled
- **Expo Router**: File-based routing with typed routes

## Key Libraries
- **react-tv-space-navigation**: Focus management and spatial navigation for TV
- **react-native-video**: Video playback with TV-optimized controls
- **@react-navigation/drawer**: Drawer navigation component
- **react-native-keyevent**: Remote control key event handling
- **react-native-reanimated**: Smooth animations and transitions

## Development Tools
- **ESLint**: Code linting with TypeScript and React rules
- **Prettier**: Code formatting (120 char width, single quotes, trailing commas)
- **Husky**: Git hooks for pre-commit linting
- **Jest**: Testing framework with Expo preset
- **Commitlint**: Conventional commit message enforcement

## Build System
- **Metro**: React Native bundler with TV-specific file resolution
- **Expo Prebuild**: Native project generation optimized for TV platforms

## Common Commands

### Development
```bash
# Start development server (TV mode)
npm start
# or
EXPO_TV=1 expo start

# Run on Android TV/Fire TV
npm run android
# or
EXPO_TV=1 expo run:android

# Run on tvOS
npm run ios
# or
EXPO_TV=1 expo run:ios

# Run on web
npm run web
```

### Build & Deploy
```bash
# Clean prebuild for TV platforms
npm run prebuild
# or
EXPO_TV=1 expo prebuild --clean

# Export web build
expo export -p web
```

### Code Quality
```bash
# Run linter
npm run lint

# Run tests
npm test

# Format code
prettier --write .
```

## Environment Variables
- **EXPO_TV=1**: Required for all TV-specific builds and development
- Set this environment variable before running any Expo commands for TV platforms

## Platform-Specific Configurations
- TV-specific file extensions supported: `*.tv.tsx`, `*.ios.tv.tsx`, `*.android.tv.tsx`
- New Architecture disabled for both iOS and Android for TV compatibility
- Custom TV icons and banners configured in app.json