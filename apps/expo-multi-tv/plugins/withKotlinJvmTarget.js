const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

function withKotlinJvmTarget(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const buildGradlePath = path.join(
        config.modRequest.platformProjectRoot,
        "react-settings-plugin",
        "build.gradle.kts"
      );

      if (fs.existsSync(buildGradlePath)) {
        let contents = fs.readFileSync(buildGradlePath, "utf-8");

        if (!contents.includes("sourceCompatibility")) {
          const jvmConfig = `
java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = "17"
    }
}
`;
          contents = contents.replace(
            /repositories\s*\{\s*mavenCentral\(\)\s*\}/,
            (match) => match + "\n" + jvmConfig
          );
          fs.writeFileSync(buildGradlePath, contents);
        }
      }

      return config;
    },
  ]);
}

module.exports = withKotlinJvmTarget;
