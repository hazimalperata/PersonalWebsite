// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import enProject from "../../../messages/en/project.json";
import enA11y from "../../../messages/en/a11y.json";
import trProject from "../../../messages/tr/project.json";
import trA11y from "../../../messages/tr/a11y.json";

const catalogues = {
  en: { project: enProject, a11y: enA11y },
  tr: { project: trProject, a11y: trA11y },
};
let currentLocale: "en" | "tr" = "en";

vi.mock("next-intl/server", () => ({
  getTranslations: async (namespace: string) =>
    createTranslator({ locale: currentLocale, messages: catalogues[currentLocale], namespace: namespace as never }),
}));
vi.mock("next-intl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next-intl")>()),
  useTranslations: (ns: string) =>
    createTranslator({ locale: currentLocale, messages: catalogues[currentLocale], namespace: ns as never }),
}));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

import { ProjectHeader } from "./ProjectHeader";
import type { ProjectMeta } from "@/lib/content";

const base: ProjectMeta = {
  slug: "posme",
  locale: "en",
  fallback: false,
  title: "Posme",
  summary: "A pose app.",
  publishedAt: "2026-09-01",
  year: "2026",
  images: [],
  cover: "",
  status: "completed",
  role: "Mobile engineer",
  stack: ["Flutter", "Dart"],
  featured: true,
  order: 2,
  kind: "product",
  platforms: ["iOS", "Android"],
  storeLinks: [{ store: "appStore", href: "https://apps.apple.com/app/id1" }],
  portraitImages: true,
  signal: "posme",
};

async function renderHeader(meta: ProjectMeta, locale: "en" | "tr" = "en") {
  currentLocale = locale;
  const ui = await ProjectHeader({ meta, locale });
  return render(ui);
}

afterEach(() => {
  cleanup();
  currentLocale = "en";
});

describe("ProjectHeader", () => {
  it("shows the lane's formatted commit count and date range for posme, and marks the signal box", async () => {
    const { container } = await renderHeader(base);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Posme");
    const line = screen.getByTestId("lane-line").textContent ?? "";
    expect(line).toMatch(/^\d[\d,]* commits? · [A-Z][a-z]{2}(–[A-Z][a-z]{2})? \d{4}/);
    expect(line.startsWith("217 commits")).toBe(true);
    expect(container.querySelector("[data-signal-header]")).not.toBeNull();
  });

  it("formats the count and months per locale in Turkish", async () => {
    await renderHeader({ ...base, locale: "tr" }, "tr");
    const line = screen.getByTestId("lane-line").textContent ?? "";
    expect(line.startsWith("217 commit · ")).toBe(true);
    expect(line).toMatch(/(Oca|Şub|Mar|Nis|May|Haz|Tem|Ağu|Eyl|Eki|Kas|Ara)/);
  });

  it("shows no count line for a project without a lane", async () => {
    await renderHeader({ ...base, slug: "adventures-of-the-knight", title: "Knight", signal: null, storeLinks: [] });
    expect(screen.queryByTestId("lane-line")).toBeNull();
    expect(screen.queryByText(/commits?/)).toBeNull();
  });

  it("shows the English-only note, in English, for a project without a TR file", async () => {
    await renderHeader({ ...base, locale: "en", fallback: true, signal: null }, "tr");
    const note = screen.getByText(trProject.englishOnly);
    expect(note).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 }).closest("[lang]")?.getAttribute("lang")).toBe("en");
    // the Turkish note, labels and status are not inside any English-marked element
    expect(note.closest("[lang]")).toBeNull();
    expect(screen.getByText(trProject.role).closest("[lang]")).toBeNull();
    expect(screen.getByText(trProject.completed).closest("[lang]")).toBeNull();
    // and the English copy from the EN file is
    expect(screen.getByText(base.summary).closest("[lang]")?.getAttribute("lang")).toBe("en");
  });

  it("opens store links in a new tab with the hidden hint", async () => {
    await renderHeader(base);
    const link = screen.getByRole("link", { name: /App Store/ });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.textContent).toContain(enA11y.externalLink);
  });
});
