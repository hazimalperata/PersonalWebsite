export type L = { en: string; tr: string };

export type SocialIcon = "linkedin" | "github" | "instagram" | "email";

export interface ExperienceItem {
  company: string;
  role: L;
  /** ISO month, e.g. "2021-11" */
  from: string;
  /** ISO month; `null` means "present" */
  to: string | null;
  points: L[];
}

export interface EducationItem {
  name: L;
  description: L;
}

const email = "hazimalperata@gmail.com";

export const profile = {
  name: "Hazim Alper Ata",
  role: {
    en: "Product Engineer",
    tr: "Ürün Mühendisi",
  } satisfies L,
  email,
  location: { city: "Bursa", lat: 40.19, lon: 29.06, tz: "Europe/Istanbul" },

  intro: [
    {
      en: "I'm a product engineer. I make the product decisions and build all of it: web, mobile, the backend and the infrastructure underneath. At 1likte I run a live platform end to end, from the web panels to the mobile app.",
      tr: "Ürün mühendisiyim. Ürün kararlarını veriyorum ve işin tamamını kuruyorum: web, mobil, backend ve altındaki altyapı. 1likte'de canlıda çalışan platformu web panellerinden mobil uygulamaya kadar uçtan uca yürütüyorum.",
    },
    {
      en: "On the front end I use React, Next.js and React Native. Behind them I build the APIs, databases and deployments. I care about performance, scalability and the small details of user experience. Outside work I'm learning Go for APIs and getting into game development.",
      tr: "Önyüzde React, Next.js ve React Native kullanıyorum, arkada API'leri, veritabanlarını ve yayın altyapısını kuruyorum. Performansı, ölçeklenebilirliği ve kullanıcı deneyimindeki küçük ayrıntıları önemsiyorum. İş dışında API'ler için Go öğreniyorum, oyun geliştirmeyle de uğraşıyorum.",
    },
  ] satisfies L[],

  social: [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/hazim-alper-ata/", icon: "linkedin" },
    { name: "GitHub", href: "https://github.com/hazimalperata", icon: "github" },
    { name: "Instagram", href: "https://www.instagram.com/hazim.alper.ata/", icon: "instagram" },
    { name: "Email", href: `mailto:${email}`, icon: "email" },
  ] satisfies Array<{ name: string; href: string; icon: SocialIcon }>,

  cv: {
    en: "/Hazim_Alper_Ata-EN-CV.pdf",
    tr: "/Hazim_Alper_Ata-TR-CV.pdf",
  } satisfies L,

  experience: [
    {
      company: "Tersane Dijital",
      role: { en: "Mobile & Web Engineer", tr: "Mobil ve Web Geliştirici" },
      from: "2026-07",
      to: null,
      points: [
        {
          en: "Build and ship Dremly (Expo, React Native) and Posme (Flutter). Both are live on the App Store and Google Play.",
          tr: "Dremly'yi (Expo, React Native) ve Posme'yi (Flutter) geliştirip yayınlıyorum. İkisi de App Store ve Google Play'de.",
        },
        {
          en: "Built a movement-analysis platform for Rommer International, a hospital: pose analysis on the device in the mobile app, a web panel for staff, and the backend.",
          tr: "Rommer International hastanesi için bir hareket analizi platformu kurdum: mobil uygulamada cihaz üzerinde poz analizi, personel için web paneli ve backend.",
        },
        {
          en: "Maintain the mobile app template and admin kit that new apps start from.",
          tr: "Yeni uygulamaların üzerine kurulduğu mobil uygulama şablonunu ve admin kitini geliştiriyorum.",
        },
      ],
    },
    {
      company: "1likte",
      role: { en: "CTO", tr: "CTO" },
      from: "2021-11",
      to: null,
      points: [
        {
          en: "Built 1likte's web platform and mobile app from scratch and made the technology and architecture decisions.",
          tr: "1likte'nin web platformunu ve mobil uygulamasını sıfırdan kurdum, teknoloji ve mimari kararlarını verdim.",
        },
        {
          en: "Built the seller panel, admin panel, landing page and link shortener with Next.js.",
          tr: "Satıcı panelini, admin panelini, tanıtım sitesini ve link kısaltıcıyı Next.js ile geliştirdim.",
        },
        {
          en: "Added localization and security improvements so the platform can open up to new markets.",
          tr: "Platformun yeni pazarlara açılabilmesi için yerelleştirme ve güvenlik iyileştirmeleri yaptım.",
        },
        {
          en: "Turned Figma designs into interfaces that match them closely.",
          tr: "Figma tasarımlarını bire bir arayüze çevirdim.",
        },
        {
          en: "Built the mobile app's interfaces with React Native and Expo, and handled releases and store submissions.",
          tr: "Mobil uygulamanın arayüzlerini React Native ve Expo ile geliştirdim, yayın ve mağaza gönderimlerini yürüttüm.",
        },
        {
          en: "Built and tuned the email templates and the system that sends them.",
          tr: "E-posta şablonlarını ve onları gönderen sistemi kurup iyileştirdim.",
        },
        {
          en: "Measured web performance and optimized the slow parts.",
          tr: "Web uygulamalarının performansını ölçtüm, yavaş kalan yerleri hızlandırdım.",
        },
        {
          en: "Set the technical roadmap and planned development around upcoming needs.",
          tr: "Teknik yol haritasını belirledim, geliştirmeyi gelecek ihtiyaçlara göre planladım.",
        },
        {
          en: "Worked on SEO to make the platform easier to find.",
          tr: "Platformun aramalarda daha kolay bulunması için SEO çalışması yaptım.",
        },
      ],
    },
    {
      company: "Baykar",
      role: { en: "Web Software Intern", tr: "Web Yazılım Stajyeri" },
      from: "2023-08",
      to: "2023-10",
      points: [
        {
          en: "Built an online training platform from scratch for in-house training.",
          tr: "Kurum içi eğitimler için çevrimiçi bir eğitim platformunu sıfırdan geliştirdim.",
        },
        {
          en: "Fixed usability issues and improved the UI on several web platforms.",
          tr: "Birkaç web platformunda kullanılabilirlik sorunlarını giderdim, arayüzü iyileştirdim.",
        },
        {
          en: "Worked on the Django backend and made it run more efficiently.",
          tr: "Django backend'inde çalıştım, sistemi daha verimli hâle getirdim.",
        },
        {
          en: "Reworked database structures so data moves faster and more reliably.",
          tr: "Veri daha hızlı ve güvenilir aksın diye veritabanı yapılarını yeniden düzenledim.",
        },
      ],
    },
    {
      company: "Inovathings",
      role: { en: "Frontend Developer", tr: "Frontend Geliştirici" },
      from: "2020-04",
      to: "2021-04",
      points: [
        {
          en: "Developed responsive web interfaces using React and modern CSS.",
          tr: "React ve modern CSS ile duyarlı web arayüzleri geliştirdim.",
        },
        {
          en: "Optimized code to make the interfaces faster.",
          tr: "Kodu optimize ederek arayüzleri hızlandırdım.",
        },
        {
          en: "Worked on experimental projects and tried out new frontend technologies.",
          tr: "Deneysel projelerde çalıştım, yeni frontend teknolojilerini denedim.",
        },
      ],
    },
  ] satisfies ExperienceItem[],

  education: [
    {
      name: {
        en: "Izmir Institute of Technology - IZTECH",
        tr: "İzmir Yüksek Teknoloji Enstitüsü - IZTECH",
      },
      description: {
        en: "BSc in Computer Engineering",
        tr: "Bilgisayar Mühendisliği Lisans",
      },
    },
  ] satisfies EducationItem[],
};

export type Profile = typeof profile;
