# GameLift Streams Integration for React Native Multi-TV App

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: September 26, 2025

## Overview

This document describes the complete integration of Amazon GameLift Streams into the React Native Multi-TV App using a **content-first approach with integrated authentication**. The implementation provides cloud gaming capabilities across Android TV, Fire TV, tvOS, and web platforms following standard TV app UX patterns.

## Architecture

### Content-First TV Approach
- **Browse without barriers** - Home, Explore, TV sections accessible without login
- **Games section integration** - GameLift Streams directly integrated into Games section
- **Authentication on demand** - Login only required when accessing Games
- **Hybrid communication** - WebView for TV platforms, iframe for web with message passing

### File Structure
```
modules/gamelift-streams/
├── index.ts                      # Plugin registration (no menu items)
├── components/GameLiftWebView.tsx # WebView/iframe with auth integration & login prompt
├── config/aws-config.ts         # Legacy config (not used)
└── config/plugin-config.json    # Git-safe placeholders

assets/gamelift-web/
├── index.html                   # GameLift web app with clean TV-optimized UI
├── gameliftstreams-1.0.0.js     # GameLift Streams SDK
├── gameliftstreams-1.0.0.d.ts   # TypeScript definitions
└── LICENSE.txt                  # SDK license

context/
└── AuthContext.tsx              # React Native authentication context

app/
├── login.tsx                    # TV-optimized login screen with error handling
├── (drawer)/games.tsx           # Games section with direct GameLift integration
└── _layout.tsx                  # Amplify configuration with aws-exports.js

aws-exports.js                   # AWS configuration (excluded from git)
aws-exports.example.js           # Template with placeholder values
```

## Configuration

### AWS Configuration File

**Create `aws-exports.js`** (copy from `aws-exports.example.js`):

```javascript
// aws-exports.js
const awsconfig = {
  aws_project_region: 'us-west-2',
  aws_cognito_region: 'us-west-2',
  aws_user_pools_id: 'us-west-2_YourActualPoolId',
  aws_user_pools_web_client_id: 'YourActualClientId',
  aws_cognito_identity_pool_id: null,
  API: {
    endpoints: [
      {
        name: 'gamelift-api',
        endpoint: 'https://YourActualEndpoint.execute-api.us-west-2.amazonaws.com/prod',
      },
    ],
    REST: {
      'gamelift-api': {
        endpoint: 'https://YourActualEndpoint.execute-api.us-west-2.amazonaws.com/prod',
      },
    },
  },
};

export default awsconfig;
```

### Configuration Flow

1. **React Native** loads `aws-exports.js` and configures AWS Amplify at startup
2. **Content browsing** - Users can explore Home, Explore, TV without authentication
3. **Games access** - When user clicks Games, GameLiftWebView checks authentication
4. **Platform-specific communication**:
   - **TV platforms**: WebView with `postMessage` API
   - **Web platform**: iframe with `window.parent.postMessage`
5. **Token passing** - React Native sends JWT tokens and API config to GameLift web app

## User Flow

### Standard TV App Experience
1. **App Launch** → Immediate access to content (Home, Explore, TV)
2. **Browse Content** → Users explore app without authentication barriers
3. **Click Games** → 
   - **If authenticated**: Direct access to GameLift streaming interface
   - **If not authenticated**: Automatic redirect to login screen (standard TV pattern)
4. **Authentication** → TV-optimized login screen with spatial navigation and error handling
5. **Games Access** → Full GameLift streaming capabilities after authentication

### GameLift Streaming Flow
1. **Games Section** → Shows GameLift streaming interface (clean UI without technical controls)
2. **Configuration** → React Native passes AWS config and auth token to web app
3. **Game Selection** → User enters Stream Group ID and Application ID
4. **Region Selection** → User selects deployment region
5. **Stream Session** → GameLift creates session using token-authenticated API calls
6. **Video Streaming** → Full-screen game streaming with input handling

## Authentication Architecture

### React Native Side
- **AuthContext** provides app-wide authentication state with token management
- **Login Screen** with TV-optimized UI, spatial navigation, and proper error display
- **Token Management** - Automatic token refresh and validation
- **No auth barriers** - Content accessible without login
- **Email display** - Shows user email in drawer instead of username

### WebView/Iframe Side
- **Direct redirect** - Automatically redirects to login when not authenticated
- **Token-based API** - Uses `fetch()` with `Authorization: Bearer ${token}`
- **No Amplify dependency** - Simplified, reliable implementation
- **Platform communication** - Handles both WebView and iframe message passing
- **Clean UI** - Removed technical controls (reconnect, session IDs, sign out button)

### Games Section Integration
```typescript
// Games section with proper menu navigation
export default function GamesScreen() {
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;
  const navigation = useNavigation();

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === 'left' && focusedIndex === 0) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, focusedIndex, navigation],
  );

  return (
    <SpatialNavigationRoot isActive={isActive} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <View style={styles.container}>
        <GameLiftWebView onError={handleError} />
      </View>
    </SpatialNavigationRoot>
  );
}
```

## Platform Support

### TV Platforms
- ✅ **Android TV** - Native auth + WebView streaming with postMessage
- ✅ **Fire TV** - Full compatibility with spatial navigation
- ✅ **tvOS** - Apple TV optimized login and streaming
- ✅ **Web** - Browser-based with iframe and window.parent.postMessage

### Features per Platform
- ✅ **Content-first browsing** - Immediate access to Home, Explore, TV
- ✅ **On-demand authentication** - Login only when accessing Games
- ✅ **Token Security** - Secure JWT token passing between React Native and WebView/iframe
- ✅ **Video Streaming** - HTML5 video with WebRTC
- ✅ **Input Handling** - Game controls via GameLift SDK
- ✅ **Fullscreen Support** - Native fullscreen video capabilities

## API Integration

### Authentication Flow
```typescript
// React Native obtains token when needed
const session = await fetchAuthSession();
const token = session.tokens?.idToken?.toString();

// For WebView (TV platforms)
webViewRef.current?.postMessage(JSON.stringify({
  type: 'auth-token',
  token: token
}));

// For iframe (web platform)
iframe.contentWindow.postMessage(JSON.stringify({
  type: 'auth-token',
  token: token
}), '*');
```

### WebView/Iframe API Calls
```javascript
// Direct API calls with token in GameLift web app
const response = await fetch(apiConfig.endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  },
  body: JSON.stringify(payload)
});
```

### Endpoints Used
- `POST /` - Start stream session
- `GET /session/{sg}/{arn}` - Get stream session status

## Dependencies

### React Native Dependencies
```json
{
  "aws-amplify": "^6.15.6",
  "react-native-webview": "^13.16.0",
  "@aws-amplify/react-native": "^1.1.10"
}
```

### WebView Dependencies (Local)
```html
<!-- No external CDN dependencies -->
<script src="./gameliftstreams-1.0.0.js"></script>
```

## Deployment

### Prerequisites

1. **AWS Infrastructure** - Deploy using reference CDK application:
   ```bash
   # From sample-amazon-gamelift-streams-react-app repository
   cdk deploy AmazonGameliftStreamsReactStarterAPIStack
   ```

2. **Cognito Users** - Create test users in Cognito User Pool

3. **GameLift Applications** - Set up applications and stream groups

### Setup Steps

1. **Copy Configuration Template**
   ```bash
   cp aws-exports.example.js aws-exports.js
   ```

2. **Update with Real Values**
   ```javascript
   // Edit aws-exports.js with values from AWS CDK deployment outputs
   aws_user_pools_id: 'us-west-2_YourActualPoolId',
   aws_user_pools_web_client_id: 'YourActualClientId',
   endpoint: 'https://YourActualEndpoint.execute-api.us-west-2.amazonaws.com/prod',
   ```

3. **Build and Deploy TV App**
   ```bash
   npm run prebuild
   npm run android  # or ios, web
   ```

## Testing

### Development Testing
1. **Content Browsing** - Verify Home, Explore, TV work without login
2. **Games Authentication** - Test login prompt appears when clicking Games
3. **Login Flow** - Test authentication with proper error display in UI
4. **WebView/Iframe Loading** - Verify GameLift web app loads correctly after auth
5. **Token Passing** - Test React Native ↔ WebView/iframe communication

### Production Testing
1. **Deploy AWS Infrastructure** - Use reference CDK application
2. **Configure Real Credentials** - Update `aws-exports.js` with actual values
3. **End-to-End Testing** - Full browse → games → login → streaming flow
4. **Platform Testing** - Verify on Android TV, Fire TV, tvOS, and web
5. **Token Validation** - Test token refresh and expiration handling

## Troubleshooting

### Configuration Issues
- **"Configuration not received"** → Check `aws-exports.js` exists with correct values
- **"PLACEHOLDER_API_ENDPOINT" errors** → Verify iframe/WebView communication is working
- **WebView shows error** → Check token passing and API configuration

### Authentication Issues
- **Direct redirect not working** → Check GameLiftWebView useEffect and router.push('/login')
- **Login errors not displayed** → Verify error state handling in login screen
- **Token not received** → Check AuthContext token management and fetchUserAttributes
- **Menu navigation not working in Games** → Verify onDirectionHandledWithoutMovement handler

### Streaming Issues
- **HTTP 404 errors** → Check API endpoint configuration in aws-exports.js
- **Session timeout** → Check GameLift application and stream group configuration
- **API authentication errors** → Verify token is valid and not expired
- **No video** → Verify WebRTC support and network connectivity

## Security

- ✅ **AWS Configuration File** - `aws-exports.js` excluded from git via `.gitignore`
- ✅ **Template File** - `aws-exports.example.js` with placeholder values for repository
- ✅ **Token-based Auth** - Secure JWT token passing
- ✅ **No Hardcoded Credentials** - Only placeholder values in git
- ✅ **Native Auth Flow** - Amplify handles authentication securely
- ✅ **Minimal WebView Exposure** - No sensitive auth logic in WebView/iframe
- ✅ **Content-first Security** - No auth barriers for browsing content

## Architecture Benefits

### Advantages
- ✅ **Standard TV UX** - Content first, authentication on demand (Netflix/Prime pattern)
- ✅ **Lower Friction** - Users see value before authentication barriers
- ✅ **Reliable Authentication** - Native React Native Amplify integration
- ✅ **Platform Flexibility** - WebView for TV, iframe for web with unified communication
- ✅ **TV-Optimized UI** - Beautiful native login with spatial navigation and error handling
- ✅ **Clean Integration** - Games section directly includes GameLift (no separate menu)
- ✅ **Token Security** - Secure communication between React Native and web app
- ✅ **Maintainable** - Clear separation between content, auth, and streaming

### Considerations
- **WebView Performance** - Dependent on platform WebView capabilities
- **Token Management** - Requires proper token refresh handling
- **Platform Differences** - Minor WebView vs iframe behavior variations
- **Configuration Management** - Manual aws-exports.js file management required

## Content-First Philosophy

This implementation follows the **standard TV app pattern**:

1. **Immediate Value** - Users see content without barriers
2. **Progressive Authentication** - Login only when accessing premium features
3. **Seamless Experience** - Authentication integrated into content flow
4. **TV-Optimized** - Remote control navigation throughout

This approach maximizes user engagement and follows industry best practices for TV applications.

## TODO / Known Issues

### Security & Configuration
- **✅ COMPLETED**: Add `aws-exports.js` to `.gitignore` to prevent committing AWS credentials
- **✅ COMPLETED**: Create `aws-exports.example.js` template with placeholder values for git
- **🟡 IMPROVEMENT**: Add configuration validation on app startup
- **🟡 IMPROVEMENT**: Consider using AWS Systems Manager Parameter Store for production deployments

### Development Experience  
- **🟢 ENHANCEMENT**: Add development configuration validation
- **🟢 ENHANCEMENT**: Improve error messages for configuration issues
- **🟢 ENHANCEMENT**: Add configuration setup wizard for new developers
- **🟢 ENHANCEMENT**: Add automated aws-exports.js generation from CDK outputs

### UI/UX Improvements
- **✅ COMPLETED**: Remove technical UI elements (reconnect, session IDs, sign out button)
- **✅ COMPLETED**: Implement direct login redirect (standard TV pattern)
- **✅ COMPLETED**: Add proper menu navigation to Games section
- **✅ COMPLETED**: Clean up debug console logs
- **🟢 ENHANCEMENT**: Add automatic reconnection for network interruptions
- **🟢 ENHANCEMENT**: Improve streaming interface responsiveness
