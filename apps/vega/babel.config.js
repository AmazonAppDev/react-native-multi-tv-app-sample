/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Worklets plugin must be listed last for Reanimated 4
    '@amazon-devices/react-native-worklets/plugin',
  ],
};
