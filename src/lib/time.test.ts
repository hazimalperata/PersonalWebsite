import { describe, expect, it } from "vitest";
import { formatCoordinates, formatLocalTime } from "./time";

describe("formatLocalTime", () => {
  const instant = new Date("2026-10-16T07:41:00Z");

  it("formats the time in the given zone, 24-hour, for en", () => {
    expect(formatLocalTime(instant, "Europe/Istanbul", "en")).toBe("10:41");
  });

  it("formats the time in the given zone, 24-hour, for tr", () => {
    expect(formatLocalTime(instant, "Europe/Istanbul", "tr")).toBe("10:41");
  });

  it("renders midnight as 00, not 24", () => {
    expect(formatLocalTime(new Date("2026-10-16T21:05:00Z"), "Europe/Istanbul", "en")).toBe("00:05");
    expect(formatLocalTime(new Date("2026-10-16T21:05:00Z"), "Europe/Istanbul", "tr")).toBe("00:05");
  });

  it("pads the hour and keeps 24-hour clock past noon", () => {
    expect(formatLocalTime(new Date("2026-10-16T22:05:00Z"), "Europe/Istanbul", "en")).toBe("01:05");
    expect(formatLocalTime(new Date("2026-10-16T11:09:00Z"), "Europe/Istanbul", "en")).toBe("14:09");
  });
});

describe("formatCoordinates", () => {
  it("renders hemisphere letters with two decimals", () => {
    expect(formatCoordinates(40.19, 29.06)).toBe("40.19°N 29.06°E");
    expect(formatCoordinates(-33.9, -70.67)).toBe("33.90°S 70.67°W");
  });
});
