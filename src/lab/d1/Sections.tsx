import type { CSSProperties } from "react";
import { labFacts } from "@/lab/facts";
import { SECTIONS } from "./sectionList";
import { ProjectSheet } from "./ProjectSheet";

function SecHead({ i, title, note }: { i: number; title: string; note?: string }) {
  const s = SECTIONS[i];
  return (
    <header className="sec-head">
      <p className="mono sec-ref">{s.ref}</p>
      <h2 id={`${s.id}-h`} className="sec-title">
        {title}
      </h2>
      {note && <p className="mono sec-note">{note}</p>}
      <span className="rule" aria-hidden="true" />
    </header>
  );
}

export function Proof() {
  return (
    <section id="proof" className="sec" aria-labelledby="proof-h">
      <SecHead i={1} title="Proof" />
      <ul className="proof-grid">
        {labFacts.proof.map((p) => (
          <li key={p.label} className="proof-item">
            <p className="proof-num mono" style={{ "--to": p.value } as CSSProperties}>
              <span className="sr">
                {p.value}
                {p.suffix}
              </span>
              <span className="count" aria-hidden="true" />
              <span aria-hidden="true">{p.suffix}</span>
            </p>
            <span className="dimline" aria-hidden="true" />
            <p className="proof-label">{p.label}</p>
          </li>
        ))}
      </ul>
      <p className="mono footnote">
        <span className="fn-css">* Counters, rules and the header run on the browser&apos;s scroll timeline (CSS animation-timeline), without JavaScript.</span>
        <span className="fn-nocss">* Counters and rules show their final values in this browser.</span>
      </p>
    </section>
  );
}

export function Work() {
  return (
    <section id="work" className="sec sec-work" aria-labelledby="work-h">
      <div className="work-head">
        <SecHead i={2} title="Selected work" note="5 SHEETS · PLAN → BUILD → SHIP" />
      </div>
      {labFacts.work.map((w, i) => (
        <ProjectSheet key={w.slug} work={w} n={i + 1} />
      ))}
      <div className="more">
        <h3 className="more-title mono">DRAWING INDEX · FURTHER WORK</h3>
        <table className="tbl tbl-more">
          <thead>
            <tr>
              <th scope="col">DWG NO</th>
              <th scope="col">TITLE</th>
              <th scope="col">NOTE</th>
            </tr>
          </thead>
          <tbody>
            {labFacts.more.map((m, i) => (
              <tr key={m.href} className="row-link">
                <td className="mono">B-{String(labFacts.work.length + i + 1).padStart(2, "0")}</td>
                <th scope="row">
                  <a href={m.href}>{m.title}</a>
                </th>
                <td>{m.line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Where each capability is actually used: derived from the stack lists of the work items. */
function usedIn(item: string): string[] {
  const key = item.toLowerCase();
  const manual: Record<string, string[]> = { "on-device camera & pose analysis": ["Posme", labFacts.work.find((w) => w.slug === "rommer")?.title ?? ""] };
  if (manual[key]) return manual[key];
  return labFacts.work
    .filter((w) =>
      w.stack.some((s) => {
        const t = s.toLowerCase();
        return t === key || key.startsWith(t + " ") || t.startsWith(key + " ");
      }),
    )
    .map((w) => w.title);
}

export function Capabilities() {
  return (
    <section id="capabilities" className="sec" aria-labelledby="capabilities-h">
      <SecHead i={3} title="Capabilities" note="BILL OF MATERIALS" />
      <table className="tbl tbl-bom">
        <thead>
          <tr>
            <th scope="col">ITEM</th>
            <th scope="col">COMPONENT</th>
            <th scope="col">QTY/NOTE</th>
          </tr>
        </thead>
        {labFacts.capabilities.map((g, gi) => (
          <tbody key={g.title}>
            <tr className="grp">
              <th colSpan={3} scope="colgroup" className="mono">
                C-0{gi + 1} · {g.title.toUpperCase()}
              </th>
            </tr>
            {g.items.map((it, k) => {
              const u = usedIn(it);
              return (
                <tr key={it}>
                  <td className="mono">C-0{gi + 1}.{k + 1}</td>
                  <th scope="row">{it}</th>
                  <td className="mono note-cell">{u.length ? `×${u.length} · ${u.join(", ")}` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </section>
  );
}

export function Experience() {
  const rows = [...labFacts.experience].sort((a, b) => Number(b.from) - Number(a.from));
  const letters = "ABCDEFGH";
  return (
    <section id="experience" className="sec" aria-labelledby="experience-h">
      <SecHead i={5} title="Experience" note="REVISION HISTORY" />
      <table className="tbl tbl-rev">
        <thead>
          <tr>
            <th scope="col">REV</th>
            <th scope="col">YEARS</th>
            <th scope="col">COMPANY</th>
            <th scope="col">ROLE</th>
            <th scope="col">DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.company}>
              <td className="mono">REV {letters[rows.length - 1 - i]}</td>
              <td className="mono">{r.from === r.to ? r.from : `${r.from} – ${r.to}`}</td>
              <th scope="row">{r.company}</th>
              <td>{r.role}</td>
              <td>{r.line}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function AiSection() {
  const ai = labFacts.ai;
  return (
    <section id="ai" className="sec" aria-labelledby="ai-h">
      <header className="sec-head">
        <p className="mono sec-ref">A-05</p>
        <h2 id="ai-h" className="sec-title">
          {ai.title}
        </h2>
        <p className="mono sec-note">SPEC · SCHEMATIC</p>
        <span className="rule" aria-hidden="true" />
      </header>
      <p className="ai-intro">{ai.intro}</p>

      <h3 className="ai-sub mono">IN THE PRODUCTS</h3>
      <ul className="ai-prod">
        {ai.inProducts.map((p) => (
          <li key={p.product}>
            <span className="ai-prod-name">{p.product}</span>
            <span className="ai-prod-line">{p.line}</span>
          </li>
        ))}
      </ul>

      <h3 className="ai-sub mono">IN THE WORKFLOW · 4 STAGES</h3>
      <ol className="pipe">
        {ai.workflow.map((w, i) => (
          <li key={w.step} style={{ "--i": i } as CSSProperties}>
            <span className="pipe-node mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="pipe-wire" aria-hidden="true" />
            <h4>{w.step}</h4>
            <p>{w.line}</p>
          </li>
        ))}
      </ol>

      <div className="sys">
        <div className="sys-core">
          <p className="mono sys-tag">SYSTEM · 5 COMPONENTS</p>
          <h3 className="sys-title">{ai.system.title}</h3>
          <p className="sys-intro">{ai.system.intro}</p>
        </div>
        <ul className="sys-parts">
          {ai.system.parts.map((p, i) => (
            <li key={p.name}>
              <span className="sys-tap" aria-hidden="true" />
              <span className="sys-id mono">S-{i + 1}</span>
              <h4>{p.name}</h4>
              <p>{p.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
