/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

// Import the real dependency: v5 bundles React 18's JSX runtime and throws while
// loading under React 19, before the application's first screen can render.
import {SpatialNavigation} from 'react-tv-space-navigation';

describe('React 19 dependency compatibility', () => {
  it('loads spatial navigation with the Vega React runtime', () => {
    expect(SpatialNavigation.configureRemoteControl).toBeInstanceOf(Function);
  });
});
