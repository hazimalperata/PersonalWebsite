import { describe, expect, it } from "vitest";
import { countByDay, toSignal } from "./signal-lib.mjs";

describe("countByDay", () => {
  it("counts per day and ignores blank lines", () => {
    expect(countByDay("2024-01-02\n2024-01-02\n\n2024-01-05")).toEqual({
      "2024-01-02": 2,
      "2024-01-05": 1,
    });
  });
  it("tolerates CRLF", () => {
    expect(countByDay("2024-01-02\r\n2024-01-02\r\n")).toEqual({ "2024-01-02": 2 });
  });
});

describe("toSignal", () => {
  it("sorts days ascending and keeps only d and n", () => {
    const out = toSignal(
      [{ id: "seller", counts: { "2024-03-01": 2, "2024-01-01": 5 } }],
      "2026-10-16",
    );
    expect(out).toEqual({
      generatedAt: "2026-10-16",
      lanes: [
        {
          id: "seller",
          days: [
            { d: "2024-01-01", n: 5 },
            { d: "2024-03-01", n: 2 },
          ],
        },
      ],
    });
  });
});
