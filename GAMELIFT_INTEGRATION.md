# GameLift Streams Integration

**Status**: Production Ready ✅

## Overview

GameLift Streams integration for React Native Multi-TV App with **content-first authentication**. Users can browse content without login - authentication only required for Games section.

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

## Troubleshooting

### Configuration
- **"Configuration not received"** → Check `aws-exports.js` exists
- **HTTP 404 errors** → Verify API endpoint in aws-exports.js

### Authentication  
- **Direct redirect not working** → Check GameLiftWebView useEffect
- **Login errors** → Verify error handling in login screen
- **Menu navigation** → Check onDirectionHandledWithoutMovement

### Streaming
- **Session timeout** → Check GameLift app/stream group config
- **No video** → Verify WebRTC support and network

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
  "@aws-amplify/react-native": "^1.1.10"
}
```

## Development vs Production

### Development
- Use `aws-exports.example.js` values → Shows config errors
- Test auth flow and UI components

### Production  
- Deploy AWS infrastructure via CDK
- Update `aws-exports.js` with real values
- Test end-to-end streaming flow
