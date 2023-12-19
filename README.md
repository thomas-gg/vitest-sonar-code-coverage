## Background

This npm module is made as a work-around for vitest users who need [SonarQube Generic Coverage](https://docs.sonarsource.com/sonarcloud/enriching/test-coverage/generic-test-data/#generic-coverage).

One use-case for this module is creating code coverage for svelte projects in SonarQube. SonarQube reports .svelte files as HTML files and does not show code coverage in their UI, even though svelte files can have code coverage with vitest. 

This module allows vitest to create the "Generic coverage" format that is associated with `sonar.coverageReportPaths`. You can combine the lcov output created via vitest with the generic code coverage format when sending reports to SonarQube.

Do not use this module if your project is using only javascript/typescript! Use `sonar.javascript.lcov.reportPaths=coverage/lcov.info` as described in the documentation. The lcov option in vitest is all you need, as it's optimized for sonar, again this module should only be used for projects that have files unsupported by SonarQube.

## Installation

```bash
npm install --save-dev vitest-sonar-code-coverage
```

Add customProviderModule in your [`vite.config.ts`](https://vitest.dev/config/). The following also includes vitest-sonar-reporter, but this is not necessary:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
      coverage: {
        exclude: [...configDefaults.exclude],
        //@ts-ignore
        reporter: ["json", "json-summary", "lcov", "cobertura"],
        provider: "custom",
        customProviderModule: "vitest-sonar-code-coverage",    // "src/SonarCodeCoverageProviderModule.ts" locally
      },
      reporters: ["default", "vitest-sonar-reporter"],
      outputFile: {
        "vitest-sonar-reporter": "coverage/sonar-report.xml",
      },
    },
});
```

## Sonar

Assuming you have both vitest-sonar-reporter and vitest-sonar-code-coverage, your sonar config may look like this:

```bash
sonar.testExecutionReportPaths=coverage/sonar-report.xml
# sonar.javascript.lcov.reportPaths=coverage/lcov.info     # include if javascript/typescript project
sonar.coverageReportPaths=coverage/sonar-code-coverage.xml
```