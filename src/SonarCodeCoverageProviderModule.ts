import type { CoverageProvider, CoverageProviderModule } from "vitest";
import SonarCodeCoverageProvider from "./SonarCodeCoverageProvider.js";

declare global {
  var CUSTOM_PROVIDER_START_COVERAGE: boolean;
  var CUSTOM_PROVIDER_TAKE_COVERAGE: boolean;
}

const CustomCoverageProviderModule: CoverageProviderModule = {
  getProvider(): CoverageProvider {
    return new SonarCodeCoverageProvider();
  },

  takeCoverage() {
    globalThis.CUSTOM_PROVIDER_TAKE_COVERAGE = true;

    if (!globalThis.CUSTOM_PROVIDER_START_COVERAGE)
      throw new Error("takeCoverage was called before startCoverage!");

    return {
      customCoverage: "Coverage report passed from workers to main thread",
    };
  },

  startCoverage() {
    globalThis.CUSTOM_PROVIDER_START_COVERAGE = true;
  },

  stopCoverage() {
    if (!globalThis.CUSTOM_PROVIDER_START_COVERAGE)
      throw new Error("stopCoverage was called before startCoverage!");

    if (!globalThis.CUSTOM_PROVIDER_TAKE_COVERAGE)
      throw new Error("stopCoverage was called before takeCoverage!");
  },
};

export default CustomCoverageProviderModule;
