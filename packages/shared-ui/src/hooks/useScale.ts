// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Dimensions } from 'react-native';

// The UI is designed for a 1920x1080 screen. Scale by the tighter of width and
// height so the 16:9 layout always fits. On 16:9 TVs this is the same as before;
// on screens or windows that are not 16:9 (web, emulators, some TVs reporting
// a different window size), scaling by the diagonal made layouts overflow.
const designResolution = {
  width: 1920,
  height: 1080,
};

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / designResolution.width, height / designResolution.height);

export const scaledPixels = (size: number): number => size * scale;
