export type Theme = "dark" | "light";
export const THEME_KEY = "theme";

export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === "dark" || stored === "light") return stored;
  return prefersDark ? "dark" : "light";
}

// Blocking inline script. Only the storage read is guarded: a throwing
// localStorage must still resolve from the system preference, never "dark".
export const THEME_SCRIPT = `(function(){var s=null;try{s=localStorage.getItem(${JSON.stringify(THEME_KEY)});}catch(e){}var d=false;try{d=matchMedia("(prefers-color-scheme: dark)").matches;}catch(e){}var t=(s==="dark"||s==="light")?s:(d?"dark":"light");document.documentElement.setAttribute("data-theme",t);})();`;
