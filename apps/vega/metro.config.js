// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration for Vega workspace
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    path.resolve(__dirname, '../../packages/shared-ui'),
  ],
  resolver: {
    unstable_enableSymlinks: true,
    sourceExts: ['vega.tsx', 'vega.ts', 'vega.js', 'tsx', 'ts', 'jsx', 'js', 'json'],
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
    ],
    extraNodeModules: (function() {
      const modules = {
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-native': path.resolve(__dirname, 'node_modules/react-native'),
        '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
      };

      // Map navigation packages to Amazon Devices ports for Vega
      const navigationMappings = {
        '@react-navigation/native': '@amazon-devices/react-navigation__native',
        '@react-navigation/native-stack': '@amazon-devices/react-navigation__native-stack',
        '@react-navigation/drawer': '@amazon-devices/react-navigation__drawer',
        '@react-navigation/core': '@amazon-devices/react-navigation__core',
        '@react-navigation/routers': '@amazon-devices/react-navigation__routers',
        '@react-navigation/elements': '@amazon-devices/react-navigation__elements',
      };

      // Map system libs to Amazon Devices versions
      const systemMappings = {
        'react-native-gesture-handler': '@amazon-devices/react-native-gesture-handler',
        'react-native-reanimated': '@amazon-devices/react-native-reanimated',
        'react-native-safe-area-context': '@amazon-devices/react-native-safe-area-context',
        'react-native-screens': '@amazon-devices/react-native-screens',
      };

      // Apply mappings - ensure we're resolving to vega's node_modules
      Object.keys(navigationMappings).forEach(key => {
        const target = path.resolve(__dirname, 'node_modules', navigationMappings[key]);
        modules[key] = target;
      });

      Object.keys(systemMappings).forEach(key => {
        const target = path.resolve(__dirname, 'node_modules', systemMappings[key]);
        modules[key] = target;
      });

      return modules;
    })(),
    resolverMainFields: ['react-native', 'browser', 'main'],
    platforms: ['native', 'ios', 'android', 'tv'],
    blockList: [
      // Block standard react-navigation packages from parent node_modules
      new RegExp(
        path.resolve(__dirname, '..', 'node_modules', '@react-navigation').replace(/[/\\]/g, '[/\\\\]')
      ),
      // Block standard gesture handler from parent node_modules
      new RegExp(
        path.resolve(__dirname, '..', 'node_modules', 'react-native-gesture-handler').replace(/[/\\]/g, '[/\\\\]')
      ),
      // Block standard reanimated from parent node_modules
      new RegExp(
        path.resolve(__dirname, '..', 'node_modules', 'react-native-reanimated').replace(/[/\\]/g, '[/\\\\]')
      ),
      // Block standard screens from parent node_modules
      new RegExp(
        path.resolve(__dirname, '..', 'node_modules', 'react-native-screens').replace(/[/\\]/g, '[/\\\\]')
      ),
      // Block standard safe-area-context from parent node_modules
      new RegExp(
        path.resolve(__dirname, '..', 'node_modules', 'react-native-safe-area-context').replace(/[/\\]/g, '[/\\\\]')
      ),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
