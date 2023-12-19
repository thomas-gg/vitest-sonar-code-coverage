import { CoverageV8Options, CustomProviderOptions, InlineConfig } from "vitest";
import { defineConfig, configDefaults } from "vitest/config";
import { UserConfig as UserConfig$1 } from "vite";

// All options should be available from V8
type SonarCoverageOptions = CustomProviderOptions & CoverageV8Options;
interface InlineConfigSonar extends InlineConfig {
  coverage: SonarCoverageOptions;
}
interface UserConfig$2 extends UserConfig$1 {
  test: InlineConfigSonar;
}
export default defineConfig({
  test: {
    include: ["**/*.{test,spec}.{js,ts}"],
    coverage: {
      exclude: [...configDefaults.exclude],
      reporter: ["json", "json-summary", "cobertura"],
      // provider: 'v8',
      provider: "custom",
      customProviderModule: "../src/SonarCodeCoverageProviderModule.ts",
    },
    reporters: ["default", "vitest-sonar-reporter"],
    outputFile: {
      "vitest-sonar-reporter": "coverage/sonar-report.xml",
    },
  },
} as UserConfig$2);
