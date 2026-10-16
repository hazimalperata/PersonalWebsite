"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { labFacts, type LabWork } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { firstYear, lastYear, projectTotals, projects, totalCommits } from "./data";
import { useEnv } from "./SignalShell";
import { StaticTimeline } from "./Timeline";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const fmt = (n: number) => n.toLocaleString("en-US");
const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

function ExtLink({ href, children, main }: { href: string; children: React.ReactNode; main?: boolean }) {
  return (
    <a className={main ? "main" : undefined} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      {NEW_TAB}
    </a>
  );
}

function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <a className="brand" href="#top">
        {labFacts.name}
      </a>
      <ul className="mono">
        <li><a href="#proof">Proof</a></li>
        <li><a href="#work">Work</a></li>
        <li><a href="#capabilities">Capabilities</a></li>
        <li><a href="#ai">AI</a></li>
        <li><a href="#experience">Experience</a></li>
      </ul>
      <a className="cta mono" href="#contact">
        Contact
      </a>
    </nav>
  );
}

function Hero({ motion }: { motion: boolean }) {
  return (
    <header className="hero" id="top" data-signal="0">
      <div className="hero-inner">
        <span className="tag mono" data-hero>
          {labFacts.role} · {labFacts.location}
        </span>
        <h1>
          <span className="line"><span>Built to the</span></span>
          <span className="line"><span>highest standard.</span></span>
        </h1>
        <p className="msg" data-hero>{labFacts.message}</p>
        <div className="who mono" data-hero>
          <b>{labFacts.name}</b>
          <span>{labFacts.proof[0].value} apps live on the App Store and Google Play</span>
        </div>
        <div className="btns" data-hero>
          <a className="btn primary" href="#work">See the work</a>
          <a className="btn mono" href="#contact">Get in touch</a>
        </div>
        <div className="counter" data-hero>
          <span className="n mono" data-counter aria-label={`${fmt(totalCommits)} commits`}>{fmt(totalCommits)}</span>
          <span className="l mono">
            commits across {projects.length} projects, mine, counted from git. Every point behind this page is one of them.
          </span>
        </div>
      </div>
      <div className={`cue${motion ? " on" : ""}`} aria-hidden="true">
        <span className="bar" />
        Scroll
      </div>
    </header>
  );
}

function TimelineSection({ motion }: { motion: boolean }) {
  const { coarse } = useEnv();
  const per = coarse ? 3 : 1;
  const caption = (
    <>
      {per === 1 ? "Every point is a commit" : `1 point = ${per} commits`}
      <span className="m"> · {fmt(totalCommits)} commits</span>
      <span className="m"> · {firstYear}–{lastYear}</span>
    </>
  );
  return (
    <section className="tl-section" id="timeline" data-signal="1" aria-labelledby="tl-h">
      <div className="tl-sticky">
        <h2 id="tl-h" data-reveal>One point, one commit.</h2>
        {!motion && (
          <div style={{ marginTop: 24, pointerEvents: "auto" }}>
            <StaticTimeline />
          </div>
        )}
        <div className="tl-caption mono">
          <span className="dot" aria-hidden="true" />
          <span>{caption}</span>
        </div>
      </div>
      <p className="sr-only">
        Commit counts per project: {projectTotals.map((p) => `${p.name} ${p.total}`).join(", ")}.
      </p>
    </section>
  );
}

function ProofSteps({ motion }: { motion: boolean }) {
  return (
    <section id="proof" aria-label="Proof">
      {labFacts.proof.map((p, i) => (
        <div className="proof-step" key={p.label} data-signal={2 + i}>
          <div className="copy panel" data-reveal>
            <div className="idx mono">0{i + 1} / 0{labFacts.proof.length}</div>
            <div className={motion ? "big sr-only" : "big vis"}>
              {p.value}
              {p.suffix}
            </div>
            <p className="lbl">{p.label}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function Illustration() {
  return (
    <div className="illus">
      <span className="cap mono">Illustration · system overview, not a screenshot</span>
      <svg viewBox="0 0 420 96" role="img" aria-label="Phone app, API and staff panel connected in a row">
        <g fill="none" stroke="#6EE7B7" strokeWidth="1.2">
          <rect x="4" y="14" width="112" height="68" rx="10" />
          <rect x="154" y="14" width="112" height="68" rx="10" />
          <rect x="304" y="14" width="112" height="68" rx="10" />
          <path d="M116 48h38M266 48h38" strokeDasharray="3 4" />
          <path d="M148 43l6 5-6 5M298 43l6 5-6 5" />
        </g>
        <g fill="#E8EAF0" fontFamily="var(--font-plex), monospace" fontSize="10" textAnchor="middle">
          <text x="60" y="44">Mobile app</text>
          <text x="60" y="60" fill="#8B90A0">pose on device</text>
          <text x="210" y="44">API</text>
          <text x="210" y="60" fill="#8B90A0">NestJS · Postgres</text>
          <text x="360" y="44">Staff panel</text>
          <text x="360" y="60" fill="#8B90A0">Next.js</text>
        </g>
      </svg>
    </div>
  );
}

function WorkCard({ w, i }: { w: LabWork; i: number }) {
  const proj = projects.find((p) => p.work === i);
  const wide = !w.portrait;
  const isRommer = w.images.length === 0;
  const right = i % 2 === 1;
  const total = proj ? projectTotals.find((p) => p.name === proj.name)?.total : undefined;
  return (
    <section className={`work${right ? " right" : ""}`} data-signal={6 + i} id={i === 0 ? "work" : undefined} aria-labelledby={`w-${w.slug}`}>
      <article className={`work-card panel${wide || isRommer ? " wide" : ""}`} data-reveal>
        <div>
          <div className="meta mono">
            <span className="sw">
              <i style={{ background: proj?.color }} />
              {w.kind}
            </span>
            <span>{w.year}</span>
            <span>{w.platforms.join(" · ")}</span>
            {total && <span>{fmt(total)} commits</span>}
          </div>
          <h3 id={`w-${w.slug}`}>{w.title}</h3>
          <p>{w.summary}</p>
          <p className="role">{w.role}</p>
          {isRommer && <p className="note mono">Client project · screens not public yet</p>}
          <ul className="chips mono" aria-label="Stack">
            {w.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="links mono">
            {w.href && <a className="main" href={w.href}>Case study</a>}
            {w.links.map((l) => (
              <ExtLink key={l.href} href={l.href}>{l.label}</ExtLink>
            ))}
          </div>
        </div>
        {isRommer && <Illustration />}
        {!isRommer && w.portrait && (
          <div className="phones">
            {w.images.slice(0, 2).map((src, k) => (
              <figure className="phone" key={src} data-parallax={k === 0 ? 1 : 1.6}>
                <Image src={src} alt={`${w.title} app screenshot ${k + 1}`} width={660} height={1434} sizes="150px" />
              </figure>
            ))}
          </div>
        )}
        {!isRommer && !w.portrait && (
          <figure className="browser" data-parallax={0.6}>
            <div className="bar" aria-hidden="true">
              <i /><i /><i />
            </div>
            <Image
              src={w.images[0]}
              alt={`${w.title} screenshot`}
              width={w.slug.includes("seller") ? 2467 : 1999}
              height={w.slug.includes("seller") ? 1214 : 838}
              sizes="(max-width: 760px) 90vw, 800px"
            />
          </figure>
        )}
      </article>
    </section>
  );
}

function More() {
  return (
    <section className="band" aria-labelledby="more-h">
      <span className="tag mono">More work</span>
      <h2 id="more-h" data-reveal>Also built.</h2>
      <ul className="more-list" data-reveal>
        {labFacts.more.map((m) => (
          <li key={m.title}>
            <a href={m.href}>
              <span className="t">{m.title}</span>
              <span className="d">{m.line}</span>
              <span className="ar mono" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];
const xPct = (y: number) => ((y - 2020) / 7) * 100;

function Capabilities() {
  return (
    <section className="band" id="capabilities" aria-labelledby="cap-h">
      <span className="tag mono">Capabilities</span>
      <h2 id="cap-h" data-reveal>What I build with.</h2>
      <div className="cap-grid">
        {labFacts.capabilities.map((c) => (
          <div className="cell panel" key={c.title} data-reveal>
            <h3>{c.title}</h3>
            <ul>
              {c.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="band" id="experience" aria-labelledby="xp-h">
      <span className="tag mono">Experience</span>
      <h2 id="xp-h" data-reveal>Where it was built.</h2>
      <div className="xp panel" data-reveal>
        <div className="axis mono" aria-hidden="true">
          {YEARS.slice(0, 7).map((y) => (
            <span key={y} style={{ left: `${xPct(y + 0.5)}%` }}>{y}</span>
          ))}
        </div>
        <div className="grid" aria-hidden="true">
          {YEARS.map((y) => (
            <i key={y} style={{ left: `${xPct(y)}%` }} />
          ))}
        </div>
        {labFacts.experience.map((e) => {
          const from = Number(e.from);
          const to = e.to === "present" ? 2027 : Number(e.to) + 1;
          return (
            <div className="xp-row" key={e.company}>
              <div className="head">
                <span className="co">{e.company}</span>
                <span className="yr mono">
                  {e.role} · {e.from}
                  {e.to === e.from ? "" : ` – ${e.to}`}
                </span>
              </div>
              <div className="bar-wrap" style={{ marginTop: 10, marginLeft: `${xPct(from)}%`, width: `${xPct(to) - xPct(from)}%` }}>
                <div className="bar" data-bar />
              </div>
              <p>{e.line}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AiIntro() {
  const ai = labFacts.ai;
  return (
    <section className="band" id="ai" aria-labelledby="ai-h">
      <span className="tag mono">AI</span>
      <h2 id="ai-h" data-reveal>{ai.title}</h2>
      <p className="ai-intro" data-reveal>{ai.intro}</p>
      <div className="ai-prod">
        {ai.inProducts.map((p) => (
          <div className="cell panel" key={p.product} data-reveal>
            <h3>{p.product}</h3>
            <p>{p.line}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AiWorkflow() {
  return (
    <section className="ai-run" data-signal="12" data-ai aria-labelledby="wf-h">
      <div className="ai-sticky">
        <span className="tag mono">Workflow</span>
        <h3 id="wf-h" className="ai-h">Four steps, every time.</h3>
        <ol className="ai-steps">
          {labFacts.ai.workflow.map((s, i) => (
            <li className="ai-step panel" key={s.step}>
              <span className="idx mono">0{i + 1}</span>
              <h4>{s.step}</h4>
              <p>{s.line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AiSystem() {
  const sys = labFacts.ai.system;
  return (
    <section className="sys-run" data-signal="13" data-sys aria-labelledby="sys-h">
      <div className="ai-sticky">
        <div className="sys-copy panel">
          <span className="tag mono">The system</span>
          <h3 id="sys-h" className="ai-h">{sys.title}</h3>
          <p className="sys-intro">{sys.intro}</p>
          <ol className="sys-parts">
            {sys.parts.map((p, i) => (
              <li className="sys-part" data-i={i} key={p.name}>
                <span className="idx mono">0{i + 1}</span>
                <div>
                  <h4>{p.name}</h4>
                  <p>{p.line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact" data-signal="15" aria-labelledby="contact-h">
      <div className="in">
        <span className="tag mono">Contact</span>
        <h2 id="contact-h">Let’s build it properly.</h2>
        <a className="mail mono" href={`mailto:${labFacts.email}`}>{labFacts.email}</a>
        <div className="btns">
          <a className="btn primary" href={labFacts.cv}>Download CV</a>
        </div>
      </div>
    </section>
  );
}

export function Content() {
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motion) return;
      const q = gsap.utils.selector(root);

      // hero entrance: masked line reveal, then the rest
      gsap.set(q(".hero .line > span"), { yPercent: 108 });
      gsap.set(q("[data-hero]"), { opacity: 0, y: 18 });
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } });
      tl.to(q(".hero .line > span"), { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0)
        .to(q("[data-hero]"), { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.35);

      // real total counts up, eased, no overshoot
      const n = root.current?.querySelector<HTMLElement>("[data-counter]");
      if (n) {
        const o = { v: 0 };
        n.textContent = "0";
        gsap.to(o, {
          v: totalCommits,
          duration: 2.6,
          delay: 0.6,
          ease: "power3.out",
          onUpdate: () => {
            n.textContent = fmt(Math.round(o.v));
          },
          onComplete: () => {
            n.textContent = fmt(totalCommits);
          },
        });
      }

      // section reveals
      const items = q("[data-reveal]");
      gsap.set(items, { opacity: 0, y: 30 });
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", overwrite: true }),
      });

      // device frames drift against the scroll
      q("[data-parallax]").forEach((el) => {
        const k = Number((el as HTMLElement).dataset.parallax) || 1;
        gsap.fromTo(
          el,
          { y: 26 * k },
          { y: -26 * k, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });

      // experience bars wipe in from the left (clip, never scale from zero)
      q("[data-bar]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 100% 0 0 round 4px)" },
          {
            clipPath: "inset(0 0% 0 0 round 4px)",
            duration: 1.2,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <>
      <Nav />
      <main className={`d4-main${motion ? "" : " static"}`} ref={root}>
        <Hero motion={motion} />
        <TimelineSection motion={motion} />
        <ProofSteps motion={motion} />
        {labFacts.work.map((w, i) => (
          <WorkCard key={w.slug} w={w} i={i} />
        ))}
        <More />
        <div data-signal="11">
          <Capabilities />
          <AiIntro />
        </div>
        <AiWorkflow />
        <AiSystem />
        <div data-signal="14">
          <Experience />
        </div>
        <Contact />
      </main>
      <footer className="foot mono">
        <span>© 2026 {labFacts.name} · {labFacts.location}</span>
        <ul>
          {labFacts.social.map((s) => (
            <li key={s.name}>
              <ExtLink href={s.href}>{s.name}</ExtLink>
            </li>
          ))}
        </ul>
      </footer>
    </>
  );
}
