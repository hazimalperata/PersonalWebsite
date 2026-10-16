import { describe, expect, it } from "vitest";
import { formatLaneRange } from "./lane-line";

describe("formatLaneRange", () => {
  it("collapses a range inside one year", () => {
    expect(formatLaneRange({ first: "2026-07-03", last: "2026-10-16" }, "en")).toBe("Jul–Oct 2026");
  });
  it("keeps both years across a year boundary", () => {
    expect(formatLaneRange({ first: "2025-11-30", last: "2026-03-01" }, "en")).toBe("Nov 2025–Mar 2026");
  });
  it("names a single month once", () => {
    expect(formatLaneRange({ first: "2026-10-01", last: "2026-10-16" }, "en")).toBe("Oct 2026");
  });
  it("uses Turkish month names", () => {
    expect(formatLaneRange({ first: "2026-07-03", last: "2026-10-16" }, "tr")).toBe("Tem–Eki 2026");
  });
  it("returns an empty string for malformed dates", () => {
    expect(formatLaneRange({ first: "", last: "x" }, "en")).toBe("");
  });
});
