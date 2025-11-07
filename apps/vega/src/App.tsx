// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import VegaAppNavigator from './navigation/VegaAppNavigator';
import '../../../packages/shared-ui/src/app/configureRemoteControl';

export const App = () => {
  return <VegaAppNavigator fontsLoaded={true} />;
};
 