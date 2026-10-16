// @vitest-environment jsdom
import type { ReactElement, ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import enA11y from "../../../messages/en/a11y.json";
import enHome from "../../../messages/en/home.json";
import enProject from "../../../messages/en/project.json";
import trA11y from "../../../messages/tr/a11y.json";
import trHome from "../../../messages/tr/home.json";
import trProject from "../../../messages/tr/project.json";

const setPipelineProgress = vi.fn();
const motionOn = vi.hoisted(() => ({ value: false }));
type TriggerConfig = { onUpdate?: (self: { progress: number }) => void; onToggle?: (self: { isActive: boolean }) => void };
const triggers = vi.hoisted(() => ({ list: [] as Array<{ config: TriggerConfig; kill: () => void }> }));
vi.mock("@/lib/motion", () => ({
  registerGsap: () => {},
  gsap: {},
  ScrollTrigger: {
    create: (config: TriggerConfig) => {
      const t = { config, kill: vi.fn() };
      triggers.list.push(t);
      return t;
    },
  },
}));

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
    pipeRun: "data-signal-pipe-run",
  },
  SignalSection: ({ id, state, children }: { id: string; state: string; children: ReactNode }) => (
    <section id={id} data-signal={state}>
      {children}
    </section>
  ),
  useSignal: () => ({ setPipelineProgress, coarse: false, motion: false }),
  useMotionEnabled: () => motionOn.value,
  useSignalScene: () => {},
}));

import { getProjects, type ProjectMeta } from "@/lib/content";
import type { ProofFact } from "@/lib/proof";
import { AiSection } from "./AiSection";
import { AiSteps } from "./AiSteps";
import { Contact } from "./Contact";
import { Experience } from "./Experience";
import { Hero } from "./Hero";
import { HomeScene } from "./HomeScene";
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
  setPipelineProgress.mockClear();
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

describe("MoreWork language marks", () => {
  it("marks English-only projects lang=en on the Turkish list and leaves translated ones unmarked", () => {
    const base = projects.find((p) => !p.featured) as ProjectMeta;
    const en = { ...base, slug: "only-en", title: "Only English", summary: "English summary.", fallback: true, locale: "en" as const };
    const tr = { ...base, slug: "has-tr", title: "Çeviri var", summary: "Türkçe özet.", fallback: false, locale: "tr" as const };
    view(<MoreWork projects={[en, tr]} />, "tr");
    expect(screen.getByText("Only English").closest("[lang]")?.getAttribute("lang")).toBe("en");
    expect(screen.getByText("English summary.").closest("[lang]")?.getAttribute("lang")).toBe("en");
    expect(screen.getByText("Çeviri var").closest("[lang]")).toBeNull();
    expect(screen.getByText("Türkçe özet.").closest("[lang]")).toBeNull();
  });
});

describe("Contact CV", () => {
  it("links the English CV on both locales and keeps the localized label", () => {
    for (const locale of ["en", "tr"] as const) {
      const { container } = view(<Contact />, locale);
      const a = container.querySelector("a[download]");
      expect(a?.getAttribute("href")).toBe("/Hazim_Alper_Ata-EN-CV.pdf");
      expect(a?.textContent).toBe(messages[locale].home.contact.cv);
      cleanup();
    }
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
  const STEP_TITLES = ["Spec first", "Agents as a team", "Independent review", "Gates, not trust"];

  it("lists the four steps with index, title and line, and has no buttons or expanders", () => {
    const { container } = view(
      <>
        <AiSection />
        <AiSteps />
      </>,
    );
    expect(container.querySelector("#ai")).toBeTruthy();
    const items = within(screen.getByRole("list", { name: "How I work with AI" })).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    items.forEach((li, i) => {
      expect(within(li).getByRole("heading", { name: STEP_TITLES[i] })).toBeTruthy();
      expect(li.textContent).toContain(`0${i + 1}`);
      expect(li.hidden).toBe(false);
      expect(li.getAttribute("aria-hidden")).toBeNull();
    });
    // the four node slots sit in a hidden row above the list, not inside the cards
    const slots = [...container.querySelectorAll("[data-signal-step]")];
    expect(slots.map((s) => s.getAttribute("data-signal-step"))).toEqual(["0", "1", "2", "3"]);
    for (const s of slots) {
      expect(s.closest("[aria-hidden='true']")).toBeTruthy();
      expect(items.some((li) => li.contains(s))).toBe(false);
      expect(s.compareDocumentPosition(screen.getByRole("list", { name: "How I work with AI" })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(container.querySelector("[aria-expanded]")).toBeNull();
  });

  it("carries no expanded-detail copy in either language", () => {
    for (const [name, json] of [["en", enHome], ["tr", trHome]] as const) {
      for (const step of Object.values(json.ai.steps)) expect(Object.keys(step).sort(), name).toEqual(["line", "title"]);
    }
    const { container } = view(<AiSteps />);
    expect(container.textContent).not.toMatch(/handing a session over|click-to-inspect|written rule every agent/);
  });

  it("without motion no scroll trigger is created and the fill stays clear", async () => {
    triggers.list.length = 0;
    view(<AiSteps />);
    await act(async () => {});
    expect(triggers.list).toHaveLength(0);
    expect(setPipelineProgress).not.toHaveBeenCalled();
  });

  describe("with motion", () => {
    beforeAll(() => {
      motionOn.value = true;
    });
    afterEach(() => {
      motionOn.value = false;
      triggers.list.length = 0;
    });

    it("hands the runway's scroll progress to the field and clears it on unmount", async () => {
      triggers.list.length = 0;
      motionOn.value = true;
      const { unmount } = view(<AiSteps />);
      await act(async () => {});
      expect(triggers.list).toHaveLength(1);
      const [progress] = triggers.list;
      expect(setPipelineProgress).toHaveBeenLastCalledWith(0);
      act(() => progress.config.onUpdate?.({ progress: 0.6 }));
      expect(setPipelineProgress).toHaveBeenLastCalledWith(0.6);
      act(() => progress.config.onUpdate?.({ progress: 1 }));
      expect(setPipelineProgress).toHaveBeenLastCalledWith(1);
      unmount();
      expect(progress.kill).toHaveBeenCalled();
      expect(setPipelineProgress).toHaveBeenLastCalledWith(null);
    });

    it("goes inert and clears the fill when static mode is set after mount, and resumes if it is lifted", async () => {
      triggers.list.length = 0;
      motionOn.value = true;
      const { container } = view(<AiSteps />);
      await act(async () => {});
      const [progress] = triggers.list;
      const run = container.querySelector<HTMLElement>("[data-signal-pipe-run]")!;
      run.style.setProperty("--on0", "0.4");
      setPipelineProgress.mockClear();
      await act(async () => {
        document.documentElement.setAttribute("data-signal-static-mode", "");
        await Promise.resolve();
      });
      expect(setPipelineProgress).toHaveBeenLastCalledWith(null);
      expect(run.style.getPropertyValue("--on0")).toBe("");
      // scroll updates no longer reach the field, and no second trigger is made
      act(() => progress.config.onUpdate?.({ progress: 0.5 }));
      expect(setPipelineProgress).toHaveBeenLastCalledWith(null);
      expect(triggers.list).toHaveLength(1);
      await act(async () => {
        document.documentElement.removeAttribute("data-signal-static-mode");
        await Promise.resolve();
      });
      act(() => progress.config.onUpdate?.({ progress: 0.5 }));
      expect(setPipelineProgress).toHaveBeenLastCalledWith(0.5);
      expect(triggers.list).toHaveLength(1);
    });

    it("creates no trigger at all when static mode is already set", async () => {
      triggers.list.length = 0;
      motionOn.value = true;
      document.documentElement.setAttribute("data-signal-static-mode", "");
      view(<AiSteps />);
      await act(async () => {});
      expect(triggers.list).toHaveLength(0);
      document.documentElement.removeAttribute("data-signal-static-mode");
    });
  });
});

describe("HomeScene", () => {
  it("flags the document only while the timeline section is mid-screen", async () => {
    let fire: (hit: boolean) => void = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private cb: IntersectionObserverCallback) {
          fire = (hit) => this.cb([{ isIntersecting: hit } as IntersectionObserverEntry], this as never);
        }
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    );
    const section = document.createElement("section");
    section.id = "timeline";
    document.body.appendChild(section);
    const { unmount } = view(<HomeScene proof={[]} work={[]} />);
    await act(async () => {});
    expect(document.documentElement.hasAttribute("data-home")).toBe(true);
    expect(document.documentElement.hasAttribute("data-home-timeline")).toBe(false);
    act(() => fire(true));
    expect(document.documentElement.hasAttribute("data-home-timeline")).toBe(true);
    act(() => fire(false));
    expect(document.documentElement.hasAttribute("data-home-timeline")).toBe(false);
    act(() => fire(true));
    unmount();
    expect(document.documentElement.hasAttribute("data-home-timeline")).toBe(false);
    expect(document.documentElement.hasAttribute("data-home")).toBe(false);
    section.remove();
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
    expect(container.querySelector("h1")?.textContent).toBe("Built to the highest standard.");
  });

  it("keeps a space between the two headline lines in Turkish too", () => {
    const { container } = view(<Hero apps={3} />, "tr");
    expect(container.querySelector("h1")?.textContent).toBe(`${trHome.hero.line1} ${trHome.hero.line2}`);
  });
});
