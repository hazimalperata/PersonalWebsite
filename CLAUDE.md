# Proje kuralları — hazimalperata.com

Kişisel site. Next.js (App Router) + next-intl + Tailwind 4 + R3F dünya sahnesi. Tam kullanım `README.md`'de.

## Komutlar ve kapı

- Kapı: `yarn gate` (typecheck, lint, test, build). Commit'ten önce 0 dönmeli.
- Build'den sonra `yarn e2e` de koş (Playwright masaüstü + mobil, axe erişilebilirlik dahil). Önce `yarn build`, çünkü e2e son build'i sunar.
- Çıkış kodunu boruya sokmadan oku: `yarn gate > log 2>&1; echo EXIT=$?`, sonra log'a bak. `| tail` kodu gizler.
- Çok satırlı dosyayı `Write` ile yaz, heredoc kullanma. Depo CRLF olabilir: toplu yama yazarken satır sonunu kontrol et.

## Dal kuralı

- Çalışma dalı `redesign`. `master`'a OK olmadan push ya da merge yok. Karar sitenin sahibinin (Hazım).
- Vercel preview adresi `redesign` dalı için ayrıca kontrol edilir.

## İçerik ve metin kuralları

- Kullanıcıya görünen hiçbir metin iç ya da teknik bilgi sızdırmasın: sürüm, kütüphane adı, HTTP kodu, altyapı, ölçüm sayısı yok. Alt bilgi yalnız "© 2026 Hazim Alper Ata".
- Bütün arayüz metni `messages/<dil>/<namespace>.json` içinde. JSX'e sabit metin yazma.
- Vaka sayfaları `content/projects/*.mdx`, veri `src/data/`.
- Türkçe metin, galeri alt metinleri ve proje durumları sitenin sahibinin işi: yeniden yazma, taslak yaz ve sahibine ilet.

## Tasarım kuralları

- Kehribar (amber) yalnız sahnede ve tek CTA'da.
- Büyük harf etiket yok, bağlantıdan sonra "→" yok, gradient yazı yok. Mono yazı yalnız hero telemetri satırında.
- Hareket: tek yükleme koreografisi (hero). Başka yerde giriş animasyonu yok. `prefers-reduced-motion` her katmanda saygı görür.
- Para isteyen paket, servis ya da font yok.

## Bilinen tuzaklar

- Dünya sahnesi yalnız `/` ve `/tr` sayfasında. Sarmalayıcı `view-transition-name: earth` taşır; kaydırma solması onun `style.opacity` değerine yazılır.
- Sahne yalnız mobilde (tier `low`) 2,5 sn gecikmeli bağlanır (`SETTLE_MS`), masaüstünde hemen. Mobil gecikmeyi kısaltma: Lighthouse TBT bozulur.
- Yerelde `/_vercel/insights/script.js` 404 verir. Beklenen, `<Analytics />` kalacak.
- Headless Chromium'da WebGL için `--use-angle=swiftshader --enable-unsafe-swiftshader` gerekir (`playwright.config.ts`'te var).
