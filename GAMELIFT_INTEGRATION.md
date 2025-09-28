# GameLift Streams Integration

**Status**: Development Ready ✅ (WebView loading works, GameLift JS loading needs production build)

## Overview

GameLift Streams integration for React Native Multi-TV App with **content-first authentication**. Users can browse content without login - authentication only required for Games section.

## Current Status

### ✅ Working Features
- **Navigation**: Games grid with left/right arrow navigation
- **Menu Integration**: Left arrow on first game opens drawer menu
- **Authentication Flow**: Login redirect and token management
- **WebView Loading**: HTML loads successfully on all platforms
- **API Communication**: WebView ↔ React Native message passing
- **Image Loading**: Game images display correctly (sample1.png, sample2.jpg)
- **Development Environment**: Live reload setup for Fire TV development

### ⚠️ Known Issues
- **GameLift JavaScript Loading**: Metro bundler blocks .js assets in development mode
  - **Workaround**: Build production APK where Metro bundles assets properly
  - **Impact**: WebView loads but GameLift SDK functions not available in development
  - **Solution**: Use `eas build --platform android --profile production` for full testing

## Architecture

- **Content-first** - Home, Explore, TV accessible without login
- **Games integration** - Direct GameLift integration with auto-redirect to login
- **Cross-platform** - WebView (TV), iframe (web) with unified message passing
- **Clean UI** - TV-optimized interface with modern gaming aesthetic
- **Game Configuration** - JSON-based game library with auto-configuration

## Setup

### 1. Configuration
```bash
cp aws-exports.example.js aws-exports.js
# Edit aws-exports.js with your AWS values

cp assets/games/games.example.json assets/games/games.json
# Edit games.json with your game configurations
```

### 2. AWS Infrastructure
Deploy using reference CDK:
```bash
cdk deploy AmazonGameliftStreamsReactStarterAPIStack
```

### 3. Update Configuration
```javascript
// aws-exports.js
aws_user_pools_id: 'us-west-2_YourPoolId',
aws_user_pools_web_client_id: 'YourClientId',
endpoint: 'https://YourEndpoint.execute-api.us-west-2.amazonaws.com/prod',
```

## User Flow

1. **Launch** → Browse content freely (Home, Explore, TV)
2. **Click Games** → Auto-redirect to login if not authenticated
3. **Login** → TV-optimized screen with error handling
4. **Browse Games** → Hero section with horizontal game cards
5. **Select Game** → Direct launch to streaming interface
6. **Stream** → Auto-configured with game settings, clean UI

## Key Files

```
aws-exports.js                   # AWS config (excluded from git)
aws-exports.example.js           # Template with placeholders
assets/games/games.json          # Game library config (excluded from git)
assets/games/games.example.json  # Template with sample games
app/login.tsx                    # TV-optimized login
app/(drawer)/games.tsx           # Games section with navigation
components/GamesGrid.tsx         # Game selection interface
context/AuthContext.tsx          # Authentication state
modules/gamelift-streams/        # GameLift integration
assets/gamelift-web/index.html   # Clean streaming interface
utils/gamesConfig.ts             # Game configuration utilities
```

## Platform Support

- ✅ **Android TV / Fire TV** - WebView with postMessage
- ✅ **tvOS** - Native WebView integration  
- ✅ **Web** - iframe with window.parent.postMessage

## Authentication

### React Native
- **AuthContext** - App-wide auth state with token management
- **Direct redirect** - Games → Login (standard TV pattern)
- **Email display** - Shows user email in drawer

### WebView/Iframe
- **Token-based API** - `Authorization: Bearer ${token}`
- **Platform communication** - Unified message passing
- **No Amplify dependency** - Simplified web app

## API Integration

```typescript
// Token passing
const session = await fetchAuthSession();
const token = session.tokens?.idToken?.toString();

// WebView (TV)
webViewRef.current?.postMessage(JSON.stringify({
  type: 'auth-token', token
}));

// iframe (web)  
iframe.contentWindow.postMessage(JSON.stringify({
  type: 'auth-token', token
}), '*');
```

## Deployment, Testing and Troubleshooting

### Web Development
```bash
# Start web development server
npx expo start --web

# Build for web deployment
npx expo export -p web
# Output: dist/ directory with web files
```

### Android TV / Fire TV Development

#### Local Development (Recommended for debugging)
```bash
# Set TV environment
export EXPO_TV=1

# Clean and prebuild for TV
npx expo prebuild --clean

# Connect to Fire TV via ADB
adb connect [FIRE_TV_IP]:5555
adb devices

# Build and install locally
npx expo run:android
```

#### EAS Build (Recommended for testing)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS (first time only)
eas build:configure

# Build APK for Fire TV
eas build --platform android --profile production

# Install downloaded APK
adb -s [FIRE_TV_IP]:5555 install downloaded-app.apk
```

### Dependencies for Fire TV
```bash
# Required for AWS Amplify on React Native
npm install react-native-get-random-values --legacy-peer-deps
npm install @react-native-async-storage/async-storage --legacy-peer-deps

# Create .npmrc for EAS builds
echo "legacy-peer-deps=true" > .npmrc
```

### Fire TV Connection Setup
```bash
# Enable Developer Options on Fire TV:
# Settings → My Fire TV → About → Developer Options
# Turn on: ADB Debugging, Apps from Unknown Sources

# Find Fire TV IP:
# Settings → My Fire TV → About → Network

# Connect via ADB
adb connect [FIRE_TV_IP]:5555
adb devices
```

### Troubleshooting Commands

#### Check Fire TV Logs
```bash
# General app errors
adb -s [FIRE_TV_IP]:5555 logcat | grep -i "crash\|error\|exception"

# Your app specific logs
adb -s [FIRE_TV_IP]:5555 logcat | grep "MultiTVSample"

# React Native JavaScript errors
adb -s [FIRE_TV_IP]:5555 logcat | grep "ReactNativeJS"

# Clear logs and monitor live
adb -s [FIRE_TV_IP]:5555 logcat -c
adb -s [FIRE_TV_IP]:5555 logcat
```

#### Common Issues

**Missing Dependencies:**
```bash
# Error: "Requiring unknown module react-native-get-random-values"
npm install react-native-get-random-values --legacy-peer-deps

# Error: "Requiring unknown module @react-native-async-storage/async-storage"
npm install @react-native-async-storage/async-storage --legacy-peer-deps
```

**EAS Build Issues:**
```bash
# Error: "Unable to resolve module ../aws-exports"
# Solution: Comment out aws-exports.js in .gitignore
# aws-exports.js → # aws-exports.js

# Error: "ERESOLVE could not resolve"
# Solution: Add .npmrc file
echo "legacy-peer-deps=true" > .npmrc
```

**Fire TV Connection Issues:**
```bash
# Restart ADB
adb kill-server
adb start-server

# Reconnect to Fire TV
adb connect [FIRE_TV_IP]:5555

# Check device status
adb devices
```

**App Installation Issues:**
```bash
# Uninstall previous version
adb -s [FIRE_TV_IP]:5555 uninstall com.anonymous.MultiTVSample

# Install new APK
adb -s [FIRE_TV_IP]:5555 install -r your-app.apk

# Launch app manually
adb -s [FIRE_TV_IP]:5555 shell am start -n com.anonymous.MultiTVSample/.MainActivity
```

### Build Profiles

#### Development Build (for debugging)
```bash
# Requires development server running
eas build --platform android --profile development

# Start development server
npx expo start --dev-client
```

#### Production Build (standalone)
```bash
# Self-contained APK
eas build --platform android --profile production
```

## Security

- ✅ **aws-exports.js excluded** from git via .gitignore
- ✅ **Template file** with placeholder values only
- ✅ **Token-based auth** - Secure JWT passing
- ✅ **No hardcoded credentials** in source code

## Dependencies

```json
{
  "aws-amplify": "^6.15.6",
  "react-native-webview": "^13.16.0",
  "@aws-amplify/react-native": "^1.1.10",
  "react-native-get-random-values": "^1.11.0",
  "@react-native-async-storage/async-storage": "^2.2.0"
}
```

## Development vs Production

### Development
- Use `aws-exports.example.js` values → Shows config errors
- Test auth flow and UI components
- Use development builds with live reload

### Production  
- Deploy AWS infrastructure via CDK
- Update `aws-exports.js` with real values
- Test end-to-end streaming flow with production builds

## Development Environment Setup

For faster development without rebuilding APKs every time, set up a live development environment:

### Prerequisites
- Fire TV connected to same WiFi network as development machine
- ADB installed and Fire TV in developer mode

### Setup Steps

1. **Build development APK (one time only)**
   ```bash
   export EXPO_TV=1
   eas build --platform android --profile development_tv
   ```

2. **Install development APK on Fire TV**
   ```bash
   adb install path/to/development-build.apk
   ```

3. **Start development server**
   ```bash
   cd /path/to/react-native-multi-tv-app-sample
   export EXPO_TV=1
   npx expo start --dev-client --lan
   ```

4. **Set up port forwarding (if network issues)**
   ```bash
   adb connect <fire-tv-ip>
   adb reverse tcp:8081 tcp:8081
   ```

5. **Open development app on Fire TV**
   - Manually open the development app
   - It should connect to localhost:8081 (forwarded to your machine)

### Daily Development Workflow
```bash
# Start server
export EXPO_TV=1
npx expo start --dev-client --lan

# Set up port forwarding (if needed)
adb reverse tcp:8081 tcp:8081

# Make code changes → Save → Press 'r' to reload → See changes instantly!
```

### Troubleshooting
- **Connection refused**: Check firewall settings, try `--lan` mode
- **Network issues**: Use `adb reverse tcp:8081 tcp:8081` for port forwarding
- **Remote not working**: Use ADB commands to navigate development app UI
- **App not found**: Check `adb shell pm list packages | grep -i expo`

This setup eliminates the need for APK rebuilds during development, saving significant time.
