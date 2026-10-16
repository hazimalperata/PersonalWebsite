"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { labFacts } from "@/lab/facts";
import { useMotionEnabled } from "@/lab/useMotionEnabled";
import { useGSAP, gsap } from "./gsap";
import { TechMarquee } from "./Marquee";
import { ExternalHint, MagicCard, NumberTicker, bursaTime, useNowSeconds } from "./ui";

const ROW_A = ["React Native", "Expo", "Flutter", "Next.js", "React 19", "TypeScript", "Tailwind CSS", "Design systems"];
const ROW_B = ["GSAP", "Motion", "Three.js", "WebGL shaders", "NestJS", "Prisma", "PostgreSQL", "Playwright", "CI/CD"];

/* Real snippet, shortened from content/projects/react-window-modals.en.mdx ("Usage Example"). */
const CODE = `import { WindowProvider, WindowWrapper } from "react-window-modals";

<WindowProvider
  ref={windowRef}
  initialPosition={{ x: "center", y: "center" }}
  initialSize={{ width: 400, height: "40%" }}
>
  <WindowWrapper>
    <WindowHeader />
  </WindowWrapper>
</WindowProvider>`;

const TOKEN = /("[^"]*")|\b(import|from|function|const|return)\b|(<\/?[A-Za-z]+)|\b(use[A-Z]\w+|on[A-Z]\w+)\b|\b([A-Z]\w+)\b/g;

function highlight(src: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of src.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(src.slice(last, i));
    const cls = m[1] ? "s" : m[2] ? "k" : m[3] ? "k" : m[4] ? "f" : "c";
    out.push(
      <span key={k++} className={cls}>
        {m[0]}
      </span>,
    );
    last = i + m[0].length;
  }
  out.push(src.slice(last));
  return out;
}

function Tile({ cls, children, as, ...rest }: { cls: string; children: ReactNode; as?: "a"; href?: string; target?: string; rel?: string }) {
  return (
    <div className={`tile ${cls}`}>
      <MagicCard as={as} {...rest}>
        {children}
      </MagicCard>
    </div>
  );
}

export function Bento() {
  const root = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();
  const now = useNowSeconds();
  const [dremly, posme] = labFacts.work;
  const gh = labFacts.social[0];
  const colon = <span className="colon">:</span>;
  const [hh, mm] = bursaTime(now).split(":");

  useGSAP(
    () => {
      if (!motion) return;
      const tiles = gsap.utils.toArray<HTMLElement>(".tile", root.current);
      tiles.forEach((tile, i) => {
        const fromX = (i % 3 - 1) * 46;
        gsap.fromTo(
          tile,
          { y: 80, x: fromX, opacity: 0, scale: 0.94, filter: "blur(14px)" },
          {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            ease: "none",
            immediateRender: true,
            scrollTrigger: {
              trigger: tile,
              start: `top ${100 - (i % 2) * 3}%`,
              end: `top ${70 - (i % 2) * 3}%`,
              scrub: 0.7,
            },
            onComplete: () => {
              gsap.set(tile, { clearProps: "filter" });
            },
          },
        );
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <div className="bento" ref={root}>
      <Tile cls="t-a">
        <span className="label">By the numbers</span>
        <ul className="stats">
          {labFacts.proof.map((p) => (
            <li className="stat" key={p.label}>
              <div className="n">
                <NumberTicker value={p.value} suffix={p.suffix} />
              </div>
              <p>{p.label}</p>
            </li>
          ))}
        </ul>
      </Tile>

      <Tile cls="t-b">
        <span className="label">Shipped</span>
        <h3>Live on both stores</h3>
        <div className="store-links">
          {[dremly, posme].flatMap((w) =>
            w.links.map((l) => (
              <a key={w.slug + l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                {w.title} · {l.label}
                <ExternalHint />
              </a>
            )),
          )}
        </div>
        <div className="phones" aria-hidden="true">
          {[dremly.images[0], posme.images[0]].map((src) => (
            <div className="ph" key={src}>
              <Image src={src} alt="" width={330} height={717} sizes="140px" />
            </div>
          ))}
        </div>
      </Tile>

      <Tile cls="t-c">
        <span className="label">Stack</span>
        <TechMarquee rows={[ROW_A, ROW_B]} />
      </Tile>

      <Tile cls="t-d">
        <span className="label">Bursa, Türkiye</span>
        <div className="clock mono">
          {hh}
          {colon}
          {mm}
          <small>UTC+3</small>
        </div>
      </Tile>

      <Tile cls="t-g">
        <div className="head">
          <span className="label">Open source</span>
          <Link className="link" href="/work/react-window-modals" prefetch={false} style={{ fontSize: 14 }}>
            Case study
          </Link>
        </div>
        <div className="codewin">
          <div className="bar mono">
            <i /> <i /> <i />
            <span style={{ marginLeft: 8 }}>react-window-modals</span>
          </div>
          <pre className="mono" tabIndex={0} aria-label="Usage example of react-window-modals">
            <code>{highlight(CODE)}</code>
          </pre>
        </div>
      </Tile>

      <Tile cls="t-e">
        <span className="label">Currently</span>
        <div className="lines">
          <p>
            <span className="live" aria-hidden="true"><i /></span>
            <span>
              <span className="k">CTO at </span>1likte
            </span>
          </p>
          <p>
            <span className="live" aria-hidden="true"><i /></span>
            <span>
              <span className="k">Building at </span>Tersane Dijital
            </span>
          </p>
        </div>
      </Tile>

      <Tile cls="t-f" as="a" href={gh.href} target="_blank" rel="noopener noreferrer">
        <div className="gh">
          <div>
            <span className="label">Code</span>
            <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 8 }}>
              github.com/hazimalperata
              <ExternalHint />
            </h3>
          </div>
          <span className="arrow" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12L12 4M5.5 4H12v6.5" />
            </svg>
          </span>
        </div>
      </Tile>
    </div>
  );
}
