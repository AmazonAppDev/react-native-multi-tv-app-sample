const { withMainActivity } = require("expo/config-plugins");
const {
  mergeContents,
} = require("@expo/config-plugins/build/utils/generateCode");

const withAndroidMainActivityImport = (config) => {
  return withMainActivity(config, (config) => {
    const newSrc = [
      "import android.view.KeyEvent",
      "import com.github.kevinejohn.keyevent.KeyEventModule",
    ];
    const newConfig = mergeContents({
      tag: "react-native-keyevent-import",
      src: config.modResults.contents,
      newSrc: newSrc.join("\n"),
      anchor: `import`,
      offset: 1,
      comment: "//",
    });
    return {
      ...config,
      modResults: newConfig,
    };
  });
};

const withAndroidMainActivityBody = (config) => {
  return withMainActivity(config, (config) => {
    // Forward keys from dispatchKeyEvent: DPAD_CENTER/ENTER are consumed by the
    // focused view and never reach onKeyDown/onKeyUp on Android TV (#108).
    const newSrc = [
      "override fun dispatchKeyEvent(event: KeyEvent): Boolean {",
      "  when (event.action) {",
      "    KeyEvent.ACTION_DOWN -> KeyEventModule.getInstance().onKeyDownEvent(event.keyCode, event)",
      "    KeyEvent.ACTION_UP -> KeyEventModule.getInstance().onKeyUpEvent(event.keyCode, event)",
      "  }",
      "  return super.dispatchKeyEvent(event)",
      "}",
      "",
      "override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {",
      "  super.onKeyDown(keyCode, event)",
      "  return true",
      "}",
      "",
      "override fun onKeyUp(keyCode: Int, event: KeyEvent): Boolean {",
      "  super.onKeyUp(keyCode, event)",
      "  return true",
      "}",
      "",
      "override fun onKeyMultiple(keyCode: Int, repeatCount: Int, event: KeyEvent): Boolean {",
      "  KeyEventModule.getInstance().onKeyMultipleEvent(keyCode, repeatCount, event)",
      "  return super.onKeyMultiple(keyCode, repeatCount, event)",
      "}",
    ];
    const newConfig = mergeContents({
      tag: "react-native-keyevent-body",
      src: config.modResults.contents,
      newSrc: newSrc.join("\n"),
      anchor: `class MainActivity`,
      offset: 1,
      comment: "//",
    });
    return {
      ...config,
      modResults: newConfig,
    };
  });
};

function withKeyEvent(config) {
  config = withAndroidMainActivityImport(config);
  config = withAndroidMainActivityBody(config);
  return config;
}

module.exports = withKeyEvent;
