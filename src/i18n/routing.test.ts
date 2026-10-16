import { describe, expect, it } from "vitest";
import { routing } from "./routing";

describe("routing", () => {
  it("defaults to English without prefix", () => {
    expect(routing.defaultLocale).toBe("en");
    expect(routing.localePrefix).toBe("as-needed");
    expect(routing.locales).toEqual(["en", "tr"]);
    expect(routing.alternateLinks).toBe(false);
  });
});
