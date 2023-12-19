import type { BaseCoverageOptions, Vitest } from "vitest";
import type {
  AfterSuiteRunMeta,
  ReportContext,
  ResolvedCoverageOptions,
} from "vitest";

import { existsSync, writeFile } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { V8CoverageProvider } from "@vitest/coverage-v8/dist/provider";
import { coverageConfigDefaults } from "vitest/config";
import { generateSonarXML } from "./utils";
import { JSON_FILENAME, SONAR_FILENAME } from "./constants";

type Options = ResolvedCoverageOptions<"v8">;

export default class SonarCodeCoverageProvider extends V8CoverageProvider {
  name = "sonar-generic";
  options!: Options;

  pendingPromises: Promise<void>[] = [];
  coverageFilesDirectory!: string;
  configRoot!: string;

  initialize(ctx: Vitest) {
    super.initialize(ctx);

    // enforce json to be created
    const config: BaseCoverageOptions = ctx.config.coverage;
    coverageConfigDefaults.reporter.push(["json", {}]);
    let reporter;
    if (config.reporter) {
      reporter = this.resolveReporters(config.reporter);
    } else {
      coverageConfigDefaults.reporter.push(["json", {}]);
      reporter = this.resolveReporters(coverageConfigDefaults.reporter);
    }

    this.ctx = ctx;
    this.options = {
      ...coverageConfigDefaults,

      // User's options
      ...config,

      // Resolved fields
      provider: "v8",
      reporter: this.resolveReporters(
        config.reporter || coverageConfigDefaults.reporter
      ),
      reportsDirectory: resolve(
        ctx.config.root,
        config.reportsDirectory || coverageConfigDefaults.reportsDirectory
      ),

      thresholds: config.thresholds && {
        ...config.thresholds,
        lines: config.thresholds["100"] ? 100 : config.thresholds.lines,
        branches: config.thresholds["100"] ? 100 : config.thresholds.branches,
        functions: config.thresholds["100"] ? 100 : config.thresholds.functions,
        statements: config.thresholds["100"]
          ? 100
          : config.thresholds.statements,
      },
    };

    this.coverageFilesDirectory = resolve(this.options.reportsDirectory);
    this.configRoot = ctx.config.root;
  }

  async clean(clean?: boolean) {
    return super.clean(clean);
  }

  onAfterSuiteRun(meta: AfterSuiteRunMeta) {
    super.onAfterSuiteRun(meta);
  }

  async reportCoverage(reportContext?: ReportContext) {
    await super.reportCoverage(reportContext);
    if (existsSync(this.coverageFilesDirectory)) {
      try {
        const filePath = resolve(this.coverageFilesDirectory, JSON_FILENAME);
        const data = await readFile(filePath, { encoding: "utf-8" });
        const jsonContents = JSON.parse(data);
        const coverage = generateSonarXML(jsonContents, this.configRoot);
        const sonarFilePath = resolve(
          this.coverageFilesDirectory,
          SONAR_FILENAME
        );

        writeFile(sonarFilePath, coverage, "utf-8", (err) => {
          if (err) console.error("There was an issue saving the sonar file");
        });
      } catch (err) {
        console.error(err);
      }
    }
  }
  resolveOptions(): ResolvedCoverageOptions<"v8"> {
    return super.resolveOptions();
  }
}
