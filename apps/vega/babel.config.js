/*
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Reanimated plugin must be listed last
    '@amazon-devices/react-native-reanimated/plugin',
  ],
};
