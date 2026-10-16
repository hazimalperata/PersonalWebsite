"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { labFacts } from "@/lab/facts";
import { SECTIONS } from "./sectionList";

interface Cmd {
  id: string;
  group: string;
  label: string;
  hint: string;
  run: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  smooth: boolean;
}

/** Hand-built command palette: dialog role, focus trapped, Esc closes, arrow keys + Enter. */
export function CommandPalette(props: Props) {
  // Mount a fresh body per opening so query and selection reset without effects.
  return props.open ? <PaletteBody {...props} /> : null;
}

function PaletteBody({ onClose, onToast, smooth }: Props) {
  const router = useRouter();
  const uid = useId();
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const opener = useRef<Element | null>(null);

  const go = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    },
    [smooth],
  );

  const cmds = useMemo<Cmd[]>(() => {
    const out: Cmd[] = [];
    SECTIONS.forEach((s) => out.push({ id: `s-${s.id}`, group: "Go to", label: s.label, hint: s.ref, run: () => go(s.id) }));
    labFacts.work.forEach((w) => {
      if (w.href) out.push({ id: `w-${w.slug}`, group: "Case study", label: w.title, hint: w.kind, run: () => router.push(w.href!) });
    });
    out.push({
      id: "copy",
      group: "Actions",
      label: "Copy email address",
      hint: labFacts.email,
      run: () => {
        navigator.clipboard
          .writeText(labFacts.email)
          .then(() => onToast("Email copied"))
          .catch(() => onToast(labFacts.email));
      },
    });
    out.push({
      id: "cv",
      group: "Actions",
      label: "Download CV",
      hint: "PDF",
      run: () => {
        const a = document.createElement("a");
        a.href = labFacts.cv;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        a.remove();
      },
    });
    const gh = labFacts.social.find((s) => s.name === "GitHub");
    if (gh) out.push({ id: "gh", group: "Actions", label: "Open GitHub", hint: "github.com/hazimalperata", run: () => window.open(gh.href, "_blank", "noopener,noreferrer") });
    return out;
  }, [go, router, onToast]);

  const shown = useMemo(() => {
    const t = query.trim().toLowerCase();
    return t ? cmds.filter((c) => `${c.group} ${c.label} ${c.hint}`.toLowerCase().includes(t)) : cmds;
  }, [cmds, query]);

  useEffect(() => {
    opener.current = document.activeElement;
    const r = requestAnimationFrame(() => input.current?.focus());
    return () => {
      cancelAnimationFrame(r);
      if (opener.current instanceof HTMLElement) opener.current.focus();
    };
  }, []);

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [sel, shown]);

  const run = (c: Cmd | undefined) => {
    if (!c) return;
    onClose();
    // let the dialog unmount (and focus restore) before navigating
    window.setTimeout(c.run, 30);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => (shown.length ? (s + 1) % shown.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => (shown.length ? (s - 1 + shown.length) % shown.length : 0));
    } else if (e.key === "Enter" && document.activeElement === input.current) {
      e.preventDefault();
      run(shown[sel]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      (document.activeElement === input.current ? closeBtn.current : input.current)?.focus();
    }
  };

  let lastGroup = "";
  return (
    <div className="pal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pal" role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={onKey}>
        <div className="pal-top">
          <span className="mono pal-prompt" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={input}
            className="pal-input mono"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${uid}-list`}
            aria-activedescendant={shown[sel] ? `${uid}-${shown[sel].id}` : undefined}
            aria-label="Type a command"
            placeholder="Type a command or section…"
            value={query}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setQuery(e.target.value);
              setSel(0);
            }}
          />
          <button ref={closeBtn} type="button" className="pal-esc mono" onClick={onClose} aria-label="Close command palette">
            ESC
          </button>
        </div>
        <ul ref={list} id={`${uid}-list`} role="listbox" aria-label="Commands" className="pal-list">
          {shown.length === 0 && <li className="pal-empty mono">No match</li>}
          {shown.map((c, i) => {
            const head = c.group !== lastGroup;
            lastGroup = c.group;
            return (
              <li
                key={c.id}
                id={`${uid}-${c.id}`}
                role="option"
                aria-selected={i === sel}
                className="pal-item"
                onMouseMove={() => sel !== i && setSel(i)}
                onClick={() => run(c)}
              >
                <span className="pal-group mono" aria-hidden={!head}>
                  {head ? c.group : ""}
                </span>
                <span className="pal-label">{c.label}</span>
                <span className="pal-hint mono">{c.hint}</span>
              </li>
            );
          })}
        </ul>
        <p className="pal-foot mono" aria-hidden="true">
          ↑↓ select · ↵ run · esc close
        </p>
      </div>
    </div>
  );
}
