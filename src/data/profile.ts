import type { AppLocale } from "@/i18n/routing";

export type L = { en: string; tr: string };

export function pick(l: L, locale: AppLocale): string {
  return l[locale];
}

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

export interface SkillGroup {
  title: L;
  items: string[];
}

const email = "hazimalperata@gmail.com";

export const profile = {
  name: "Hazim Alper Ata",
  role: {
    en: "Front & Mobile Engineer",
    tr: "Frontend ve Mobil Geliştirici",
  } satisfies L,
  email,
  location: { city: "Bursa", lat: 40.19, lon: 29.06, tz: "Europe/Istanbul" },

  intro: [
    {
      en: "I'm a frontend and mobile developer with experience building and scaling real-world products from scratch. At 1likte I lead the development of a production platform, from the web panels to the mobile app.",
      tr: "Gerçek ürünleri sıfırdan kurma ve ölçekleme deneyimi olan bir frontend ve mobil geliştiriciyim. 1likte'de web panellerinden mobil uygulamaya kadar canlıda çalışan bir platformun geliştirilmesine liderlik ediyorum.",
    },
    {
      en: "I specialize in React, Next.js and React Native, and care about performance, scalability and the details of user experience. Outside of work I'm exploring Go for APIs and game development.",
      tr: "React, Next.js ve React Native üzerine uzmanlaşıyorum; performansa, ölçeklenebilirliğe ve kullanıcı deneyiminin ayrıntılarına önem veriyorum. İş dışında API ve oyun geliştirme için Go'yu keşfediyorum.",
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
      company: "1likte",
      role: { en: "Frontend Lead", tr: "Frontend Lideri" },
      from: "2021-11",
      to: null,
      points: [
        {
          en: "Developed 1likte's web platform and mobile application from scratch, managing all technology choices, architecture, and implementation processes.",
          tr: "1likte'nin web platformunu ve mobil uygulamasını sıfırdan geliştirdim; tüm teknoloji seçimlerini, mimariyi ve uygulama süreçlerini yönettim.",
        },
        {
          en: "Built Next.js-based Seller Panel, Admin Panel, Landing Page, and Link Shortener projects, ensuring platform scalability.",
          tr: "Platformun ölçeklenebilirliğini gözeterek Next.js tabanlı Satıcı Paneli, Admin Paneli, Landing Page ve Link Kısaltıcı projelerini geliştirdim.",
        },
        {
          en: "Implemented localization and security optimizations, enabling the platform to adapt quickly and securely to multiple markets.",
          tr: "Yerelleştirme ve güvenlik iyileştirmeleri yaparak platformun birden fazla pazara hızlı ve güvenli biçimde uyum sağlamasını mümkün kıldım.",
        },
        {
          en: "Converted Figma designs into pixel-perfect interfaces, improving overall user experience.",
          tr: "Figma tasarımlarını piksel hassasiyetinde arayüzlere dönüştürerek genel kullanıcı deneyimini iyileştirdim.",
        },
        {
          en: "Developed mobile application interfaces using React Native and Expo, managing the deployment and store submission process.",
          tr: "React Native ve Expo ile mobil uygulama arayüzlerini geliştirdim; yayın ve mağazaya gönderim sürecini yönettim.",
        },
        {
          en: "Created and optimized email templates and systems, strengthening the platform's communication infrastructure.",
          tr: "E-posta şablonlarını ve sistemlerini oluşturup optimize ederek platformun iletişim altyapısını güçlendirdim.",
        },
        {
          en: "Performed performance analysis and implemented optimizations, ensuring fast and efficient web applications.",
          tr: "Performans analizleri yaptım ve optimizasyonlar uygulayarak web uygulamalarının hızlı ve verimli çalışmasını sağladım.",
        },
        {
          en: "Defined technical roadmap and analyzed future needs to plan and manage development processes.",
          tr: "Teknik yol haritasını belirledim, gelecekteki ihtiyaçları analiz ederek geliştirme süreçlerini planladım ve yönettim.",
        },
        {
          en: "Implemented SEO optimizations to enhance platform visibility and reach.",
          tr: "Platformun görünürlüğünü ve erişimini artırmak için SEO optimizasyonları uyguladım.",
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
          en: "Developed an online education platform from scratch, contributing to the digitalization of internal training systems.",
          tr: "Kurum içi eğitim sistemlerinin dijitalleşmesine katkı sağlayarak çevrimiçi bir eğitim platformunu sıfırdan geliştirdim.",
        },
        {
          en: "Improved UI/UX and fixed usability issues across multiple web platforms.",
          tr: "Birden fazla web platformunda arayüz ve kullanıcı deneyimini iyileştirdim, kullanılabilirlik sorunlarını giderdim.",
        },
        {
          en: "Worked with Django to support backend development and improve system efficiency.",
          tr: "Django ile çalışarak backend geliştirmeye destek verdim ve sistem verimliliğini artırdım.",
        },
        {
          en: "Optimized database structures for faster and more reliable data flow.",
          tr: "Daha hızlı ve güvenilir veri akışı için veritabanı yapılarını optimize ettim.",
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
          en: "Improved performance through code optimization and best practices.",
          tr: "Kod optimizasyonu ve en iyi uygulamalarla performansı iyileştirdim.",
        },
        {
          en: "Contributed to experimental projects and explored new frontend technologies.",
          tr: "Deneysel projelere katkıda bulundum ve yeni frontend teknolojilerini keşfettim.",
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
        en: "BSc in Computer Engineering (GPA: 2.98 / 4.00)",
        tr: "Bilgisayar Mühendisliği Lisans (GNO: 2,98 / 4,00)",
      },
    },
  ] satisfies EducationItem[],

  skills: [
    {
      title: { en: "Frontend", tr: "Frontend" },
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: { en: "Mobile", tr: "Mobil" },
      items: ["React Native", "Expo"],
    },
    {
      title: { en: "Backend & systems", tr: "Backend ve sistemler" },
      items: ["Go", "Node.js", "Express", "MySQL", "REST API"],
    },
    {
      title: { en: "Performance & optimization", tr: "Performans ve optimizasyon" },
      items: ["SEO", "LCP", "Caching", "TanStack", "Zustand"],
    },
  ] satisfies SkillGroup[],
};

export type Profile = typeof profile;
