// @vitest-environment jsdom
import type { ReactElement, ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import enA11y from "../../../messages/en/a11y.json";
import enHome from "../../../messages/en/home.json";
import enProject from "../../../messages/en/project.json";
import trA11y from "../../../messages/tr/a11y.json";
import trHome from "../../../messages/tr/home.json";
import trProject from "../../../messages/tr/project.json";

const setPipelineFocus = vi.fn();

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("@/components/signal", () => ({
  SIGNAL_ATTR: {
    section: "data-signal",
    work: "data-signal-work",
    step: "data-signal-step",
  },
  SignalSection: ({ id, state, children }: { id: string; state: string; children: ReactNode }) => (
    <section id={id} data-signal={state}>
      {children}
    </section>
  ),
  useSignal: () => ({ setPipelineFocus, coarse: false, motion: false }),
  useMotionEnabled: () => false,
  useSignalScene: () => {},
}));

import { getProjects, type ProjectMeta } from "@/lib/content";
import type { ProofFact } from "@/lib/proof";
import { AiSection } from "./AiSection";
import { AiSteps } from "./AiSteps";
import { Contact } from "./Contact";
import { Experience } from "./Experience";
import { Hero } from "./Hero";
import { MoreWork } from "./MoreWork";
import { Proof } from "./Proof";
import { SelectedWork } from "./SelectedWork";
import { TimelineSection } from "./TimelineSection";

const messages = {
  en: { home: enHome, a11y: enA11y, project: enProject },
  tr: { home: trHome, a11y: trA11y, project: trProject },
};

function view(ui: ReactElement, locale: "en" | "tr" = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      {ui}
    </NextIntlClientProvider>,
  );
}

let projects: ProjectMeta[] = [];
beforeAll(async () => {
  projects = await getProjects("en");
});
afterEach(() => {
  cleanup();
  setPipelineFocus.mockClear();
  vi.unstubAllGlobals();
});

const facts: ProofFact[] = [
  { id: "apps", value: 3, suffix: "" },
  { id: "seller", value: 1700, suffix: "+", sinceYear: 2022 },
  { id: "mobile", value: 900, suffix: "+" },
  { id: "years", value: 6, suffix: "+" },
];

describe("Proof", () => {
  it("formats numbers per locale", () => {
    view(<Proof facts={facts} />, "tr");
    expect(screen.getByText("1.700+")).toBeTruthy();
    expect(screen.queryByText("1,700+")).toBeNull();
    cleanup();
    view(<Proof facts={facts} />, "en");
    expect(screen.getByText("1,700+")).toBeTruthy();
  });

  it("carries the derived year in the label", () => {
    view(<Proof facts={facts} />);
    expect(screen.getByText("commits on the 1likte seller panel since 2022")).toBeTruthy();
  });
});

describe("SelectedWork", () => {
  it("renders the five selected projects in order, each with a stage for its cluster", () => {
    const selected = projects.filter((p) => p.featured);
    expect(selected).toHaveLength(5);
    const { container } = view(<SelectedWork projects={selected} />);
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(selected.map((p) => p.title));
    expect(container.querySelectorAll("[data-signal-work]")).toHaveLength(5);
    expect(container.querySelector("#work")).toBeTruthy();
  });

  it("opens store links in a new tab with hidden announcement text", () => {
    const selected = projects.filter((p) => p.featured);
    view(<SelectedWork projects={selected} />);
    const store = screen.getAllByRole("link", { name: /App Store/ });
    expect(store.length).toBeGreaterThan(0);
    for (const a of store) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
      expect(within(a).getByText(/Opens in a new tab/).className).toContain("sr-only");
    }
  });

  it("shows a text-only illustration for the project without screens, never a screenshot", () => {
    const selected = projects.filter((p) => p.featured);
    view(<SelectedWork projects={selected} />);
    expect(screen.getByText(/Client project/)).toBeTruthy();
    expect(screen.getByRole("img", { name: /Phone app, API and staff panel/ })).toBeTruthy();
  });
});

describe("MoreWork", () => {
  it("lists every other project and keeps the #gallery link to /gallery", () => {
    const more = projects.filter((p) => !p.featured);
    const { container } = view(<MoreWork projects={more} />);
    const gallery = container.querySelector("#gallery");
    expect(gallery?.tagName).toBe("A");
    expect(gallery?.getAttribute("href")).toBe("/gallery");
    expect(more.length).toBeGreaterThan(0);
    for (const p of more) expect(screen.getByText(p.title)).toBeTruthy();
  });
});

describe("TimelineSection", () => {
  it("links lanes that have a case page and leaves the rest as plain text", () => {
    view(<TimelineSection />);
    const landing = screen.getByRole("link", { name: /1likte Landing/ });
    expect(landing.getAttribute("href")).toBe("/work/1likte-landing-page");
    expect(screen.queryByRole("link", { name: /This site/ })).toBeNull();
    expect(screen.getByText(/This site/)).toBeTruthy();
  });
});

describe("AiSection", () => {
  it("is a disclosure: one step open at a time, and the open step lights its node", async () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private cb: IntersectionObserverCallback) {
          queueMicrotask(() => this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this as never));
        }
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    );
    const { container } = view(
      <>
        <AiSection />
        <AiSteps />
      </>,
    );
    await act(async () => {});
    expect(container.querySelector("#ai")).toBeTruthy();
    expect(container.querySelectorAll("[data-signal-step]")).toHaveLength(4);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
    expect(buttons.map((b) => b.getAttribute("aria-expanded"))).toEqual(["true", "false", "false", "false"]);
    fireEvent.click(buttons[2]);
    expect(buttons.map((b) => b.getAttribute("aria-expanded"))).toEqual(["false", "false", "true", "false"]);
    expect(setPipelineFocus).toHaveBeenLastCalledWith(2);
    fireEvent.click(buttons[2]);
    expect(buttons[2].getAttribute("aria-expanded")).toBe("false");
    expect(setPipelineFocus).toHaveBeenLastCalledWith(null);
  });

  it("does not light a node while the section is off screen", async () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private cb: IntersectionObserverCallback) {
          queueMicrotask(() => this.cb([{ isIntersecting: false } as IntersectionObserverEntry], this as never));
        }
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    );
    view(
      <>
        <AiSection />
        <AiSteps />
      </>,
    );
    await act(async () => {});
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(setPipelineFocus).not.toHaveBeenCalledWith(1);
  });
});

describe("copy rules", () => {
  it("has exactly one h1 and never mentions a GPA or an NDA", () => {
    for (const locale of ["en", "tr"] as const) {
      const selected = projects.filter((p) => p.featured);
      const { container } = view(
        <>
          <Hero apps={3} />
          <TimelineSection />
          <Proof facts={facts} />
          <SelectedWork projects={selected} />
          <MoreWork projects={projects.filter((p) => !p.featured)} />
          <AiSection />
          <AiSteps />
          <Experience />
          <Contact />
        </>,
        locale,
      );
      expect(container.querySelectorAll("h1")).toHaveLength(1);
      expect(container.textContent ?? "").not.toMatch(/\bGPA\b|\bNDA\b/);
      cleanup();
    }
  });

  it("keeps the hero headline as plain server-rendered text", () => {
    const { container } = view(<Hero apps={3} />);
    expect(container.querySelector("h1")?.textContent).toBe("Built to thehighest standard.");
  });
});
