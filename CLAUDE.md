# Proje kuralları — hazimalperata.com

Kişisel site, "Living Signal" tasarımı. Next.js (App Router) + next-intl + Tailwind 4 + R3F parçacık motoru (`src/components/signal/`). Tam kullanım `README.md`'de.

## Komutlar ve kapı

- Kapı: `yarn gate` (typecheck, lint, test, build). Commit'ten önce 0 dönmeli.
- Build'den sonra `yarn e2e` de koş (Playwright masaüstü + mobil, axe erişilebilirlik dahil). Önce `yarn build`, çünkü e2e son build'i sunar.
- Çıkış kodunu boruya sokmadan oku: `yarn gate > log 2>&1; echo EXIT=$?`, sonra log'a bak. `| tail` kodu gizler.
- Çok satırlı dosyayı `Write` ile yaz, heredoc kullanma. Depo CRLF olabilir: toplu yama yazarken satır sonunu kontrol et.
- Commit verisi: `yarn signal` yerel depolardan `src/data/signal.json` üretir (ayar `signal.config.local.json`, git dışı). Hiç commit toplayamazsa dosyaya yazmadan hata koduyla çıkar. Diff'i oku, sonra commit'le.

## Dal kuralı

- Çalışma dalı `signal`. `master` canlı site: sitenin sahibinin (Hazım) OK'si olmadan `master`'a push ya da merge yok.
- Vercel preview adresi `signal` dalı için ayrıca kontrol edilir.
- `master`'da `/lab` rotaları yok. Diğer tasarım denemeleri `lab` etiketinde ve `docs/design-lab/` içinde kalır, siteye girmez.

## İçerik ve metin kuralları

- Kullanıcıya görünen hiçbir metin iç ya da teknik bilgi sızdırmasın: sürüm, kütüphane adı, HTTP kodu, altyapı, ölçüm sayısı yok. İstisna: teknoloji (stack) satırları ve yapay zekâ bölümü. Alt bilgi yalnız "© 2026 Hazim Alper Ata".
- Bütün arayüz metni `messages/<dil>/<namespace>.json` içinde. JSX'e sabit metin yazma.
- Vaka sayfaları `content/projects/<slug>.<dil>.mdx`, veri `src/data/`.
- Türkçe metin, galeri alt metinleri ve proje durumları sitenin sahibinin işi: yeniden yazma, taslak yaz ve sahibine ilet.
- Yalnız gerçek içerik: uydurma sayı, özellik, ekran görüntüsü ya da isim yok. "NDA" ve not ortalaması (GPA) yazma.
- Rommer uygulaması "Movement analysis for Rommer" (müşteri Rommer International) diye geçer, tek başına "Rommer" ürün adı olarak değil.

## Tasarım kuralları

- Yalnız koyu tema. Renkler: zemin `#05060A`, metin `#E8EAF0`, ikincil `#8B90A0`. Şerit (lane) renkleri `src/data/lanes.ts`'ten gelir, başka yerde renk uydurma.
- Yazı: başlıklar Sora 600, veri ve etiketler IBM Plex Mono. Sora yalnız 400/600 yüklü; başka ağırlık isteme.
- Hareket kapısı tek: `useMotionEnabled()` (`prefers-reduced-motion`). Yeni kodda `matchMedia` ile ayrı kapı kurma.
- Tek GSAP ticker'ı Lenis'i, ScrollTrigger'ı ve canvas çizimini sürer. İkinci bir `requestAnimationFrame` döngüsü ekleme.
- DOM yalnız `transform` ve `opacity` anime eder. Sayaçlar hedefi aşmaz, hiçbir şey sıfırdan ölçeklenmez.
- Canvas'lar `aria-hidden`. Sayfa başına tek h1, atla bağlantısı ve görünür odak kalır. Dış bağlantılar `target="_blank" rel="noopener noreferrer"` + `a11y.externalLink` gizli metni.
- WebGL yoksa, bağlam kaybolursa ya da azaltılmış hareket istenirse motor açılmaz; statik zaman çizelgesi (`StaticTimeline`) ve bütün metin görünür. Bu yol sıfır sayfa hatasıyla çalışmalı.
- Para isteyen paket, servis ya da font yok.

## Bilinen tuzaklar

- Next 16: `params` await edilir, `src/proxy.ts` ve `global-not-found` yerinde kalır. Emin olmadığın API için `node_modules/next/dist/docs/`'a bak.
- Motor sayfa boyandıktan sonra (boşta) bağlanır, ilk boyamayı geciktirmesin diye. Bu gecikmeyi kaldırma: LCP ve TBT bozulur.
- Yerelde `/_vercel/insights/script.js` 404 verir. Beklenen, `<Analytics />` kalacak.
- Headless Chromium'da WebGL için `--use-angle=swiftshader --enable-unsafe-swiftshader` gerekir (`playwright.config.ts`'te var).
- `signal.config.local.json` git dışı ve makineye özel: yolları depoya yazma. `signal.json` yalnız tarih ve sayı taşır, commit mesajı ya da depo adı taşımaz.
