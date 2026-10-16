# hazimalperata.com yeniden tasarım — tasarım spec'i

Tarih: 2026-10-16 · Sahip: Hazım Alper Ata · Durum: onaylandı (sohbette, 2026-10-16)

Araştırma raporları: `docs/research/research-references.md` (referans siteler ve teknikler),
`docs/research/research-stack.md` (teknik yığın, sürümler, tuzaklar),
`docs/research/research-resources.md` (bileşen kütüphaneleri, skill'ler, fontlar).

## 1. Amaç ve ölçüt

- Site, işveren ve müşterilerin baktığı kişisel vitrin. Premium, görsel zengin, 3D + hareket.
- EN varsayılan (`/`), TR (`/tr`). Koyu/açık tema. Mevcut içerik korunur: 9 proje (MDX),
  deneyim, eğitim, yetenekler, 16 fotoğraflık galeri, EN/TR CV PDF'leri.
- Ücretli hiçbir servis, kütüphane ya da font yok.
- Başarı: Lighthouse mobil ≥ 90 / masaüstü ≥ 85 (performans), erişilebilirlik ≥ 95; reduced-motion
  yolu; klavyeyle gezilebilir; iki dilde ve iki temada aynı kalite.

## 2. Konsept: "Yörüngeden"

Görsel dünya, mevcut dünya sahnesi ve "Pale Blue Dot" projesinden geliyor: yörüngeden bakış,
ölçek, hassasiyet.

**Tek cesur an.** Hero'da dünya, ufuk çizgisi gibi alttan yükselir (sol-üstte başlık). Kaydırdıkça
kamera geri çekilir; dünya küçülür ve sürüklenir; "seçili işler" bölümünün sonunda soluk mavi bir
noktaya döner, "hakkımda"da canvas söner. Tek canvas; ilk iki bölümün arkasına sabitlenir
(`position: fixed`, ScrollTrigger scrub). Kalan her şey sessiz: tipografi, boşluk, iki renk.

**Tema bağı.** Koyu tema = gece tarafı (şehir ışıkları, yıldızlar, ince atmosfer). Açık tema =
gündüz tarafı (güneş, bulutlar, parlak atmosfer). Tema düğmesi, View Transition dairesel geçişle
arayüzü çevirirken sahnedeki güneş yönü 1 sn'de döner; gece/gündüz sınırı dünyanın üstünden
süpürülür. Canvas View Transition anlık görüntüsünden hariç tutulur (sabit
`view-transition-name` + `animation: none`).

**Olmayacaklar** (araştırmadaki "şablon/AI" işaretleri): mor gradient, gradient metin, cam küreler,
rastgele parçacıklar, her bölümde fade-up, her kartta hover zıplaması, BÜYÜK HARF eyebrow
etiketleri, "01/02/03" (yalnız deneyim zaman çizelgesinde, gerçek bir sıra), link sonuna "→",
özdeş yuvarlak kartlar, orta hizalı hero + üç özdeş kart.

## 3. Token planı

### Renk

| Rol | Koyu | Açık |
| --- | --- | --- |
| Zemin | `#0B1628` (derin okyanus mavisi; siyah değil) | `#F3F6FA` |
| Zemin-2 (yüzey) | `#111F36` | `#E8EDF4` |
| Metin | `#E8EEF6` | `#0E1A2B` |
| Metin-ikincil | `#8A9BB5` | `#51627A` |
| Vurgu (atmosfer) | `#8CCBFF` | `#1F6FD8` |
| Amber (gündoğumu) | `#F0B35B` | `#D9922E` |

- Amber yalnız iki yerde: sahnedeki terminatör/güneş parıltısı ve tek birincil CTA.
- Exception (owner, 2026-10-16): the logo dot and the availability dot in the hero telemetry may use amber.
- Tanecik: SVG `feTurbulence` data-URI, %4 opaklık, `mix-blend-mode`, animasyonsuz, iki temada.
- Token'lar Tailwind 4 `@theme` içinde CSS değişkeni; `[data-theme="dark"]`/`"light"` ile
  değişir; R3F sahnesi aynı değişkenleri okur (`getComputedStyle`).

### Tipografi

- Başlık: **Syne** 700/800 (Google Fonts, OFL, latin-ext). Hero başlığı `clamp(2.75rem, 8vw, 7rem)`,
  satır yüksekliği 0.95, harf aralığı -0.02em.
- Gövde: **Geist** 400/500 (Google Fonts, OFL). 1.0625rem / 1.6. Satır uzunluğu ≤ 70 karakter.
- Mono: **Geist Mono** yalnız hero telemetri şeridinde (yerel saat, konum, "open to work").
- `next/font/google`, `subsets: ['latin','latin-ext']`, `display: 'swap'`.
- Ölçek (Elements of Typographic Style oranı 1.25): 0.875 · 1 · 1.25 · 1.5625 · 1.95 · 2.44 · 3.05 rem.

### Düzen

- Sola hizalı, asimetrik 12 kolon, gutter 24px, maksimum genişlik 1440px, yan boşluk 24px
  (mobil 16px). Mobil tek kolon; dünya hero'nun alt yarısına küçülür.

```
┌──────────────────────────────────────────────────────────┐
│ ·hazim      Work  About  Gallery  Contact     EN/TR  ☾   │
│                                                          │
│ Hazim Alper Ata                                          │
│ Frontend & mobile engineer                               │
│ building products from idea to production.               │
│                                                          │
│ 10:41 Bursa · 40.19°N 29.06°E · open to work   [Say hi]  │
│                        ╭──────────────────────────────╮  │
│                     ╭──╯   EARTH (horizon, R3F)       ╰─ │
└──────────────────────────────────────────────────────────┘
│ Selected work                                            │
│ ┌──────────────────────────┐  1likte Seller Panel       │
│ │  image (hover distort)   │  Next.js · 2022–2026       │
│ └──────────────────────────┘                            │
│          1likte Mobile App   ┌──────────────────┐        │
│          Expo · 2023–2026    │   image          │        │
│                              └──────────────────┘        │
│ ...  (4–5 büyük satır, sağ-sol dönüşümlü, oranlar farklı)│
│ All work: sade liste (ad · yıl · teknoloji)              │
├──────────────────────────────────────────────────────────┤
│ About        | intro metni (2 paragraf)                  │
│              | Experience: 1likte · Baykar · Inovathings │
│              |   (dikey zaman çizelgesi, numaralı)       │
│              | Skills: 4 grup, düz metin + ikon          │
├──────────────────────────────────────────────────────────┤
│ Gallery: masonry, sürüklenebilir, lightbox               │
├──────────────────────────────────────────────────────────┤
│ Contact: büyük e-posta, sosyal, CV (EN/TR), yerel saat   │
│ footer: © · built with Next.js · back to top             │
└──────────────────────────────────────────────────────────┘
```

## 4. Sayfalar ve bölümler

### `/` ve `/tr` (tek uzun sayfa)

1. **Hero**: başlık (LCP elemanı, SSR), alt satır, telemetri şeridi (yerel saat canlı, konum,
   "open to work"), tek CTA ("Say hi" → iletişim çapası). Dünya canvas'ı ilk boyamadan sonra
   bağlanır, 400 ms opacity ile belirir. Kaydırma ipucu (ince çizgi, 2 sn'de bir nefes).
2. **Selected work**: 4–5 öne çıkan proje (MDX frontmatter `featured: true`, `order`). Her satır:
   büyük görsel (WebGL hover bozulması: imleç hızına bağlı displacement; dokunmatikte yok, gerçek
   `<img>` DOM'da kalır), ad, kategori, yıl. Satırlar sağ/sol dönüşümlü, görsel oranları farklı.
   Altında "All work": kalan projeler sade liste. Kart görseli `ViewTransition name="project-<slug>"`.
3. **About**: 2 paragraf intro, deneyim zaman çizelgesi (3 iş, dikey çizgi, numaralı), eğitim,
   yetenekler (4 grup; düz metin + ikon, kart değil).
4. **Gallery**: 16 foto masonry (2 sütun mobil, 4 masaüstü), yatay sürükleme yok; lightbox
   (klavye ile gezilir). `next/image` sizes doğru, lazy.
5. **Contact**: büyük e-posta bağlantısı, sosyal bağlantılar, CV indir (EN/TR, dile göre öne çıkan),
   yerel saat. Footer.

### `/work/[slug]` ve `/tr/work/[slug]`

- MDX vaka sayfası: hero görseli (paylaşımlı eleman morf), başlık, meta (rol, yıl, bağlantı,
  durum), içerik (`@tailwindcss/typography`), sonraki/önceki proje.
- TR MDX yoksa EN içeriğe düşer; üstte "Bu sayfa İngilizce" notu.

### Diğer

- `not-found` iki dilde. `api/og` (var olan), `robots.ts`, `sitemap.ts` (iki dilde, `alternates`).
- `/earth` ve `/animation` rotaları kaldırılır (sahne hero'ya katlanır; Pale Blue Dot vaka sayfası
  olarak kalır).
- Üst bar: logo, çapa menü (Work, About, Gallery, Contact), EN/TR anahtarı (aynı sayfanın karşılığına
  gider), tema düğmesi. Kaydırınca ince, yarı saydam zemin.
- Preloader: yalnız ilk ziyarette ve yalnız dokular 300 ms'den uzun sürerse; en fazla 1,5 sn;
  başlık preloader'ın dışında (LCP). `sessionStorage` ile bir kez.

## 5. Teknik mimari

### Yığın (sürümler 2026-10-16 npm)

- next 16.4.x, react 19.3.x, TypeScript 5.x, Turbopack, yarn 1 (mevcut).
- Tailwind 4.3 (`@tailwindcss/postcss`), `@tailwindcss/typography`; bespoke efektler CSS modülü.
- 3D: `@react-three/fiber` 9.8, `@react-three/drei` 10.7, `@react-three/postprocessing` 3.2,
  `three` 0.186. **Çıkarılır:** `@once-ui-system/core`, `framer-motion`, `sass`, `three-stdlib`,
  `@next/mdx`, `@mdx-js/loader`, `classnames` (yerine `clsx`), `@tanstack/eslint-plugin-query`.
- Hareket: `gsap` 3.15 + `@gsap/react` 2.1 (ScrollTrigger, SplitText), `motion` 14 (`motion/react`),
  `lenis` 1.3 (masaüstü; `respectReducedMotion`). React `<ViewTransition>` rota ve tema geçişi.
- i18n: `next-intl` 4.14, `localePrefix: 'as-needed'`, `src/proxy.ts`, `next/root-params`.
- MDX: `next-mdx-remote` (RSC `compileMDX`) + `gray-matter`.
- Tema: elle `data-theme` sağlayıcı (head'de engelleyici script, `useSyncExternalStore`).
- `next lint` kalktı: `eslint .` (flat config).

### Dizin yapısı

```
src/
  app/
    [locale]/
      layout.tsx          # <html lang>, fontlar, tema script'i, Providers, Header/Footer
      page.tsx            # tek sayfa: Hero, Work, About, Gallery, Contact
      work/[slug]/page.tsx
      not-found.tsx
    api/og/...            # locale dışı (mevcut)
    robots.ts  sitemap.ts
  proxy.ts
  i18n/ routing.ts  navigation.ts  request.ts
  components/
    layout/   Header, Footer, LocaleSwitch, ThemeToggle, Preloader
    hero/     Hero, Telemetry, ScrollCue
    three/    EarthCanvas (dynamic), EarthScene, Earth, Atmosphere, Stars, Sun, useSceneTheme,
              useScrollCamera, Poster
    work/     SelectedWork, WorkRow, DistortImage (WebGL hover), WorkList
    about/    About, Timeline, Skills
    gallery/  Gallery, Lightbox
    contact/  Contact
    mdx/      mdx-components (Figure, Callout, …)
    ui/       Button, Link, SplitHeading, Reveal, Grain
  lib/
    theme.ts  motion.ts (gsap register, lenis)  capabilities.ts (gpu tier, reduced motion)
    content.ts (MDX okuma, locale fallback)  time.ts
  content/ (depo kökünde) projects/<slug>.en.mdx, <slug>.tr.mdx
  data/   profile.ts (deneyim, eğitim, yetenekler, sosyal; iki dilli alanlar)
messages/ en.json  tr.json
public/ images/ (mevcut), textures/earth/{2k,4k}/*.webp, posters/earth-{dark,light}.webp
scripts/ textures.mjs (sharp: 10k JPEG → 2k/4k WebP + poster)
```

### Veri akışı

- Sayfalar SSG, her iki locale `generateStaticParams`. UI metinleri `messages/*.json`;
  profil verisi `data/profile.ts` (`{en, tr}` alanlar); projeler MDX frontmatter
  (`title, summary, publishedAt, images, featured, order, link, status, role, stack`).
- Tema: head script → `data-theme`; `ThemeProvider` → `useTheme()`; canvas `useSceneTheme()` ile
  güneş yönü ve atmosfer rengini interpolar.
- Kaydırma: Lenis (masaüstü) → `ScrollTrigger.update`; `useScrollCamera` ScrollTrigger scrub ile
  kamera uzaklığı/dünya ölçeği; GSAP ticker tek.
- Yetenek tespiti (`capabilities.ts`): reduced-motion, `pointer: coarse`, `hardwareConcurrency ≤ 4`,
  `deviceMemory ≤ 4`, `saveData`, WebGL2 yok → `tier: 'poster' | 'low' | 'high'`. Poster = statik
  WebP; low = 2k doku, DPR 1, postprocessing yok; high = 4k, DPR ≤ 1.5, hafif bloom.

### Hata ve sınır durumları

- WebGL context kaybı → poster'a düş. Doku yükleme hatası → poster. Canvas hatası ErrorBoundary
  ile sınırlı, sayfa çalışır.
- View Transitions desteklenmeyen tarayıcıda geçişler anında olur. Firefox cross-document yok,
  sorun değil (tek doküman).
- `prefers-reduced-motion`: Lenis kapalı, SplitText yok (düz görünür), canvas poster,
  `::view-transition` animasyonsuz, `MotionConfig reducedMotion="user"`.
- TR MDX eksikse EN'e düş.

## 6. Hareket kuralları (hazim:hareket + araştırma)

- Tek orkestre yükleme anı: başlık satır satır maskeli reveal (SplitText), telemetri 150 ms sonra,
  dünya belirir. Toplam ≤ 1,2 sn. Diğer bölümlerde giriş animasyonu yok; yalnız kaydırmaya bağlı
  kamera ve iş görsellerinin hover'ı.
- Süreler: mikro 150–200 ms, geçiş 300–500 ms, tema dairesi 500 ms, kamera scrub (süre yok).
  Eğri `cubic-bezier(.4,0,.2,1)`; çıkış hızlı, giriş yavaş.
- Hover yalnız anlam taşıyan yerde: iş görseli (bozulma), bağlantı alt çizgisi, düğme. Manyetik
  düğme yok. Özel imleç yok.

## 7. Performans ve erişilebilirlik

- LCP = hero başlığı (SSR). Canvas `dynamic(ssr:false)`, ilk boyamadan sonra `requestIdleCallback`.
- Dokular: `scripts/textures.mjs` ile 2k/4k WebP; night lights, bulut, bump; spec haritası düşer
  (roughness sabit). Toplam ilk yük: high ≤ 6 MB (lazy), low ≤ 2 MB, poster ≤ 150 KB.
- `dpr={[1,1.5]}`, `PerformanceMonitor` ile düşürme, ekran dışında `frameloop="never"`, sekme
  gizliyken durur. Tek canvas. Gölge yok, 1 directional + ambient.
- `/public/textures` ve `/posters` için `headers()` immutable cache. Görseller AVIF/WebP, `sizes`.
- Erişilebilirlik: odak halkaları görünür, atlama bağlantısı, canvas `aria-hidden`, SplitText aria
  (otomatik), lightbox odak tuzağı, renk kontrastı AA (metin-ikincil dahil), `lang` doğru,
  dil anahtarı `hreflang`.

## 8. Test ve kalite kapısı

- `tsc --noEmit`, `eslint .`, `next build` (iki locale SSG).
- Playwright smoke (yerel, `yarn build && yarn start`): EN ve TR ana sayfa başlık/alt bölümler
  görünür; tema düğmesi `data-theme` değiştirir ve yeniler; dil anahtarı `/tr`'ye gider; bir proje
  sayfası açılır; `prefers-reduced-motion` ile poster render; 404.
- Lighthouse (headless Chrome, `--chrome-flags="--headless=new"`): mobil ≥ 90 / masaüstü ≥ 85
  performans, erişilebilirlik ≥ 95. Rapor JSON `docs/perf/`.
- Görsel tur: iki tema × iki dil × masaüstü/mobil ekran görüntüleri tek seferde.

## 9. Teslim

- Dal `redesign`; Vercel preview. `master`'a yalnız Hazım'ın onayıyla.
- Sonunda yerelde `yarn dev` ile ayağa kaldırılır; Hazım kendisi bakar.
