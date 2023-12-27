import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.{test,spec}.{js,ts}"],
    coverage: {
      exclude: [...configDefaults.exclude],
      // @ts-ignore
      reporter: ["json", "json-summary", "cobertura", "../../../lib/cjs/sonarCodeCoverage.js"],
      provider: 'v8', // or istanbul
    },
    reporters: ["default", "vitest-sonar-reporter"],
    outputFile: {
      "vitest-sonar-reporter": "coverage/sonar-report.xml",
    },
  },
});
