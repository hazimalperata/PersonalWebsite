# hazimalperata.com yeniden tasarım — uygulama planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kişisel siteyi "Yörüngeden" konseptiyle sıfırdan kurmak: R3F dünya hero'su, kaydırmaya bağlı kamera, EN/TR, koyu/açık tema, MDX proje sayfaları, premium tipografi, Lighthouse mobil ≥ 90.

**Architecture:** Next 16.4 App Router, `src/app/[locale]/` kök düzen (next-intl 4, `as-needed` önek), Tailwind 4 `@theme` token'ları, tek R3F canvas'ı `position: fixed` arkada ve GSAP ScrollTrigger scrub ile kamera; içerik `content/projects/*.{en,tr}.mdx` + `data/profile.ts`; tema elle `data-theme`.

**Tech Stack:** next 16.4, react 19.3, tailwindcss 4.3, next-intl 4.14, @react-three/fiber 9.8, @react-three/drei 10.7, @react-three/postprocessing 3.2, three 0.186, gsap 3.15 + @gsap/react, motion 14, lenis 1.3, next-mdx-remote 6, gray-matter, vitest, @playwright/test, sharp (script).

**Spec:** `docs/superpowers/specs/2026-10-16-site-redesign-design.md` (uygulayıcı önce spec'i okur; token, renk, hareket kuralları orada). Teknik dayanaklar: `docs/research/research-stack.md`.

## Global Constraints

- Ücretli hiçbir paket, servis, font yok. Fontlar: Syne, Geist, Geist Mono (`next/font/google`, `subsets: ['latin','latin-ext']`).
- Sürüm tabanı: next ≥ 16.4.0, react ≥ 19.3.0. R3F 9.x (v10 alpha yasak). `motion` paketi (`framer-motion` yok). Once UI, sass, `@next/mdx` yok.
- Next 16: `middleware.ts` değil `src/proxy.ts`; `next lint` yok, `eslint .`; `params` ve `searchParams` `await` edilir; Turbopack varsayılan, webpack config yok.
- Renk token'ları spec §3 tablosundan birebir (`#0B1628`, `#111F36`, `#E8EEF6`, `#8A9BB5`, `#8CCBFF`, `#F0B35B`; açık `#F3F6FA`, `#E8EDF4`, `#0E1A2B`, `#51627A`, `#1F6FD8`, `#D9922E`). Amber yalnız sahne ve tek CTA.
- Tipografi yasakları: BÜYÜK HARF etiket yok, "01/02/03" yalnız deneyim zaman çizelgesi, link sonuna "→" yok, gradient metin yok, mono yalnız hero telemetri şeridi.
- Hareket: tek yükleme orkestrasyonu (hero), diğer bölümlerde giriş animasyonu yok; hover yalnız iş görseli, bağlantı, düğme; süre mikro 150–200 ms, geçiş 300–500 ms, eğri `cubic-bezier(.4,0,.2,1)`; `prefers-reduced-motion` her katmanda. `hazim:hareket` skill'i her UI görevinde okunur.
- Kullanıcıya görünen metinde iç bilgi yok (sürüm, kütüphane adı, HTTP kodu). Footer'da yalnız "© 2026 Hazim Alper Ata".
- Tüm UI metinleri `messages/en.json` ve `messages/tr.json`'da; JSX'te sabit metin yok. TR metinleri uygulayıcı taslaklar, Hazım düzeltir.
- Commit mesajları İngilizce, `feat:`/`chore:`/`test:` öneki, sonunda `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Windows/Git Bash: çok satırlı dosyalar `Write` ile; `yarn` 1 (`yarn add`, `yarn remove`); kapı sonuçları boruya sokulmadan okunur (`cmd > log 2>&1; echo $?`).
- Dal `redesign`. `master`'a push yok.

## Review Focus

1. **Doku yüklenemezse** (ağ hatası, WebGL yok) sayfa başlık ve içerikle çalışır, poster görünür; konsolda yakalanmamış hata yok. Test: Task 7 (`EarthCanvas` hata sınırı testi).
2. **`prefers-reduced-motion: reduce`** ile canvas hiç bağlanmaz, Lenis kapalı, SplitText yok, tema geçişi anında. Test: Task 5 (`capabilities` birim testi) + Task 14 (Playwright `reducedMotion: 'reduce'`).
3. **TR MDX eksik** proje `/tr/work/<slug>` EN içerikle ve "Bu sayfa İngilizce" notuyla açılır, 404 vermez. Test: Task 4 (`getProject` fallback birim testi) + Task 12.
4. **Tema çerezi/localStorage bozuk ya da erişilemez** (gizli pencere) → sistem temasına düşer, flash yok, hata yok. Test: Task 3 (head script `try/catch`, birim testi `resolveTheme`).
5. **Bilinmeyen rota** (`/xyz`, `/tr/xyz`, `/en`) → doğru locale'de 404 sayfası; `/en` → `/` yönlenir. Test: Task 2 (Playwright değil, `next build` + `curl` ile Task 14 smoke).

---

## Dalga planı (paralellik)

| Dalga | Görevler | Not |
| --- | --- | --- |
| 0 | T1 | Tek ajan; her şey buna bağlı |
| 1 | T2, T3, T5 | Paralel (3 ajan). T2 i18n, T3 tema, T5 doku + yetenek |
| 2 | T4, T6 | Paralel. T4 içerik katmanı, T6 kabuk (Header/Footer/ui) |
| 3 | T7, T8, T9 | Paralel. T7 dünya sahnesi, T8 hero, T9 seçili işler |
| 4 | T10, T11, T12 | Paralel. About+Contact, Gallery, proje sayfası |
| 5 | T13 | Tek ajan: sayfa birleştirme, kaydırma koreografisi, preloader |
| 6 | T14 | Kalite kapısı: Playwright, Lighthouse, görsel tur, belgeler |

Her dalgada ≤ 3 ajan (hesap sınırı dersi). Uygulayıcı Sonnet; inceleme ilk kalıpta Sonnet, tekrarda Haiku.

---

### Task 1: Bağımlılık yükseltme, Tailwind 4, fontlar ve boş iskelet

**Files:**
- Modify: `package.json`, `next.config.mjs`, `eslint.config.mjs`, `tsconfig.json`, `.gitignore`, `global.d.ts`
- Create: `postcss.config.mjs`, `src/app/globals.css`, `src/lib/fonts.ts`, `src/lib/cn.ts`, `vitest.config.ts`, `playwright.config.ts`
- Delete: `src/app/(main)/**`, `src/app/earth/**`, `src/app/animation/**`, `src/components/**` (hepsi), `src/resources/**`, `src/types/**`, `src/utils/**`, `components.json`, `tsconfig.tsbuildinfo`
- Keep: `src/app/api/og/**`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/favicon.ico`, `public/**` (MDX dosyaları Task 4'te `content/`e taşınır; silmeden önce `git mv` ile `content/projects/` altına taşı, uzantı `.en.mdx`)

**Interfaces:**
- Produces: `src/lib/fonts.ts` → `export const fontDisplay, fontBody, fontMono` (`NextFontWithVariable`; CSS değişkenleri `--font-display`, `--font-body`, `--font-mono`). `src/lib/cn.ts` → `cn(...inputs: ClassValue[]): string` (clsx). `globals.css` → `@theme` token'ları: `--color-bg`, `--color-bg-2`, `--color-fg`, `--color-fg-2`, `--color-accent`, `--color-amber`; `[data-theme]` ile değişir.

- [ ] **Step 1: Eski ağacı taşı/sil**

```bash
cd /c/Users/hazim/WebstormProjects/personal-website
mkdir -p content/projects
for f in "src/app/(main)/work/projects/"*.mdx; do b=$(basename "$f" .mdx); git mv "$f" "content/projects/$b.en.mdx"; done
git rm -r -q "src/app/(main)" src/app/earth src/app/animation src/components src/resources src/types src/utils components.json
git rm -q --cached tsconfig.tsbuildinfo 2>/dev/null; rm -f tsconfig.tsbuildinfo
git rm -q src/app/layout.tsx src/app/not-found.tsx
```

- [ ] **Step 2: Paketleri değiştir**

```bash
yarn remove @once-ui-system/core framer-motion sass three-stdlib @next/mdx @mdx-js/loader classnames @tanstack/eslint-plugin-query cookie @types/cookie transliteration tzdata
yarn add next@^16.4.0 react@^19.3.0 react-dom@^19.3.0 next-intl@^4.14.0 tailwindcss@^4.3.0 @tailwindcss/postcss@^4.3.0 @tailwindcss/typography@^0.5.16 @react-three/fiber@^9.8.0 @react-three/drei@^10.7.0 @react-three/postprocessing@^3.2.0 three@^0.186.0 motion@^14.3.0 gsap@^3.15.0 @gsap/react@^2.1.0 lenis@^1.3.0 clsx@^2.1.1 lucide-react@latest
yarn add -D @types/three@^0.186.0 @types/react@^19.3.0 @types/react-dom@^19.3.0 eslint-config-next@^16.4.0 vitest@^3 @vitest/coverage-v8@^3 @playwright/test@^1.50 sharp@^0.34 @types/node@^24
yarn why @next/mdx 2>/dev/null | head -3   # kalıntı yoksa boş
```

`package.json` scripts:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "e2e": "playwright test",
  "textures": "node scripts/textures.mjs",
  "gate": "yarn typecheck && yarn lint && yarn test && yarn build"
}
```

`eslint.config.mjs`: `pluginQuery` import'unu ve `...pluginQuery.configs[...]` satırını kaldır; `globalIgnores`'a `'playwright-report/**', 'test-results/**', 'scripts/**'` ekle.

`.gitignore`'a ekle: `/playwright-report`, `/test-results`, `/docs/perf/*.html`.

`global.d.ts` (next-intl tip güvenliği):

```ts
import en from "./messages/en.json";
declare module "next-intl" {
  interface AppConfig {
    Messages: typeof en;
    Locale: "en" | "tr";
  }
}
```

`messages/en.json` ve `messages/tr.json` dosyalarını `{}` ile oluştur (Task 2 doldurur).

- [ ] **Step 3: next.config.mjs**

```js
/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/(textures|posters)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};
export default withNextIntl(nextConfig);
```

`src/i18n/request.ts` geçici olarak (Task 2 gerçek hâlini yazar):

```ts
import { getRequestConfig } from "next-intl/server";
export default getRequestConfig(async () => ({ locale: "en", messages: {} }));
```

- [ ] **Step 4: Tailwind 4 ve token'lar**

`postcss.config.mjs`:

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

`src/app/globals.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-bg: #0b1628;
  --color-bg-2: #111f36;
  --color-fg: #e8eef6;
  --color-fg-2: #8a9bb5;
  --color-accent: #8ccbff;
  --color-amber: #f0b35b;
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);
  --text-xs: 0.875rem;
  --text-base: 1.0625rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5625rem;
  --text-2xl: 1.95rem;
  --text-3xl: 2.44rem;
  --text-4xl: 3.05rem;
  --ease-out-quart: cubic-bezier(0.4, 0, 0.2, 1);
  --container-site: 1440px;
}

:root[data-theme="light"] {
  --color-bg: #f3f6fa;
  --color-bg-2: #e8edf4;
  --color-fg: #0e1a2b;
  --color-fg-2: #51627a;
  --color-accent: #1f6fd8;
  --color-amber: #d9922e;
  color-scheme: light;
}
:root[data-theme="dark"] { color-scheme: dark; }

html { background: var(--color-bg); color: var(--color-fg); }
body { font-family: var(--font-body); line-height: 1.6; -webkit-font-smoothing: antialiased; }
h1, h2, h3 { font-family: var(--font-display); letter-spacing: -0.02em; line-height: 1; }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }

::view-transition { pointer-events: none; }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
```

Tailwind `@theme` içindeki `--color-*` değerleri `:root[data-theme="light"]`'ta ezildiğinde Tailwind sınıfları (`bg-bg`, `text-fg`) değişkeni okuduğu için tema otomatik değişir (Tailwind 4 `@theme` değişkenleri `var()` olarak derlenir; doğrulamak için `yarn build` sonrası `.next` CSS'inde `var(--color-bg)` ara).

- [ ] **Step 5: Fontlar ve cn**

`src/lib/fonts.ts`:

```ts
import { Geist, Geist_Mono, Syne } from "next/font/google";

export const fontDisplay = Syne({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});
export const fontBody = Geist({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});
export const fontMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});
```

`src/lib/cn.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
export const cn = (...inputs: ClassValue[]) => clsx(inputs);
```

- [ ] **Step 6: Geçici iskelet (Task 2 gerçek düzene çevirir)**

`src/app/[locale]/layout.tsx`:

```tsx
import "../globals.css";
import { fontBody, fontDisplay, fontMono } from "@/lib/fonts";
import { cn } from "@/lib/cn";

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning className={cn(fontDisplay.variable, fontBody.variable, fontMono.variable)}>
      <body className="min-h-dvh bg-bg text-fg">{children}</body>
    </html>
  );
}
```

`src/app/[locale]/page.tsx`:

```tsx
export default function Home() {
  return <main className="p-6"><h1 className="font-display text-4xl">Hazim Alper Ata</h1></main>;
}
```

`src/app/api/og/generate/route.tsx` içindeki `@/resources` import'unu kaldır; `baseURL = "https://hazimalperata.com"` ve `person = { name: "Hazim Alper Ata" }` sabitlerini `src/lib/site.ts`'e koy:

```ts
export const siteUrl = "https://hazimalperata.com";
export const siteName = "Hazim Alper Ata";
```

`robots.ts` ve `sitemap.ts` de `@/resources` yerine `@/lib/site`'ı kullanır (sitemap şimdilik `/` ve `/tr`; Task 12 projeleri ekler).

- [ ] **Step 7: Test altyapısı**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  test: { include: ["src/**/*.test.ts", "src/**/*.test.tsx"], environment: "node" },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```

`playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  webServer: { command: "yarn start -p 3210", port: 3210, reuseExistingServer: true, timeout: 120_000 },
  use: { baseURL: "http://localhost:3210" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
```

`npx playwright install chromium` çalıştır.

- [ ] **Step 8: Kapı**

```bash
yarn typecheck > /tmp/tc.log 2>&1; echo $?; tail -n 20 /tmp/tc.log
yarn lint > /tmp/lint.log 2>&1; echo $?; tail -n 20 /tmp/lint.log
yarn build > /tmp/build.log 2>&1; echo $?; tail -n 30 /tmp/build.log
```

Üçü de 0. `next build` çıktısında `/[locale]` statik görünmeli.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "chore: upgrade to Next 16.4, Tailwind 4, remove Once UI, scaffold locale layout"
```

---

### Task 2: next-intl yönlendirme, mesajlar, dil anahtarı

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/proxy.ts`, `src/app/[locale]/[...rest]/page.tsx`, `src/app/[locale]/not-found.tsx`, `src/components/layout/LocaleSwitch.tsx`, `src/i18n/routing.test.ts`
- Modify: `src/i18n/request.ts`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `messages/en.json`, `messages/tr.json`, `src/app/sitemap.ts`

**Interfaces:**
- Produces: `routing` (`locales: ['en','tr']`, `defaultLocale: 'en'`, `localePrefix: 'as-needed'`); `Link`, `useRouter`, `usePathname`, `redirect`, `getPathname` from `@/i18n/navigation`; `LocaleSwitch` client bileşeni (prop yok); `messages/*.json` namespace'leri: `nav`, `hero`, `work`, `about`, `gallery`, `contact`, `footer`, `project`, `notFound`, `theme`, `preloader`, `a11y`.

- [ ] **Step 1: routing/navigation/request/proxy**

`src/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";
export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
export type AppLocale = (typeof routing.locales)[number];
```

`src/i18n/navigation.ts`:

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
```

`src/i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default };
});
```

(next-intl 4.14 belgesinde `requestLocale` hâlâ geçerli; `next/root-params` yolu `docs/research/research-stack.md` §4'te "unverified" işaretli, bu yüzden belgeli yol seçildi. `node_modules/next-intl/README.md` ve `node_modules/next-intl/dist/types/...` içinde `requestLocale` adını doğrula.)

`src/proxy.ts`:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
export default createMiddleware(routing);
export const config = { matcher: "/((?!api|_next|_vercel|.*\\..*).*)" };
```

- [ ] **Step 2: Layout ve sayfalar**

`src/app/[locale]/layout.tsx` (Task 1 iskeletini genişlet):

```tsx
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { fontBody, fontDisplay, fontMono } from "@/lib/fonts";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale} suppressHydrationWarning className={cn(fontDisplay.variable, fontBody.variable, fontMono.variable)}>
      <body className="min-h-dvh bg-bg text-fg">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

`src/app/[locale]/page.tsx`: `setRequestLocale(locale)` çağırır, `getTranslations('hero')` ile `t('name')` basar. `generateMetadata` `getTranslations('meta')` ile `title`, `description`, `alternates: { languages: { en: '/', tr: '/tr' } }` döner.

`src/app/[locale]/[...rest]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
export default function CatchAll() { notFound(); }
```

`src/app/[locale]/not-found.tsx`: `useTranslations('notFound')` ile başlık + ana sayfa bağlantısı (`Link href="/"`).

- [ ] **Step 3: Mesajlar**

`messages/en.json` tam iskelet (TR'si aynı anahtarlarla Türkçe):

```json
{
  "meta": { "title": "Hazim Alper Ata · Frontend & mobile engineer", "description": "Frontend and mobile engineer building products from idea to production with React, Next.js and React Native." },
  "nav": { "work": "Work", "about": "About", "gallery": "Gallery", "contact": "Contact", "skip": "Skip to content", "menu": "Menu" },
  "hero": { "name": "Hazim Alper Ata", "role": "Frontend & mobile engineer", "line": "building products from idea to production.", "location": "Bursa", "openToWork": "open to work", "cta": "Say hi", "scroll": "Scroll" },
  "work": { "title": "Selected work", "all": "All work", "view": "View project", "year": "Year", "stack": "Built with" },
  "about": { "title": "About", "experience": "Experience", "education": "Education", "skills": "Skills", "present": "Present" },
  "gallery": { "title": "Gallery", "open": "Open photo", "close": "Close", "prev": "Previous photo", "next": "Next photo" },
  "contact": { "title": "Let's talk", "email": "Write me", "cvEn": "CV (English)", "cvTr": "CV (Turkish)", "localTime": "Local time in Bursa" },
  "footer": { "rights": "© {year} Hazim Alper Ata", "top": "Back to top" },
  "project": { "back": "All work", "role": "Role", "year": "Year", "link": "Visit", "status": "Status", "prev": "Previous", "next": "Next", "englishOnly": "This page is available in English only." , "completed": "Completed", "inProgress": "In progress", "planned": "Planned" },
  "notFound": { "title": "This page drifted off orbit.", "home": "Back home" },
  "theme": { "toggle": "Switch to {theme} theme", "dark": "dark", "light": "light" },
  "locale": { "switch": "Türkçe", "label": "Language" },
  "preloader": { "label": "Loading" }
}
```

TR: `"locale": { "switch": "English", "label": "Dil" }`, `"notFound": { "title": "Bu sayfa yörüngeden çıktı.", "home": "Ana sayfa" }`, diğerleri doğal Türkçe.

- [ ] **Step 4: LocaleSwitch**

```tsx
"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitch() {
  const locale = useLocale();
  const t = useTranslations("locale");
  const pathname = usePathname();
  const router = useRouter();
  const next = locale === "en" ? "tr" : "en";
  return (
    <button type="button" aria-label={t("label")} className="text-xs text-fg-2 hover:text-fg" onClick={() => router.replace(pathname, { locale: next })}>
      {t("switch")}
    </button>
  );
}
```

- [ ] **Step 5: Test**

`src/i18n/routing.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { routing } from "./routing";
describe("routing", () => {
  it("defaults to English without prefix", () => {
    expect(routing.defaultLocale).toBe("en");
    expect(routing.localePrefix).toBe("as-needed");
    expect(routing.locales).toEqual(["en", "tr"]);
  });
});
```

`yarn test` geçer. `yarn build` sonra `yarn start -p 3210` ile: `curl -sI localhost:3210/en | head -1` → 307 ve `location: /`; `curl -s localhost:3210/tr | grep 'lang="tr"'` dolu; `curl -sI localhost:3210/xyz | head -1` → 404.

- [ ] **Step 6: Commit** `feat: add next-intl routing, messages and locale switch`

---

### Task 3: Tema sağlayıcı, engelleyici script, dairesel geçişli düğme

**Files:**
- Create: `src/lib/theme.ts`, `src/lib/theme.test.ts`, `src/components/layout/ThemeProvider.tsx`, `src/components/layout/ThemeScript.tsx`, `src/components/layout/ThemeToggle.tsx`
- Modify: `src/app/[locale]/layout.tsx` (head'e `<ThemeScript />`, body'ye `<ThemeProvider>`), `src/app/globals.css`

**Interfaces:**
- Produces: `type Theme = 'dark' | 'light'`; `resolveTheme(stored: string | null, prefersDark: boolean): Theme`; `useTheme(): { theme: Theme; setTheme(next: Theme, origin?: { x: number; y: number }): void }`; DOM: `<html data-theme="dark|light">`; `localStorage` anahtarı `theme`.

- [ ] **Step 1: Saf fonksiyon + test**

`src/lib/theme.ts`:

```ts
export type Theme = "dark" | "light";
export const THEME_KEY = "theme";
export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === "dark" || stored === "light") return stored;
  return prefersDark ? "dark" : "light";
}
```

`src/lib/theme.test.ts`: `resolveTheme('light', true) === 'light'`, `resolveTheme(null, true) === 'dark'`, `resolveTheme('garbage', false) === 'light'`.

- [ ] **Step 2: Engelleyici script (Server Component)**

`ThemeScript.tsx`:

```tsx
const script = `(function(){try{var s=localStorage.getItem("theme");var d=matchMedia("(prefers-color-scheme: dark)").matches;var t=(s==="dark"||s==="light")?s:(d?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
```

- [ ] **Step 3: Provider**

`ThemeProvider.tsx` (`"use client"`): `useSyncExternalStore` ile `document.documentElement.dataset.theme` okur (server snapshot `'dark'`); `setTheme(next, origin)`:

```ts
function apply(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem(THEME_KEY, next); } catch {}
  listeners.forEach((l) => l());
}
function setTheme(next: Theme, origin?: { x: number; y: number }) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced || !origin) { apply(next); return; }
  const r = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
  const vt = document.startViewTransition(() => apply(next));
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${r}px at ${origin.x}px ${origin.y}px)`] },
      { duration: 500, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}
```

`globals.css`'e: `::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }`.

- [ ] **Step 4: Toggle**

`ThemeToggle.tsx`: `button` `aria-label={t('theme.toggle', { theme: next })}`, `onClick={(e) => setTheme(next, { x: e.clientX, y: e.clientY })}`; ikon `lucide-react` `Sun`/`Moon` (20px), ikon geçişi 200 ms opacity+rotate (`motion`'sız, CSS). Klavye ile tetiklenince `clientX` 0 olur; o zaman `origin` olarak düğmenin `getBoundingClientRect()` merkezini kullan.

- [ ] **Step 5: Doğrula**

`yarn test` geçer; `yarn dev` ile ana sayfada düğme `data-theme` değiştirir, yenilemede kalır, flash yok (DevTools'ta "Disable cache" + yenile). Commit `feat: add theme provider with view-transition reveal`.

---

### Task 4: İçerik katmanı (profil verisi, MDX okuma, locale fallback)

**Files:**
- Create: `src/data/profile.ts`, `src/lib/content.ts`, `src/lib/content.test.ts`, `src/components/mdx/mdx-components.tsx`, `content/projects/*.tr.mdx` (en az 5 öne çıkan proje için TR taslak), `content/README.md`
- Modify: `content/projects/*.en.mdx` (frontmatter'a `featured`, `order`, `role`, `stack`, `year` ekle)

**Interfaces:**
- Produces:
  ```ts
  export type ProjectStatus = "completed" | "inProgress" | "planned";
  export interface ProjectMeta { slug: string; locale: "en" | "tr"; fallback: boolean; title: string; summary: string; publishedAt: string; year: string; images: string[]; cover: string; link?: string; status: ProjectStatus; role: string; stack: string[]; featured: boolean; order: number; }
  export async function getProjects(locale: AppLocale): Promise<ProjectMeta[]>;        // order asc, sonra publishedAt desc
  export async function getProject(slug: string, locale: AppLocale): Promise<{ meta: ProjectMeta; content: string } | null>; // TR yoksa EN, fallback: true
  export async function getProjectSlugs(): Promise<string[]>;
  ```
  `src/data/profile.ts`: `profile = { name, email, location: { city: 'Bursa', lat: 40.19, lon: 29.06, tz: 'Europe/Istanbul' }, social: [{ name, href, icon }], cv: { en: '/Hazim_Alper_Ata-EN-CV.pdf', tr: '/Hazim_Alper_Ata-TR-CV.pdf' }, experience: Array<{ company; role: L; from: string; to: string | null; points: L[] }>, education: Array<{ name: L; description: L }>, skills: Array<{ title: L; items: string[] }> }` where `type L = { en: string; tr: string }`, ve `pick(l: L, locale)`.
  `MdxContent({ source, locale })` server bileşeni (`next-mdx-remote/rsc` `MDXRemote`, bileşen haritası: `img` → `next/image` sarmalı `Figure`, `a` → `Link` dış bağlantı `target=_blank rel=noreferrer`).

- [ ] **Step 1: Frontmatter genişlet** (`featured`/`order`: 1likte Web Experience 1, Seller Panel 2, Mobile Application 3, The Pale Blue Dot 4, DUHA Architects 5; diğerleri `featured: false`). `status` küçük harf (`completed|inProgress|planned`). `year` örn. `"2024–2026"`. `role` örn. `"Frontend lead"`. `stack` dizi. The Pale Blue Dot'un `link`'ini kaldır (sayfa artık yok).

- [ ] **Step 2: Test önce**

```ts
import { describe, expect, it } from "vitest";
import { getProject, getProjects } from "./content";
describe("content", () => {
  it("lists featured projects first by order", async () => {
    const list = await getProjects("en");
    const featured = list.filter((p) => p.featured).map((p) => p.order);
    expect(featured).toEqual([...featured].sort((a, b) => a - b));
    expect(list.length).toBe(9);
  });
  it("falls back to English when Turkish is missing", async () => {
    const p = await getProject("react-window-modals", "tr");
    expect(p?.meta.fallback).toBe(true);
    expect(p?.meta.locale).toBe("en");
  });
  it("returns null for unknown slug", async () => {
    expect(await getProject("nope", "en")).toBeNull();
  });
});
```

- [ ] **Step 3: Uygula** (`fs/promises`, `gray-matter`, dizin `process.cwd()/content/projects`; slug = dosya adının `.en.mdx`/`.tr.mdx` öncesi; `cover = images[0]`; `year` yoksa `publishedAt.slice(0,4)`). `getProjects` locale için `.tr.mdx` varsa onu, yoksa `.en.mdx`'i okur.

- [ ] **Step 4: TR taslakları** 5 öne çıkan proje için `.tr.mdx` yaz (başlık, özet, içerik Türkçe; frontmatter aynı alanlar). `content/README.md`: yeni proje ekleme (dosya adı, alanlar, görsel boyutları ≤ 1600px genişlik, WebP önerisi).

- [ ] **Step 5:** `yarn test` ve `yarn typecheck` 0. Commit `feat: add content layer with locale fallback and profile data`.

---

### Task 5: Doku hattı ve cihaz yetenek tespiti

**Files:**
- Create: `scripts/textures.mjs`, `src/lib/capabilities.ts`, `src/lib/capabilities.test.ts`, `public/textures/earth/2k/*.webp`, `public/textures/earth/4k/*.webp`, `public/posters/earth-dark.webp`, `public/posters/earth-light.webp` (poster: script 4k gündüz haritasından 1600×900 "ufuk" kırpımı üretir; iki tema için gündüz/gece haritası)
- Delete: `public/textures/earth/*.jpg` (10k kaynaklar; git geçmişinde kalır), `public/textures/blackhole/`, `public/audio/`

**Interfaces:**
- Produces: `type Tier = 'poster' | 'low' | 'high'`; `detectTier(env: CapEnv): Tier`; `readEnv(): CapEnv` (tarayıcıdan okur); `useTier(): Tier | null` (SSR'da `null`, mount sonrası değer; `prefers-reduced-motion` dinleyicisi). `CapEnv = { reducedMotion: boolean; coarsePointer: boolean; cores: number; memoryGb: number | null; saveData: boolean; webgl2: boolean; width: number }`. Doku yolları: `textureSet(tier: 'low'|'high') => { map, lights, clouds, cloudsAlpha, bump }` (`/textures/earth/2k|4k/<name>.webp`).

- [ ] **Step 1: Test**

```ts
it("poster when reduced motion", () => expect(detectTier({ ...base, reducedMotion: true })).toBe("poster"));
it("poster when no webgl2", () => expect(detectTier({ ...base, webgl2: false })).toBe("poster"));
it("low on coarse pointer or few cores", () => { expect(detectTier({ ...base, coarsePointer: true })).toBe("low"); expect(detectTier({ ...base, cores: 4 })).toBe("low"); });
it("high otherwise", () => expect(detectTier(base)).toBe("high"));
```

(`base = { reducedMotion: false, coarsePointer: false, cores: 8, memoryGb: 8, saveData: false, webgl2: true, width: 1440 }`). Kural: reducedMotion || !webgl2 || saveData → poster; coarsePointer || cores ≤ 4 || (memoryGb !== null && memoryGb ≤ 4) || width < 768 → low; aksi high.

- [ ] **Step 2: Script**

`scripts/textures.mjs` (sharp): girdi `public/textures/earth/8081earthmap10k.jpg` → `4k/day.webp` (4096×2048, q 80) ve `2k/day.webp` (2048×1024, q 78); `8081earthlights10k.jpg` → `lights`; `8k_earth_clouds.jpg` → `clouds`; `05_earthcloudmaptrans.jpg` → `clouds-alpha`; `8081earthbump10k.jpg` → `bump` (2k'da 1024×512). Poster: `4k/day.webp`'den 1600×900 kırpım (alt yarı, dünya ufku hissi için `extract` + hafif `modulate({ brightness: 0.9 })`), `earth-light.webp`; `lights` + koyu zemin bindirmesiyle `earth-dark.webp`. Çıktı boyutlarını bas. Hedef: 4k seti ≤ 6 MB, 2k seti ≤ 2 MB, posterler ≤ 150 KB (q düşürerek tuttur).

- [ ] **Step 3:** `yarn textures` çalıştır, boyutları `ls -la` ile doğrula, eski JPEG'leri ve `blackhole`, `audio` klasörlerini `git rm`. `yarn test` 0. Commit `feat: add texture pipeline, posters and device tier detection`.

---

### Task 6: Kabuk: Header, Footer, ui parçaları, hareket altyapısı, tanecik

**Files:**
- Create: `src/components/layout/Header.tsx`, `Footer.tsx`, `SkipLink.tsx`, `Grain.tsx`, `src/components/ui/Button.tsx`, `TextLink.tsx`, `Section.tsx`, `Container.tsx`, `src/lib/motion.ts`, `src/components/layout/SmoothScroll.tsx`, `src/components/layout/Providers.tsx`
- Modify: `src/app/[locale]/layout.tsx` (Providers, SkipLink, Header, Footer, Grain), `globals.css` (grain, header blur)

**Interfaces:**
- Produces: `Button({ href?, variant: 'primary'|'ghost', children })` (primary amber zemin, mürekkep metin; ghost çizgili); `TextLink` (alt çizgi 1px, hover'da 200 ms genişler); `Section({ id, title?, children })` (`<section id>` + `scroll-margin-top: 96px`, başlık `h2 text-3xl`); `Container` (max 1440, px 24/16). `lib/motion.ts`: `gsap`, `ScrollTrigger`, `SplitText` kaydı (`gsap.registerPlugin` bir kez, client-only), `export const ease = 'power3.out'`, `export const prefersReducedMotion(): boolean`. `SmoothScroll` (`ReactLenis root`, `autoRaf: false`, GSAP ticker'a bağlı, `(pointer: coarse)` ve reduced-motion'da kapalı). Header: `nav` çapa bağlantıları `#work #about #gallery #contact`, `LocaleSwitch`, `ThemeToggle`; kaydırınca `backdrop-blur` + `bg-bg/70`; mobilde yatay kaydırılabilir bağlantı şeridi (menü düğmesi yok, 4 bağlantı sığar).

- [ ] **Step 1: motion.ts ve SmoothScroll**

```ts
"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}
export const prefersReducedMotion = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
export { gsap, ScrollTrigger, SplitText };
```

`SmoothScroll.tsx`: `import { ReactLenis, useLenis } from 'lenis/react'`; `import 'lenis/dist/lenis.css'`; `useEffect`: `registerGsap(); lenis.on('scroll', ScrollTrigger.update); const tick = (t) => lenis.raf(t * 1000); gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0); return () => gsap.ticker.remove(tick)`. `options={{ autoRaf: false, anchors: true }}`; `enabled` = `!coarse && !reduced` (SSR'da render etmeden önce mount bekle).

- [ ] **Step 2: Grain**

`Grain.tsx`: `position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: .04; mix-blend-mode: overlay` ve arka plan `url("data:image/svg+xml,...feTurbulence baseFrequency='0.8' numOctaves='2'...")` 256px tekrar. Animasyonsuz.

- [ ] **Step 3: Header/Footer/ui**: Yukarıdaki arayüzlere göre yaz. Header `h-16`, logo `.hazim` (nokta amber, metin display 700). Footer: `t('footer.rights', {year})`, "Back to top" `TextLink` (`lenis.scrollTo(0)` yoksa `scrollTo`). Hover süreleri 200 ms, eğri `--ease-out-quart`.

- [ ] **Step 4: Layout'a bağla**, `yarn build` 0, `yarn dev`'de üst bar, tema, dil ve footer çalışır. Commit `feat: add site chrome, ui primitives and motion setup`.

---

### Task 7: Dünya sahnesi (R3F)

**Files:**
- Create: `src/components/three/EarthCanvas.tsx` (dynamic sarmalayıcı + ErrorBoundary + poster), `EarthScene.tsx` (Canvas), `Earth.tsx`, `Atmosphere.tsx`, `Clouds.tsx`, `Stars.tsx`, `SunLight.tsx`, `useSceneTheme.ts`, `scrollState.ts`, `Poster.tsx`, `EarthCanvas.test.tsx` (ErrorBoundary + poster; `@testing-library/react` + `jsdom` ekle: `yarn add -D @testing-library/react jsdom`, vitest `environmentMatchGlobs: [['src/components/**', 'jsdom']]`)
- Reference: eski sahne `git show master:src/components/earth/EarthScene.tsx` (ışık, bulut hızı, bump ölçeği değerleri oradan alınır)

**Interfaces:**
- Consumes: `useTier`, `textureSet` (T5); `useTheme` (T3).
- Produces: `EarthCanvas()` client bileşeni, prop yok; `position: fixed; inset: 0; z-index: 0; pointer-events: none`, `aria-hidden`, `view-transition-name: earth` (CSS: `::view-transition-group(earth) { animation: none }`). `scrollState = { progress: 0, visible: true }` (modül düzeyinde mutable nesne; T13 ScrollTrigger ile yazar). `useSceneTheme()` → `{ sunAngle: number (dark: 2.6 rad, light: 0.4 rad), atmosphere: THREE.Color, fade: number }` hedefleri; sahne `useFrame`'de `damp` ile 1 sn'de yaklaşır.

- [ ] **Step 1: Test** `EarthCanvas` içinde `tier === 'poster'` ise `<Poster/>` (`next/image`, `priority={false}`, tema'ya göre `earth-dark|light.webp`, `alt=""`) render edilir; `tier === null` (SSR) hiçbir şey render etmez; sahne hata fırlatırsa ErrorBoundary poster'a düşer (test: `vi.mock('./EarthScene', () => ({ default: () => { throw new Error('gl') } }))`).

- [ ] **Step 2: Sahne**

`EarthScene.tsx`:

```tsx
<Canvas dpr={tier === "high" ? [1, 1.5] : 1} frameloop={visible ? "always" : "never"} gl={{ antialias: false, powerPreference: "high-performance", alpha: true }} camera={{ fov: 35, near: 0.1, far: 100, position: [0, -0.2, 2.6] }} onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", onLost)}>
  <PerformanceMonitor onDecline={() => setDpr(1)} />
  <Suspense fallback={null}>
    <SunLight /> <Stars /> <Earth tier={tier} /> <Clouds tier={tier} /> <Atmosphere />
    {tier === "high" && <EffectComposer multisampling={0}><Bloom intensity={0.35} luminanceThreshold={0.85} mipmapBlur /></EffectComposer>}
  </Suspense>
  <CameraRig />
</Canvas>
```

`Earth`: `sphereGeometry [1, 96, 96]`, `meshStandardMaterial map=day emissiveMap=lights emissive=#ffd9a0 emissiveIntensity=(dark: 1.2, light: 0.15) bumpMap bumpScale=0.02 roughness=0.9 metalness=0`. Dokular `useTexture` (`colorSpace = SRGBColorSpace` map ve emissiveMap için). Dünya kendi ekseninde 0.02 rad/s döner; eksen 23.4° eğik. `Clouds`: yarıçap 1.008, `alphaMap=cloudsAlpha`, `transparent`, `opacity 0.9`, 0.026 rad/s. `Atmosphere`: yarıçap 1.03, `BackSide`, drei `shaderMaterial` fresnel: `glow = pow(1.0 - dot(normal, viewDir), 3.0)` × `uColor` (tema rengi: dark `#8CCBFF`, light `#BFE2FF`) × `uIntensity` 1.1, `AdditiveBlending`, `depthWrite false`. `Stars`: drei `<Stars radius={60} depth={20} count={tier==='high'?2500:1200} factor={3} fade speed={0}/>`, açık temada `opacity 0.25`. `SunLight`: `directionalLight intensity 2.2` konumu `[cos(sunAngle)*5, 1.2, sin(sunAngle)*5]`, `ambientLight 0.08` (light tema 0.35). `CameraRig`: `useFrame((s, dt) => { const p = scrollState.progress; target.z = 2.6 + p * 6.4; target.y = -0.2 + p * 0.5; earthGroup.position.y = -1.15 + p * 1.1; damp3(camera.position, target, 0.25, dt); })`; canvas sarmalayıcısının `opacity = 1 - smoothstep(0.85, 1, p)` (DOM stiline yaz).

- [ ] **Step 3: Tema ve görünürlük**: `useSceneTheme` hedefleri `useTheme().theme`'den; `useFrame` içinde `sunAngle` `MathUtils.damp` ile 1 sn. `IntersectionObserver` sarmalayıcı üzerinde: görünmüyorsa `visible=false` (`frameloop="never"`); `document.visibilitychange`'de de durdur.

- [ ] **Step 4: Doğrula**: `yarn test`, `yarn typecheck`, `yarn build` 0. `yarn dev`'de geçici olarak `page.tsx`'e `<EarthCanvas/>` koyup iki temada bak: gece tarafında ışıklar görünür, tema geçişinde güneş döner, sekme gizlenince CPU düşer (Task Manager). Konsolda uyarı yok. Ekran görüntüsü `docs/perf/earth-dark.png`, `earth-light.png`. Commit `feat: add R3F earth scene with theme-driven sun and scroll camera`.

---

### Task 8: Hero bölümü

**Files:**
- Create: `src/components/hero/Hero.tsx`, `Telemetry.tsx`, `LocalTime.tsx`, `ScrollCue.tsx`, `src/components/ui/SplitHeading.tsx`, `src/lib/time.ts`, `src/lib/time.test.ts`

**Interfaces:**
- Consumes: `profile.location` (T4), `registerGsap`/`SplitText`/`prefersReducedMotion` (T6), `Button` (T6), mesajlar `hero.*`.
- Produces: `Hero()` server bileşeni (`min-h-[100svh]`, `pt-32`), içinde client `SplitHeading` ve `Telemetry`. `formatLocalTime(date: Date, tz: string, locale: string): string` → `"10:41"`. `SplitHeading({ as, className, children: string, delay? })`: SplitText `type: 'lines'`, `mask: 'lines'`, `gsap.from(lines, { yPercent: 110, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay })`; reduced-motion'da hiçbir şey yapmaz (metin görünür kalır); `useGSAP` ile scope ve temizlik; fontlar yüklenmeden bölme (`document.fonts.ready` beklenir).

- [ ] **Step 1: time test**: `formatLocalTime(new Date('2026-10-16T07:41:00Z'), 'Europe/Istanbul', 'en')` → `"10:41"`; `'tr'` → `"10:41"`.
- [ ] **Step 2: Hero düzeni**: sol kolon (`lg:col-span-8`): `h1` `SplitHeading` `text-[clamp(2.75rem,8vw,7rem)] font-display font-extrabold leading-[0.95]` = `t('hero.name')`; `p` `SplitHeading as="p"` `text-xl text-fg-2 max-w-[28ch]` = `t('hero.role') + ' ' + t('hero.line')` (delay 0.25). Telemetri (`font-mono text-xs text-fg-2`, `opacity 0 → 1` 400 ms, delay 0.6): `LocalTime` (`setInterval` 30 sn, `suppressHydrationWarning`, ilk render server saatinden) · `40.19°N 29.06°E` · `t('hero.openToWork')` (önünde 6px amber nokta). CTA `Button variant="primary" href="#contact"` (delay 0.7, opacity). `ScrollCue`: sağ altta 1px × 48px çizgi, `scaleY` 0→1→0 2 sn döngü (CSS keyframes, reduced-motion'da statik). Sağ/alt alan boş kalır (dünya orada).
- [ ] **Step 3:** `yarn test`, `yarn typecheck` 0; `yarn dev`'de yükleme orkestrasyonu ≤ 1,2 sn; reduced-motion'da (DevTools Rendering) metin anında görünür. Commit `feat: add hero with split headline and telemetry`.

---

### Task 9: Seçili işler ve iş listesi (WebGL hover bozulması)

**Files:**
- Create: `src/components/work/SelectedWork.tsx`, `WorkRow.tsx`, `WorkList.tsx`, `DistortImage.tsx`, `distort.frag.ts`, `distort.vert.ts`, `useHoverDistort.ts`
- Test: `src/components/work/WorkRow.test.tsx` (jsdom: görsel `<img>` DOM'da, `alt` dolu, bağlantı `/work/<slug>`)

**Interfaces:**
- Consumes: `getProjects(locale)` (T4), `Link` (T2), mesajlar `work.*`.
- Produces: `SelectedWork({ projects: ProjectMeta[] })` server; `WorkRow({ project, index })` (index tekse görsel sağda; görsel oran index%3 → `aspect-[16/10] | aspect-[4/3] | aspect-[3/2]`); `WorkList({ projects })` (sade satırlar: ad · yıl · stack ilk 3; hover'da satır zemin `bg-bg-2` 200 ms). `DistortImage({ src, alt, sizes, priority? })` client: her zaman gerçek `next/image` render eder; `(pointer: fine)` ve tier ≠ poster ise `onPointerEnter`'da üstüne tek bir `<canvas>` (three `WebGLRenderer`, `PlaneGeometry`, shader: `uv + normal * uStrength * sin(uv.y*8 + uTime)` + imleç hızına bağlı `uStrength`, `damp` ile 0'a döner) bağlar, `onPointerLeave`'de 300 ms sonra `dispose()` eder; aynı anda en fazla bir aktif canvas (modül düzeyi kilit). Görselin `ViewTransition` sarmalayıcısı: `<ViewTransition name={`project-${slug}`}>` (React 19.3 `import { ViewTransition } from 'react'`).

- [ ] **Step 1: Test** (yukarıdaki), kırmızı.
- [ ] **Step 2: Uygula.** Satır: `grid lg:grid-cols-12 gap-6 items-end`, görsel `lg:col-span-7`, metin `lg:col-span-5` (`h3 text-2xl font-display`, `p text-fg-2`, `span text-xs` yıl ve kategori; `TextLink` `t('work.view')`). Tüm satır `Link`. Görsel `sizes="(min-width:1024px) 58vw, 100vw"`; ilk satır `priority`.
- [ ] **Step 3:** `yarn test`, `yarn typecheck` 0; `yarn dev`'de hover bozulması yumuşak, dokunmatikte (DevTools cihaz emülasyonu) canvas oluşmaz, hover bırakınca canvas DOM'dan silinir (Elements panelinde say). Commit `feat: add selected work rows with hover distortion and work list`.

---

### Task 10: Hakkımda, deneyim zaman çizelgesi, yetenekler, iletişim

**Files:**
- Create: `src/components/about/About.tsx`, `Timeline.tsx`, `Skills.tsx`, `src/components/contact/Contact.tsx`
- Test: `src/components/about/Timeline.test.tsx` (3 giriş, `01`–`03` numaraları, `to === null` → `t('about.present')`)

**Interfaces:**
- Consumes: `profile` (T4), `pick`, `Section`, `TextLink`, `Button` (T6), mesajlar `about.*`, `contact.*`.
- Produces: `About({ locale })`, `Contact({ locale })` server bileşenleri; `#about` ve `#contact` id'leri `Section` ile.

- [ ] **Step 1: Test**, kırmızı.
- [ ] **Step 2: About**: `grid lg:grid-cols-12`: sol `lg:col-span-3` başlık `t('about.title')` sticky (`top-24`); sağ `lg:col-span-8 lg:col-start-5`: iki paragraf (`profile.intro: L[]`, `text-lg max-w-[62ch]`), `Timeline` (sol 1px çizgi `bg-fg-2/30`, her giriş: numara `font-display text-xs text-fg-2` (`01`), şirket `h3 text-xl`, rol + tarih `text-fg-2`, maddeler `ul` ≤ 5 madde (1likte için ilk 5), `Skills` (4 grup: başlık `text-base font-medium`, öğeler virgülle ayrılmış düz metin, kart yok), eğitim tek satır.
- [ ] **Step 3: Contact**: başlık `t('contact.title')` `text-4xl`, e-posta `a` `text-3xl font-display` (`profile.email`, hover alt çizgi), sosyal bağlantılar yan yana `TextLink` (LinkedIn, GitHub, Instagram; `lucide-react` ikon yok, metin), CV: locale'e göre önce o dilin CV'si `Button variant="primary"`, diğeri `ghost`; `t('contact.localTime')` + `LocalTime` (T8).
- [ ] **Step 4:** `yarn test`, `yarn typecheck` 0, iki dilde görünüm. Commit `feat: add about, timeline, skills and contact sections`.

---

### Task 11: Galeri ve lightbox

**Files:**
- Create: `src/data/gallery.ts` (16 görsel: `src`, `orientation`, `alt: L`), `src/components/gallery/Gallery.tsx`, `Lightbox.tsx`, `Lightbox.test.tsx` (açılınca `role="dialog"`, Escape kapatır, ok tuşları gezer, odak dialog'da kalır)

**Interfaces:**
- Consumes: `Section`, mesajlar `gallery.*`, `motion/react` (`AnimatePresence` ile lightbox 200 ms opacity + 1.02→1 scale).
- Produces: `Gallery()` client bileşeni (`#gallery`), `Lightbox({ items, index, onClose, onIndex })`.

- [ ] **Step 1: Test**, kırmızı.
- [ ] **Step 2: Gallery**: CSS `columns-2 md:columns-3 xl:columns-4 gap-4`, her görsel `button` (`aria-label={t('gallery.open')}`), `next/image` `sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"`, `loading="lazy"`, hover'da `scale 1.02` 300 ms (tek izin verilen hover). Lightbox: `fixed inset-0 bg-bg/90 backdrop-blur`, `next/image` `fill object-contain`, önceki/sonraki/kapat düğmeleri (`lucide-react` ikon + `aria-label`), odak tuzağı (ilk/son odaklanabilir arasında Tab döngüsü), `body { overflow: hidden }` açıkken (Lenis `stop()/start()`).
- [ ] **Step 3:** test/kapı 0. Commit `feat: add gallery with accessible lightbox`.

---

### Task 12: Proje vaka sayfası, metadata, sitemap

**Files:**
- Create: `src/app/[locale]/work/[slug]/page.tsx`, `src/components/work/ProjectHeader.tsx`, `ProjectNav.tsx`
- Modify: `src/app/sitemap.ts` (projeler iki dilde + `alternates`), `src/app/robots.ts`, `src/components/mdx/mdx-components.tsx`

**Interfaces:**
- Consumes: `getProject`, `getProjects`, `getProjectSlugs`, `MdxContent` (T4); `Link`; `ViewTransition name="project-<slug>"` (T9 ile aynı ad).
- Produces: rota `/work/[slug]` ve `/tr/work/[slug]`; `generateStaticParams` (locale × slug); `generateMetadata` (`title`, `description`, `openGraph.images: /api/og/generate?title=`, `alternates.languages`).

- [ ] **Step 1: Sayfa**: `const { locale, slug } = await params; setRequestLocale(locale); const p = await getProject(slug, locale); if (!p) notFound();` Düzen: `Container`, üstte `Link href="/#work"` `t('project.back')`; `ProjectHeader`: `h1 text-4xl font-display`, özet `text-lg text-fg-2 max-w-[62ch]`, meta satırı (`dl`: rol, yıl, durum (`t('project.'+status)`), bağlantı varsa `TextLink` yeni sekme); kapak görseli `<ViewTransition name={`project-${slug}`}><Image priority .../></ViewTransition>` `aspect-[16/10]`; `fallback` ise `p` `t('project.englishOnly')` (`text-xs text-fg-2`). İçerik `prose prose-invert data-[theme=light]:prose` (tema değişkenlerine bağlı `prose` renkleri `globals.css`'te `--tw-prose-body: var(--color-fg)` vb.). `ProjectNav`: önceki/sonraki (sıralı liste, uçlarda sarmal).
- [ ] **Step 2: sitemap/robots**: sitemap `getProjectSlugs()` ile `/work/<slug>` ve `/tr/work/<slug>`, `alternates.languages`; robots `sitemap: siteUrl + '/sitemap.xml'`.
- [ ] **Step 3:** `yarn build` 0 ve çıktıda 18 proje sayfası (9 × 2) statik; `curl localhost:3210/tr/work/react-window-modals` 200 + "yalnızca İngilizce" notu; Commit `feat: add project case pages with shared-element transition and sitemap`.

---

### Task 13: Sayfa birleştirme, kaydırma koreografisi, preloader, View Transition CSS

**Files:**
- Create: `src/components/layout/Preloader.tsx`, `src/components/three/useScrollProgress.ts`, `src/app/[locale]/page.tsx` (son hâli)
- Modify: `src/app/[locale]/layout.tsx`, `globals.css`, `src/components/three/EarthCanvas.tsx` (preloader sinyali)

**Interfaces:**
- Consumes: her şey. `scrollState` (T7).
- Produces: ana sayfa sırası: `Hero` → `div#orbit-end` (sentinel) → `SelectedWork` → `WorkList` → `About` → `Gallery` → `Contact`. `useScrollProgress(ref)`: `ScrollTrigger.create({ trigger: ref, start: 'top top', end: 'bottom top', scrub: true, onUpdate: st => { scrollState.progress = st.progress } })` sarmalayıcı = `Hero` + `SelectedWork`'ü kapsayan `div`; reduced-motion'da `progress = 0` sabit (canvas zaten poster). `Preloader`: `EarthCanvas` `onReady` çağırana kadar ya da 1,5 sn'ye kadar sağ altta ince ilerleme çizgisi + `t('preloader.label')` (`aria-live="polite"`); yalnız `sessionStorage.preloaded` yoksa; başlık preloader'ın altında değil (preloader yalnız köşe elemanı, tam ekran perde yok).

- [ ] **Step 1: page.tsx**: `generateMetadata`, `setRequestLocale`, `const projects = await getProjects(locale)`; `<main id="content">` içinde yukarıdaki sıra; `EarthCanvas` `layout.tsx`'te `<body>`'nin ilk çocuğu (sabit, arkada), ana sayfa dışındaki rotalarda render edilmez (`usePathname` ile `/` ve `/tr` kontrolü yapan `EarthGate` client sarmalayıcısı; proje sayfasında canvas yok).
- [ ] **Step 2: Koreografi**: `SelectedWork` ilk satırı dünya küçülürken belirir; satırlar için giriş animasyonu YOK (spec), yalnız kamera. `#orbit-end`'den sonra canvas `opacity 0` (T7'deki smoothstep). `globals.css`: `::view-transition-group(earth) { animation: none }`, `::view-transition-old(root)`/`new(root)` kuralları T3'ten. `Link` ile proje sayfasına geçişte `ViewTransition` morf: `page.tsx` içindeki `SelectedWork` sarmalayıcısı `<ViewTransition default="none">` değil; yalnız görseller adlı. Proje sayfasına girişte sayfa `opacity` 300 ms (`::view-transition-new(root)` default crossfade yeterli).
- [ ] **Step 3: Doğrula**: `yarn build` 0; `yarn start -p 3210`'da masaüstü: kaydırınca dünya uzaklaşıp küçülür, About'a gelince canvas kaybolur, tema geçişinde dünya donmaz (view-transition-name sayesinde); mobil emülasyon: 2k doku, bloom yok; reduced-motion: poster. Ekran görüntüleri `docs/perf/` (dark/light × desktop/mobile). Commit `feat: assemble home page with scroll-driven orbit and preloader`.

---

### Task 14: Kalite kapısı: Playwright, Lighthouse, erişilebilirlik, belgeler

**Files:**
- Create: `e2e/home.spec.ts`, `e2e/project.spec.ts`, `e2e/a11y.spec.ts` (`@axe-core/playwright` ekle), `docs/perf/README.md`, `KALAN.md`
- Modify: `README.md` (yeni yığın, komutlar, içerik ekleme), `CLAUDE.md` (proje kuralları: komutlar, kapı, dal)

- [ ] **Step 1: e2e/home.spec.ts**

```ts
import { expect, test } from "@playwright/test";
test("english home renders sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hazim Alper Ata");
  for (const id of ["work", "about", "gallery", "contact"]) await expect(page.locator(`#${id}`)).toBeVisible();
});
test("turkish home and switch", async ({ page }) => {
  await page.goto("/tr");
  await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  await page.getByRole("button", { name: /dil/i }).click();
  await expect(page).toHaveURL("/");
});
test("theme toggle persists", async ({ page }) => {
  await page.goto("/");
  const before = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("button", { name: /theme/i }).click();
  const after = await page.locator("html").getAttribute("data-theme");
  expect(after).not.toBe(before);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", after!);
});
test("reduced motion shows poster, no canvas", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator('img[src*="posters/earth"]')).toBeVisible();
});
test("unknown route is 404", async ({ page }) => {
  const res = await page.goto("/xyz");
  expect(res?.status()).toBe(404);
});
```

`e2e/project.spec.ts`: `/work/1likte-seller-panel` 200 + h1; `/tr/work/react-window-modals` İngilizce notu. `e2e/a11y.spec.ts`: axe `/` ve `/tr` için `violations.filter(v => ['serious','critical'].includes(v.impact)).length === 0`.

- [ ] **Step 2: Lighthouse**: `yarn build && yarn start -p 3210`; `npx lighthouse http://localhost:3210 --preset=desktop --output=json --output-path=docs/perf/lh-desktop.json --chrome-flags="--headless=new" --quiet; npx lighthouse http://localhost:3210 --form-factor=mobile --output=json --output-path=docs/perf/lh-mobile.json --chrome-flags="--headless=new" --quiet` (EPERM ile çıkış 1 olabilir; JSON'a bak). `node -e` yerine küçük betik `scripts/lh-summary.mjs` ile `categories.performance.score`, `accessibility.score`, `audits['largest-contentful-paint'].numericValue` bas. Hedef: mobil ≥ 0.90, masaüstü ≥ 0.85, erişilebilirlik ≥ 0.95. Tutmazsa: doku boyutu, `priority` görseller, font preload, `sizes` düzelt; bulguları `docs/perf/README.md`'ye yaz.
- [ ] **Step 3: Görsel tur**: Playwright ile `docs/perf/shots/{en,tr}-{dark,light}-{desktop,mobile}.png` tam sayfa (8 görüntü, tek betik `scripts/shots.mjs`). Görüntüleri incele: hizalama, kontrast, taşma, TR'de uzun kelimeler. Bulduklarını düzelt.
- [ ] **Step 4: Belgeler**: README (yığın, `yarn dev/gate/e2e/textures`, içerik ekleme, dil ekleme), `CLAUDE.md` (kapı komutu `yarn gate`, dal kuralı, "iç bilgi sızdırma"), `KALAN.md` (ne bitti, açık işler: TR metin düzeltmeleri Hazım'da, Vercel preview, master'a geçiş).
- [ ] **Step 5:** `yarn gate` ve `yarn e2e` 0. Commit `test: add e2e, a11y and performance gate; docs`.

---

## Self-review notları

- Spec §4 bölümleri: Hero T8, Seçili işler/liste T9, About T10, Gallery T11, Contact T10, proje sayfası T12, not-found T2, Header/Footer T6, preloader T13, `/earth` ve `/animation` kaldırma T1. §5 yığın T1; i18n T2; tema T3; 3D T7; hareket T6/T8/T13; yetenek T5; cache header T1. §7 performans T5/T7/T14; erişilebilirlik T6 (skip link, odak), T11 (odak tuzağı), T14 (axe). §8 kapı T14. §9 teslim T14 (KALAN.md).
- Adlar: `scrollState` (T7, T13), `textureSet`/`useTier` (T5, T7, T9), `getProject(s)` (T4, T9, T12, T13), `SplitHeading` (T8), `LocalTime` (T8, T10), `Section`/`Container`/`Button`/`TextLink` (T6 → T8–T12), `ViewTransition name="project-<slug>"` (T9, T12).
- Lenis + lightbox: T11 `lenis.stop()` için `useLenis` kullanır (T6'da `lenis/react`).
