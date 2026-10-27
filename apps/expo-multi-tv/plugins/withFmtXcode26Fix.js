const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const MARKER = "Xcode 26.4 fmt consteval workaround";

function withFmtXcode26Fix(config) {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      let podfile = fs.readFileSync(podfilePath, "utf8");

      if (podfile.includes(MARKER)) {
        return config;
      }

      // fmt 11.0.2 (bundled with RN 0.81) fails to compile with Xcode 26.4+
      // because of consteval. Its headers are also built by React/Folly pods
      // in C++20, so patch base.h to disable consteval for every consumer.
      // See facebook/react-native#55601. Remove once RN ships fmt >= 12.
      const fmtFix = `
    # ${MARKER} (facebook/react-native#55601)
    fmt_base = File.join(installer.sandbox.root, 'fmt', 'include', 'fmt', 'base.h')
    if File.exist?(fmt_base)
      content = File.read(fmt_base)
      patched = content.gsub(/^#  define FMT_USE_CONSTEVAL 1$/, '#  define FMT_USE_CONSTEVAL 0')
      if patched != content
        File.chmod(0644, fmt_base)
        File.write(fmt_base, patched)
      end
    end`;

      podfile = podfile.replace(
        /post_install do \|installer\|/,
        `post_install do |installer|${fmtFix}`
      );

      fs.writeFileSync(podfilePath, podfile, "utf8");
      return config;
    },
  ]);
}

module.exports = withFmtXcode26Fix;
