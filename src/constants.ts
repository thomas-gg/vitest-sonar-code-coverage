// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/istanbul-lib-coverage/index.d.ts#L70
interface Location {
  line: number;
  column: number;
}
interface Range {
  start: Location;
  end: Location;
}
interface FunctionMapping {
  name: string;
  decl: Range;
  loc: Range;
  line: number;
}
interface BranchMapping {
  loc: Range;
  type: string;
  locations: Range[];
  line: number;
}

export interface Coverage {
  covered: number;
  total: number;
  coverage: number;
}
export interface FileCoverageData {
  path: string;
  statementMap: { [key: string]: Range };
  fnMap: { [key: string]: FunctionMapping };
  branchMap: { [key: string]: BranchMapping };
  s: { [key: string]: number };
  f: { [key: string]: number };
  b: { [key: string]: number[] };
}
export interface CoverageMapData {
  // [key: string]: FileCoverage | FileCoverageData;
  [key: string]: FileCoverageData;
}
// https://github.com/gotwarlost/istanbul/blob/master/coverage.json.md

export const NEWLINE = "\n";
export const TAB = (number: number) => " ".repeat(number);

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

export const JSON_FILENAME = "coverage-final.json";
export const SONAR_FILENAME = "sonar-code-coverage.xml";
