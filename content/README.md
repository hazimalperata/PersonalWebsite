# İçerik

Vaka sayfaları `content/projects/` altındaki MDX dosyalarından gelir.

## Yeni proje eklemek

1. `content/projects/<slug>.en.mdx` dosyasını oluştur. `<slug>` küçük harf ve tire içerir, adres olur (`/work/<slug>`).
2. İstersen aynı klasöre `<slug>.tr.mdx` ekle. Türkçe dosya yoksa İngilizce gösterilir ve sayfada "Bu sayfa İngilizce" notu çıkar.
3. Frontmatter alanları (iki dilde de aynı olmalı):

| Alan | Açıklama |
| --- | --- |
| `title`, `summary` | Başlık ve kısa özet (dile göre çevir). |
| `publishedAt` | `YYYY-MM-DD`. Öne çıkmayan projeler bu tarihe göre yeniden eskiye sıralanır. |
| `year` | Görünen yıl veya aralık, örn. `"2025"` ya da `"2021–2026"`. Boşsa `publishedAt` yılı. |
| `images` | `/images/projects/<slug>/...` yolları. İlki kapak görselidir. |
| `link` | İsteğe bağlı canlı adres. |
| `status` | `completed`, `inProgress` veya `planned`. |
| `role` | Projedeki rolün. |
| `stack` | Kullanılan teknolojiler (liste). |
| `featured` | `true` ise "Selected work" bölümünde çıkar. |
| `order` | Öne çıkanlar arasındaki sıra (küçük olan önce). Öne çıkmayanlar için `99`. |

## Görseller

- Dosyaları `public/images/projects/<slug>/` altına koy.
- Genişlik en fazla 1600 px olsun; mümkünse WebP kullan.
- GIF dosyaları optimize edilmeden sunulur, o yüzden küçük tut.
- İçerikte standart Markdown görseli kullan: `![açıklama](/images/projects/<slug>/x.webp)`.
