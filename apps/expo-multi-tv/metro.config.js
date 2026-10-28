// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

/**
 * Every workspace package under /packages is watched and resolvable by its
 * package name, so adding packages/<new-package> needs no Metro changes.
 */
const packagesRoot = path.resolve(__dirname, '../../packages');
const workspacePackages = fs
  .readdirSync(packagesRoot)
  .map((dir) => path.join(packagesRoot, dir))
  .filter((dir) => fs.existsSync(path.join(dir, 'package.json')))
  .map((dir) => {
    const { name } = require(path.join(dir, 'package.json'));
    if (!name) {
      throw new Error(`Workspace package at ${dir} has no "name" in its package.json`);
    }
    return { dir, name };
  });

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname); // eslint-disable-line no-undef

// Configure Metro to work with Yarn workspaces
config.watchFolders = [...workspacePackages.map((pkg) => pkg.dir), path.resolve(__dirname, '../..')];

config.resolver = {
  ...config.resolver,
  unstable_enableSymlinks: true,
  nodeModulesPaths: [
    path.resolve(__dirname, 'node_modules'),
    path.resolve(__dirname, '../../node_modules'),
  ],
  extraNodeModules: Object.fromEntries(workspacePackages.map((pkg) => [pkg.name, pkg.dir])),
};

// When enabled, the optional code below will allow Metro to resolve
// and bundle source files with TV-specific extensions
// (e.g., *.ios.tv.tsx, *.android.tv.tsx, *.tv.tsx)
//
// Metro will still resolve source files with standard extensions
// as usual if TV-specific files are not found for a module.
//
if (process.env?.EXPO_TV === '1') {
  const originalSourceExts = config.resolver.sourceExts;
  const tvSourceExts = [
    ...originalSourceExts.map((e) => `tv.${e}`),
    ...originalSourceExts,
  ];
  config.resolver.sourceExts = tvSourceExts;
}

module.exports = config;
