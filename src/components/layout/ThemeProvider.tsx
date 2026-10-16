"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { THEME_KEY, type Theme } from "@/lib/theme";

type Origin = { x: number; y: number };
type ThemeContextValue = { theme: Theme; setTheme: (next: Theme, origin?: Origin) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

const SWITCHING_ATTR = "data-theme-switching";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

function apply(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // storage unavailable (private mode, blocked): the theme still applies for this page view
  }
  listeners.forEach((l) => l());
}

function changeTheme(next: Theme, origin?: Origin) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced || !origin) {
    apply(next);
    return;
  }
  const r = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
  // Marks this transition as a theme switch, so the circular reveal (not the route crossfade) owns the root.
  document.documentElement.setAttribute(SWITCHING_ATTR, "");
  const vt = document.startViewTransition(() => apply(next));
  const clear = () => document.documentElement.removeAttribute(SWITCHING_ATTR);
  vt.finished.then(clear, clear);
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${r}px at ${origin.x}px ${origin.y}px)`] },
      { duration: 500, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
    );
  }).catch(() => {
    // transition skipped (rapid second click, hidden document): the update callback already applied the theme
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setTheme = useCallback((next: Theme, origin?: Origin) => changeTheme(next, origin), []);
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
