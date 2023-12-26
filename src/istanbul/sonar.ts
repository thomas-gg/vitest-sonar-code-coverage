import path from "path";
import { escape } from "html-escaper";
import { ContentWriter, ReportBase } from "istanbul-lib-report";
import { ReportNode, XmlWriter } from "istanbul-lib-report";

interface IBranchDetail {
  lineNumber: number;
  hits: number;
  branchesToCover?: number;
  coveredBranches?: number;
}

class SonarReport extends ReportBase {
  cw: ContentWriter | null;
  xml: XmlWriter | null;
  timestamp: string;
  projectRoot: string;
  file: string;
  constructor(opts: { timestamp?: any; projectRoot?: any; file?: any }) {
    super();

    opts = opts || {};

    this.cw = null;
    this.xml = null;
    this.timestamp = opts.timestamp || Date.now().toString();
    this.projectRoot = opts.projectRoot || process.cwd();
    this.file = opts.file || "sonar-coverage.xml";
  }

  onStart(root: any, context: any) {
    this.cw = context.writer.writeFile(this.file);
    this.xml = context.getXMLWriter(this.cw);
    this.writeRootStats(root);
    this.xml!.openTag("coverage", {
      version: "1",
    });
  }

  onEnd() {
    this.xml!.closeTag("coverage");
    this.xml!.closeAll();
    this.cw!.close();
  }

  writeRootStats(_node: ReportNode) {
    this.cw!.println('<?xml version="1.0" ?>');
  }

  onDetail(node: ReportNode) {
    const fileCoverage = node.getFileCoverage();
    const metrics = node.getCoverageSummary(false);
    const branchByLine = fileCoverage.getBranchCoverageByLine();

    this.xml!.openTag("file", {
      name: escape(asClassName(node)),
      path: path.relative(this.projectRoot, fileCoverage.path),
      "line-rate": metrics.lines.pct / 100.0,
      "branch-rate": metrics.branches.pct / 100.0,
    });

    const lines = fileCoverage.getLineCoverage();
    Object.entries(lines).forEach(([k, hits]) => {
      const attrs = {
        lineNumber: Number(k),
        hits,
      } as IBranchDetail;
      const branchDetail = branchByLine[Number(k)];

      if (branchDetail) {
        attrs["branchesToCover"] = branchDetail.total;
        attrs["coveredBranches"] = branchDetail.covered;
      }
      this.xml!.inlineTag("linesToCover", attrs);
    });

    this.xml!.closeTag("file");
  }
}

function asClassName(node: ReportNode) {
  return node.getRelativeName().replace(/.*[\\/]/, "");
}

export default SonarReport;
