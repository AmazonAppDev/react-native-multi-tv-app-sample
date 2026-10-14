/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
const fs = require('fs');
const path = require('path');
const {transformSync} = require('@babel/core');

test('debug worklets carry the version accepted by the installed runtime', () => {
  const packageRoot = path.dirname(
    require.resolve('@amazon-devices/react-native-worklets/package.json'),
  );
  const runtimeSource = fs.readFileSync(
    path.join(packageRoot, 'src/utils/jsVersion.ts'),
    'utf8',
  );
  const runtimeVersion = runtimeSource.match(/jsVersion = '([^']+)'/)[1];
  const {code} = transformSync(
    'function example() { "worklet"; return 42; }',
    {
      filename: __filename,
      babelrc: false,
      configFile: false,
      plugins: [require.resolve('@amazon-devices/react-native-worklets/plugin')],
    },
  );
  // This metadata is checked when debug mode first initializes Worklets.
  expect(code).toContain(`__pluginVersion = "${runtimeVersion}"`);
});
