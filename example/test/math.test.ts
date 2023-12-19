import { test, expect, describe } from "vitest";

import { add } from "../src/add";
import { subtract } from "../src/subtract";
import { multiply } from "../src/multiply";
import { v } from "../src/v";
import { u } from "../src/u";

describe("math", () => {
  test("add", () => {
    expect(add(0, 10)).toBe(10);
  });
  test("subtract", () => {
    expect(subtract(0, 2)).toBe(-2);
  });
  test("multiply", () => {
    expect(multiply(0, 2)).toBe(0);
  });
  // no coverage for divide
  test("switch statemenet with default", () => {
    expect(u("cat", 2)).toBe("yay cat1");
  });
  test("branch > 1 (i.e. condition uses an || statement)", () => {
    expect(v(0, 2)).toBe(2);
    expect(v(0, 2)).toBe(2);
    expect(v(0, 2)).toBe(2);
    expect(v(5, 4)).toBe(11);
  });
});
