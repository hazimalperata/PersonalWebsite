import { describe, expect, it } from "vitest";
import { shouldReveal } from "./reveal";

describe("shouldReveal", () => {
  it("reveals when the split lands soon after first paint", () => {
    expect(shouldReveal(300, 400)).toBe(true);
    expect(shouldReveal(300, 450)).toBe(true);
  });
  it("skips the reveal when the split lands late", () => {
    expect(shouldReveal(330, 610)).toBe(false);
  });
  it("treats an unknown first paint as late", () => {
    expect(shouldReveal(undefined, 100)).toBe(false);
  });
});
