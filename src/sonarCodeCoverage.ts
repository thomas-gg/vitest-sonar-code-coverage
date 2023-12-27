import path from "path";
import { escape } from "html-escaper";
import { ContentWriter, ReportBase } from "istanbul-lib-report";
import { ReportNode, XmlWriter } from "istanbul-lib-report";

/*  Reference XSD format for Sonar
<xs:schema>
  <xs:element name="coverage">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="file" minOccurs="0" maxOccurs="unbounded">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="lineToCover" minOccurs="0" maxOccurs="unbounded">
                <xs:complexType>
                  <xs:attribute name="lineNumber" type="xs:positiveInteger" use="required"/>
                  <xs:attribute name="covered" type="xs:boolean" use="required"/>
                  <xs:attribute name="branchesToCover" type="xs:nonNegativeInteger"/>
                  <xs:attribute name="coveredBranches" type="xs:nonNegativeInteger"/>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          <xs:attribute name="path" type="xs:string" use="required"/>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
      <xs:attribute name="version" type="xs:positiveInteger" use="required"/>
    </xs:complexType>
  </xs:element>
</xs:schema>

https://docs.sonarsource.com/sonarcloud/enriching/test-coverage/generic-test-data/
*/

interface IBranchDetail {
  lineNumber: number;
  hits: number;
  branchesToCover?: number;
  coveredBranches?: number;
}

class SonarCodeCoverageReport extends ReportBase {
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

module.exports = SonarCodeCoverageReport;
