# KALAN — hazimalperata.com yeniden tasarım

Son güncelleme: 2026-10-16. Dal: `redesign` (henüz `master`'a gitmedi).

## Bitenler

- Yeni yığın: Next App Router, next-intl (en + tr), Tailwind 4, koyu/açık tema.
- Ana sayfa: hero, seçili işler + liste, hakkında, galeri (lightbox), iletişim.
- Kaydırmayla dönen dünya sahnesi, düşük cihaz ve reduced-motion için poster.
- Proje sayfaları (MDX), proje geçişleri, 404 sayfası.
- Tek yükleme koreografisi (hero) ve köşe yükleme göstergesi.
- Kalite kapısı: `yarn gate`, `yarn e2e` (Playwright masaüstü + mobil, axe), Lighthouse ölçümü (`docs/perf/`).

## Açık işler (Hazım'da)

1. **Türkçe metinler:** `messages/tr.json` ve `src/data/*` içindeki Türkçe ifadeleri gözden geçir. Ben yeniden yazmadım.
2. **Galeri alt metinleri:** `src/data/gallery.ts` içindeki alt metinler geçici ("Photo 3 from Hazim's gallery"). Gerçek açıklamalarla değiştir (EN + TR).
3. **Proje durumları** (`completed`, `inProgress`, `planned`): `content/projects/*.mdx` içinde doğru mu bak.
4. **Vercel preview:** `redesign` dalının preview adresini aç, telefonda ve gerçek GPU'lu bir bilgisayarda gez.
5. **`master`'a geçiş:** yukarıdakiler bitince karar ver. `master`'a OK olmadan push yok.
6. **Subjektif notlar** (`docs/perf/README.md` sonunda): mobil başlıktaki nav kaydırma, açık temada atmosfer halkası.

## Sonraki adımlar (isteğe bağlı)

- Mobile performance 0.83 (target 0.90) accepted by the owner on 2026-10-16; observed LCP ~180 ms. Masaüstü puanı 0,95 – 0,96. Nedeni ve denenenler `docs/perf/README.md` içinde. Sahne mobilde 2,5 sn gecikmeli bağlanır, masaüstünde hemen.
- Görsel tur ve Lighthouse çıktıları depoda değil (git dışı). Yeniden üretmek için `node scripts/shots.mjs` (sunucu açıkken) ve `docs/perf/README.md` komutları.
