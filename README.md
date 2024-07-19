# 📺🚀 React Native Multi-TV App Sample

[![React Native](https://img.shields.io/badge/React%20Native-v0.74.2-blue.svg)](https://reactnative.dev/)

[![License: MIT-0](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/AmazonAppDev/react-native-multi-tv-app-sample/blob/main/LICENSE)

A versatile TV app developed in React Native, compatible with Android TV, Fire TV, tvOS, and Web. This sample project showcases best practices for TV app UI design and implementation.

![Demo GIF](https://github.com/AmazonAppDev/react-native-multi-tv-app-sample/blob/main/tvdemo.gif)

## 🌟 Features

- 📱 Multi-platform support: Android TV, Fire TV, tvOS, and web
- 🎨 Customizable left-side drawer navigation (using Expo Drawer)
- 🖼️ Grid layout for content selection
- 🦸‍♂️ Dynamic hero image header that follows the focused card
- 🎬 Detailed content screen
- 🎥 Video player screen
- 🎯 Efficient focus management with [React TV Space Navigation](https://github.com/bamlab/react-tv-space-navigation)
- 🔧 Fully customizable screens and components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [JDK 17](https://developer.android.com/build/jdks)

## 🚀 Quick Start

1. Clone the repository:

   ```
   git clone https://github.com/amazonappdev/react-native-multi-tv-app-sample.git
   ```

2. Navigate to the project directory:

   ```
   cd react-native-multi-tv-app-sample
   ```

3. Install dependencies:

   ```
   npm i
   ```

## Note

To build the TV version of the project set isTV to be true in your [app.json](./app.json).

```
 "isTV": true
```

## 📱 Running on Different Platforms

### Android TV / Fire TV

- Ensure you have an Android TV emulator set up or a physical device connected.
- Run `npx expo run:android --device <Your Device or Emulator>` to build and install the app.

### tvOS

- Make sure you have Xcode installed with tvOS Simulator.
- Run `expo run:ios` to build and install the app on the tvOS Simulator.

### Web

- Run `expo start:web` to start the app in your default web browser.

## 🛠️ Customization

- **Drawer Navigation**: Modify `./components/CustomDrawerContent.tsx` to customize the left-side menu.
- **Content Grid**: Adjust `./app/(drawer)/index.tsx` to change the layout or style of the content cards.
- **Detail Screen**: Customize `./app/details.tsx` for different content details display options.
- **Video Player**: Enhance `./app/player.tsx` to customize the Video Player Screen

Stay Tuned for more!

## 📚 Key Frameworks and Libraries Used

- [Expo](https://expo.dev/)
- [Expo Drawer](https://docs.expo.dev/router/advanced/drawer/)
- [React TV Space Navigation](https://github.com/bamlab/react-tv-space-navigation) for Focus Management, Remote control mapping and content lists.

## Get support

If you found a bug or want to suggest a new [feature/use case/sample], please [file an issue](../../issues).

If you have questions, comments, or need help with code, we're here to help:

- Join the [Amazon Developer community](https://community.amazondeveloper.com/c/amazon-appstore/17)
- on Twitter at [@AmazonAppDev](https://twitter.com/AmazonAppDev)
- on Stack Overflow at the [amazon-appstore](https://stackoverflow.com/questions/tagged/amazon-appstore) tag

Sign up to [stay updated with the developer newsletter](https://m.amazonappservices.com/subscribe-newsletter).

## Authors

- [@efahsl](https://github.com/efahsl)
- [@giolaq](https://github.com/giolaq)

## 📄 License

This project is licensed under the [MIT-0 License](LICENSE).

Happy coding! 🎉 We hope this sample helps you create amazing TV experiences across multiple platforms!
