/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

import 'react-native';
import {fireEvent, render} from '@testing-library/react-native';
import * as React from 'react';

import {App} from '../src/App';

describe('Template App Snapshot tests', () => {
  it('Initial App screen', () => {
    const screen = render(<App />);
    expect(screen).toMatchSnapshot();
  });

  it('App screen after link press', () => {
    const screen = render(<App />);
    const button = screen.getByTestId('sampleLink');
    fireEvent.press(button);
    expect(screen).toMatchSnapshot();
  });
});
