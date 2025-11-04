# React Native Multi-TV App Sample

[![React Native](https://img.shields.io/badge/React%20Native-v0.74.2-blue.svg)](https://reactnative.dev/)
[![License: MIT-0](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/AmazonAppDev/react-native-multi-tv-app-sample/blob/main/LICENSE)

A production-ready TV application template built with React Native, supporting Android TV, Apple TV, Fire TV (with Fire OS), Fire TV (with Vega OS) and Web TV platforms. This monorepo showcases best practices for building cross-platform TV applications with shared UI components, efficient focus management, and platform-specific optimizations.

![Demo GIF](https://github.com/AmazonAppDev/react-native-multi-tv-app-sample/blob/main/tvdemo.gif)

## Table of Contents

- [Features](#features)
- [Platform Support](#platform-support)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Building and Running](#building-and-running)
- [Development](#development)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality

- **Multi-Platform Support**: Single codebase running on Android TV, Apple TV, Fire TV FOS, Fire TV Vega OS and Web
- **Video Playback**: Integrated video player with [react-native-video](https://github.com/TheWidlarzGroup/react-native-video)
- **Spatial Navigation**: TV-optimized focus management with [React TV Space Navigation](https://github.com/bamlab/react-tv-space-navigation)
- **Remote Control Support**: Native remote control integration for all TV platforms

### UI Components

- **Drawer Navigation**: Customizable left-side drawer with menu items
- **Grid Layouts**: Responsive content grids optimized for TV screens
- **Dynamic Hero Banner**: Header image that updates based on focused content
- **Detail Screens**: Rich content detail pages with metadata and actions

### Architecture

- **Monorepo Structure**: Yarn workspaces with apps and shared packages
- **Shared UI Library**: Reusable components across all platforms
- **Platform-Specific Code**: Automatic resolution of `.android.ts`, `.ios.ts`, `.kepler.ts` files
- **Type Safety**: Full TypeScript support with shared configurations

### App Variants

**expo-multi-tv**

- Universal application built with Expo and react-native-tvos
- Supports Android TV, Apple TV, Fire TV Fire OS, and Web
- Uses React Navigation for screen management
- Cross-platform focus management

**vega**

- Fire TV with Vega OS optimized build using Amazon Vega SDK
- Optimized performance for Fire TV devices
- Native remote control support via TVEventHandler

Both apps share components from the `@multi-tv/shared-ui` package.

## Architecture

This project uses a monorepo structure with Yarn workspaces to manage multiple packages and applications.

```
react-native-multi-tv-app-sample/
├── apps/
│   ├── expo-multi-tv/       # Universal TV app (Android TV, Apple TV, Fire TV FOS, Web)
│   └── vega/                # Fire TV Vega optimized app (Vega SDK)
├── packages/
│   └── shared-ui/           # Shared components, screens, and navigation
├── package.json             # Workspace configuration
└── tsconfig.base.json       # Shared TypeScript configuration
```

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│       React Native Multi-TV Monorepo                    │
├──────────────────────────┬──────────────────────────────┤
│ Apps                     │ Packages                     │
├──────────────────────────┼──────────────────────────────┤
│ expo-multi-tv            │ shared-ui                    │
│   ├─ Expo SDK 51         │   ├─ Components              │
│   ├─ React Navigation    │   ├─ Screens                 │
│   ├─ react-native-tvos   │   ├─ Navigation              │
│   └─ Platforms:          │   ├─ Hooks                   │
│       • Android TV       │   ├─ Theme                   │
│       • Apple TV         │   └─ Remote Control          │
│       • Fire TV          │       ├─ .android.ts         │
│       • Web              │       ├─ .ios.ts             │
│                          │       └─ .kepler.ts          │
│ vega                     │                              │
│   ├─ Vega SDK            │                              │
│   ├─ @amazon-devices/*   │                              │
│   └─ Platform: Vega OS   │                              │
└──────────────────────────┴──────────────────────────────┘
```

The `@multi-tv/shared-ui` package contains all reusable UI components, screens, and navigation logic. Platform-specific implementations use file extensions (`.android.ts`, `.ios.ts`, `.kepler.ts`) that Metro bundler automatically resolves at build time.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **Yarn**: v4.5.0 (configured via packageManager field)
- **Platform-specific tools**:
  - **Android TV**: Android Studio with Android SDK
  - **Apple TV**: Xcode (macOS required) with tvOS SDK
  - **Fire TV**: [Amazon Vega SDK](https://developer.amazon.com/docs/vega/0.21/install-vega-sdk.html)
  - **Web**: Modern web browser

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/AmazonAppDev/react-native-multi-tv-app-sample.git
cd react-native-multi-tv-app-sample

# Install all dependencies
yarn install

# Build shared packages
yarn build:all
```

Alternatively, use the bootstrap command:

```bash
yarn bootstrap
```

This will install dependencies and build all packages in one step.

## Building and Running

### Quick Start

Run the universal app on different platforms:

```bash
# Android TV and Fire TV FOS
yarn dev:android

# Apple TV
yarn dev:ios

# Web
yarn dev:web

# Fire TV (Vega OS)
yarn dev:vega
```

### Platform-Specific Instructions

#### Android TV

1. Start Metro bundler:

   ```bash
   yarn dev
   ```

2. In a new terminal, run on Android TV:
   ```bash
   yarn dev:android
   ```

Or directly from the app directory:

```bash
cd apps/expo-multi-tv
yarn android
```

#### Apple TV

1. Start Metro bundler:

   ```bash
   yarn dev
   ```

2. In a new terminal, run on Apple TV:
   ```bash
   yarn dev:ios
   ```

Or directly from the app directory:

```bash
cd apps/expo-multi-tv
yarn ios
```

#### Web

```bash
yarn dev:web
```

Or directly from the app directory:

```bash
cd apps/expo-multi-tv
yarn web
```

#### Fire TV (Vega)

For the Fire TV optimized build:

```bash
# Development build
yarn dev:vega

# Production build
yarn build:vega

# Debug build
yarn build:vega:debug
```

Or directly from the app directory:

```bash
cd apps/vega
yarn build
```

### Available Commands

#### Workspace Commands

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `yarn dev`         | Start expo-multi-tv Metro bundler |
| `yarn dev:android` | Run on Android TV                 |
| `yarn dev:ios`     | Run on Apple TV                   |
| `yarn dev:web`     | Run on Web                        |
| `yarn dev:vega`    | Build and run Fire TV app         |
| `yarn build:all`   | Build all packages                |
| `yarn build:vega`  | Build vega for Fire TV            |
| `yarn test:all`    | Run all tests                     |
| `yarn lint:all`    | Lint all packages                 |
| `yarn typecheck`   | Type check all packages           |
| `yarn format`      | Format code with Prettier         |
| `yarn clean:all`   | Clean all node_modules            |

#### App-Specific Commands

Navigate to the app directory first:

```bash
# expo-multi-tv
cd apps/expo-multi-tv
yarn start      # Start Metro bundler
yarn android    # Run on Android TV
yarn ios        # Run on Apple TV
yarn web        # Run on Web
yarn test       # Run tests
yarn lint       # Lint code

# vega
cd apps/vega
yarn start      # Start Metro bundler
yarn build      # Build for Fire TV
yarn test       # Run tests
yarn lint       # Lint code
```

## Development

### Project Structure

The monorepo contains the following packages:

#### `@multi-tv/expo-multi-tv`

Universal TV application built with Expo, supporting Android TV, Apple TV, Fire TV, and Web.

**Key Technologies:**

- Expo SDK 51
- React Navigation 6
- react-native-tvos
- React TV Space Navigation

#### `@multi-tv/vega`

Fire TV optimized application using Amazon's Vega SDK.

**Key Technologies:**

- Amazon Vega SDK
- @amazon-devices packages
- Native Fire TV remote integration
- Custom navigation optimizations

#### `@multi-tv/shared-ui`

Shared component library used by both applications.

**Exports:**

- **Components**: `FocusablePressable`, `CustomDrawerContent`, `MenuContext`
- **Screens**: `HomeScreen`, `DetailsScreen`, `PlayerScreen`, `ExploreScreen`, `TVScreen`
- **Navigation**: `DrawerNavigator`, `RootNavigator`, `AppNavigator`
- **Hooks**: `scaledPixels`, `useMenuContext`
- **Theme**: Centralized theming configuration
- **Remote Control**: Platform-specific remote control managers

### Adding New Features

1. Develop shared components in `packages/shared-ui/src/`
2. Add platform-specific implementations using file extensions:
   - `.android.ts` for Android TV
   - `.ios.ts` for Apple TV
   - `.kepler.ts` for Fire TV
3. Export from `packages/shared-ui/src/index.ts`
4. Import in apps via `@multi-tv/shared-ui`

Example:

```typescript
// packages/shared-ui/src/components/MyComponent.tsx
export const MyComponent = () => {
  /* ... */
};

// packages/shared-ui/src/index.ts
export { MyComponent } from './components/MyComponent';

// apps/expo-multi-tv/App.tsx
import { MyComponent } from '@multi-tv/shared-ui';
```

### Remote Control Implementation

The project includes platform-specific remote control managers:

| Platform               | Implementation                    | Technology            |
| ---------------------- | --------------------------------- | --------------------- |
| Android TV/Fire TV FOS | `RemoteControlManager.android.ts` | react-native-keyevent |
| Apple TV               | `RemoteControlManager.ios.ts`     | Native tvOS events    |
| Fire TV Vega OS        | `RemoteControlManager.kepler.ts`  | Kepler TVEventHandler |

All managers implement `RemoteControlManagerInterface` and integrate with `react-tv-space-navigation`.

### Testing

```bash
# Run all tests
yarn test:all

# Test specific package
yarn workspace @multi-tv/shared-ui test
yarn workspace @multi-tv/expo-multi-tv test
yarn workspace @multi-tv/vega test
```

### Code Quality

```bash
# Lint all code
yarn lint:all

# Type check
yarn typecheck

# Format code
yarn format
```

## Technologies

This project is built with modern React Native and TV development tools:

| Technology                | Version | Purpose                    |
| ------------------------- | ------- | -------------------------- |
| React Native              | v0.74   | Core framework (tvOS fork) |
| Expo                      | SDK 51  | Development platform       |
| TypeScript                | v5.3    | Type safety                |
| Yarn Workspaces           | v4.5    | Monorepo management        |
| React Navigation          | v6      | Screen navigation          |
| react-tv-space-navigation | v3.6    | TV focus management        |
| react-native-video        | Latest  | Video playback             |
| Amazon Vega SDK           | Latest  | Fire TV Vega OS            |

## Contributing

Contributions are welcome! This project is an open-source sample designed to help developers build TV applications.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`yarn test:all && yarn lint:all`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use conventional commit messages

## License

This project is licensed under the MIT-0 License - see the [LICENSE](./LICENSE) file for details.

## Resources

- [React Native TV OS](https://github.com/react-native-tvos/react-native-tvos) - TV platform support
- [React TV Space Navigation](https://github.com/bamlab/react-tv-space-navigation) - Spatial navigation library
- [Amazon Kepler Developer Portal](https://developer.amazon.com/vega) - Fire TV development resources
- [Expo Documentation](https://expo.dev) - Expo SDK documentation

## Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

Made for TV app developers
