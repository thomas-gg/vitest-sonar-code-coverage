import {
  Coverage,
  CoverageMapData,
  FileCoverageData,
  NEWLINE,
  TAB,
} from "./constants";
import { escapeXML } from "./escape-xml";
import { relative } from "node:path";

/*  Reference sonar code coverage format
    <coverage version="1">
      <file path="xources/hello/NoConditions.xoo">
        <lineToCover lineNumber="6" covered="true"/>
        <lineToCover lineNumber="7" covered="false"/>
      </file>
      <file path="xources/hello/WithConditions.xoo">
        <lineToCover lineNumber="3" covered="true" branchesToCover="2" coveredBranches="1"/>
      </file>
    </coverage>
    branchesToCover > 1 when a line is using conditionals such as ||
*/
export const generateSonarXML = (
  input: CoverageMapData,
  projectRoot: string
): string => {
  return [
    `<?xml version="1.0"?>${NEWLINE}<coverage version="1">${NEWLINE}`,
    `${Object.entries(input)
      .map((element) => generateFile(element, projectRoot))
      .join("")}`,
    `</coverage>${NEWLINE}`,
  ].join("");
};

const generateFile = (
  [_key, value]: [string, FileCoverageData],
  projectRoot: string
): string => {
  const fileName = relative(projectRoot, value.path);
  return [
    `${TAB(2)}<file path="${escapeXML(fileName)}">${NEWLINE}`,
    `${Object.entries(value.s)
      .map((element: [string, number]) => generateLine(element, value))
      .join("")}`,
    `${TAB(2)}</file>${NEWLINE}`,
  ].join("");
};

const generateLine = (
  [key, value]: [string, number],
  fileCoverageData: FileCoverageData
): string => {
  const branchCoverageByLine = getBranchCoverageByLine(fileCoverageData);
  const srcLineNumber = Number(key) + 1;
  const showBranches = branchCoverageByLine[srcLineNumber];
  const coveredBranches =
    showBranches && branchCoverageByLine[srcLineNumber].covered;
  const branchesToCover =
    showBranches && branchCoverageByLine[srcLineNumber].total;
  const tab = TAB(4);
  const beginning = `<lineToCover lineNumber="${srcLineNumber}" covered="${
    value > 0 ? "true" : "false"
  }"`;
  const middle = `${
    showBranches
      ? ` branchCoverageRatio="${coveredBranches}/${branchesToCover}" coveredBranches="${coveredBranches}" branchesToCover="${branchesToCover}"`
      : ""
  }`;
  const end = `/>${NEWLINE}`;
  return tab.concat(beginning, middle, end);
};

/**
 * returns a map of branch coverage by source line number.
 * @returns {Object} an object keyed by line number. Each object
 * has a `covered`, `total` and `coverage` (percentage) property.
 */
const getBranchCoverageByLine = (
  fileCoverageData: FileCoverageData
): { [line: number]: Coverage } => {
  const branchMap = fileCoverageData.branchMap;
  const branches = fileCoverageData.b;
  const ret: { [line: number]: Coverage } = {};
  Object.entries(branchMap).forEach(([k, map]) => {
    const line = map.line || map.loc.start.line;
    const branchData = branches[k];
    //@ts-ignore
    ret[line] = ret[line] || [];
    //@ts-ignore
    ret[line].push(...branchData);
  });
  Object.entries(ret).forEach(([k, dataArray]) => {
    //@ts-ignore
    const covered = dataArray.filter((item) => item > 0);
    //@ts-ignore
    const coverage = (covered.length / dataArray.length) * 100;
    //@ts-ignore
    ret[k] = {
      covered: covered.length,
      //@ts-ignore
      total: dataArray.length,
      coverage,
    };
  });
  return ret;
};
