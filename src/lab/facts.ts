/**
 * Shared, verified content for the /lab design prototypes. Every number here comes from the repos or the
 * public stores (counted 2026-10-16); prototypes must not invent others.
 */

export interface ProofFact {
  value: number;
  /** Shown right after the number, e.g. "+" */
  suffix: string;
  label: string;
}

export interface LabWork {
  slug: string;
  title: string;
  kind: "Product" | "Client" | "Startup" | "Personal";
  summary: string;
  role: string;
  stack: string[];
  year: string;
  platforms: string[];
  /** Public screenshots under /public; empty when none may be shown yet. */
  images: string[];
  /** Case study on the site, if one exists. */
  href?: string;
  /** Public store or live links. */
  links: Array<{ label: string; href: string }>;
  /** Phone-shaped screenshots (portrait), so a device mockup fits them. */
  portrait: boolean;
}

export const labFacts = {
  name: "Hazim Alper Ata",
  role: "Frontend & Mobile Engineer",
  location: "Bursa, Türkiye",
  timezone: "Europe/Istanbul",
  email: "hazimalperata@gmail.com",
  cv: "/Hazim_Alper_Ata-EN-CV.pdf",
  social: [
    { name: "GitHub", href: "https://github.com/hazimalperata" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/hazim-alper-ata/" },
    { name: "Instagram", href: "https://www.instagram.com/hazim.alper.ata/" },
  ],
  /** The one thing a visitor should leave with (owner's words, 2026-10-16). */
  message:
    "Whatever I take on, I build it to the highest standard: serious, real, and done the way modern technology says it should be done.",
  proof: [
    { value: 2, suffix: "", label: "apps live on the App Store and Google Play" },
    { value: 1600, suffix: "+", label: "commits on the 1likte seller panel since 2022" },
    { value: 880, suffix: "+", label: "commits on the 1likte mobile app" },
    { value: 6, suffix: "+", label: "years shipping production software" },
  ] satisfies ProofFact[],
  capabilities: [
    { title: "Mobile", items: ["React Native", "Expo", "Flutter", "On-device camera & pose analysis", "Store releases"] },
    { title: "Web", items: ["Next.js App Router", "React 19", "TypeScript", "Tailwind CSS", "Design systems"] },
    { title: "Motion & 3D", items: ["GSAP", "Motion", "Three.js / R3F", "WebGL shaders"] },
    { title: "Platform", items: ["NestJS", "Prisma", "PostgreSQL", "CI/CD", "Zero-downtime deploys", "E2E testing"] },
  ],
  experience: [
    { company: "1likte", role: "CTO", from: "2021", to: "present", line: "Built the social e-commerce platform from scratch: seller and admin panels, mobile app, landing, link shortener; leads its modernisation." },
    { company: "Tersane Dijital", role: "Mobile & Web Engineer", from: "2026", to: "present", line: "Builds and ships mobile apps and platforms for Rulead and agency clients: Dremly, Posme, Rommer." },
    { company: "Baykar", role: "Web Software Intern", from: "2023", to: "2023", line: "Built an online education platform from scratch." },
    { company: "Inovathings", role: "Frontend Developer", from: "2020", to: "2021", line: "Responsive React interfaces and performance work." },
  ],
  work: [
    {
      slug: "dremly",
      title: "Dremly",
      kind: "Product",
      summary: "A dream journal: type or speak a dream, and the app interprets it, draws it, and tracks the symbols that keep coming back.",
      role: "Mobile engineer at Tersane Dijital, product by Rulead",
      stack: ["Expo", "React Native", "TypeScript"],
      year: "2026",
      platforms: ["iOS", "Android"],
      images: ["/images/projects/dremly/dremly.webp", "/images/projects/dremly/dremly-1.webp", "/images/projects/dremly/dremly-2.webp"],
      href: "/work/dremly",
      links: [
        { label: "App Store", href: "https://apps.apple.com/us/app/dremly-ai-dream-interpreter/id6789938567" },
        { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.rulead.dremly" },
      ],
      portrait: true,
    },
    {
      slug: "posme",
      title: "Posme",
      kind: "Product",
      summary: "A camera that draws a pose on the live view and coaches you into it, with on-device scoring and a hands-free shutter.",
      role: "Mobile engineer at Tersane Dijital, product by Rulead",
      stack: ["Flutter", "Dart"],
      year: "2026",
      platforms: ["iOS", "Android"],
      images: ["/images/projects/posme/posme.webp", "/images/projects/posme/posme-1.webp"],
      href: "/work/posme",
      links: [
        { label: "App Store", href: "https://apps.apple.com/us/app/posme-ai-your-pose-director/id6782053776" },
        { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.rulead.posme" },
      ],
      portrait: true,
    },
    {
      slug: "rommer",
      title: "Rommer",
      kind: "Client",
      summary: "A movement-analysis platform for a hospital: patients exercise in front of the phone camera, pose is analysed on the device, and staff follow progress in a web panel.",
      role: "Sole engineer: mobile app, staff panel and backend",
      stack: ["React Native", "Vision Camera", "Skia", "Next.js", "NestJS", "PostgreSQL"],
      year: "2026",
      platforms: ["iOS", "Android", "Web"],
      images: [],
      links: [],
      portrait: true,
    },
    {
      slug: "1likte-mobile-application",
      title: "1likte Mobile",
      kind: "Startup",
      summary: "The social shopping app of 1likte, where people buy together for a better price.",
      role: "CTO, built the app",
      stack: ["React Native", "Expo", "TypeScript"],
      year: "2022–2026",
      platforms: ["iOS", "Android"],
      images: ["/images/projects/mobile/mobile.png"],
      href: "/work/1likte-mobile-application",
      links: [],
      portrait: false,
    },
    {
      slug: "1likte-seller-panel",
      title: "1likte Seller Panel",
      kind: "Startup",
      summary: "The panel merchants use to run their stores on 1likte: products, orders, campaigns and finance.",
      role: "CTO, built and modernised it",
      stack: ["Next.js", "React 19", "TypeScript", "Playwright"],
      year: "2022–2026",
      platforms: ["Web"],
      images: ["/images/projects/seller/seller.png"],
      href: "/work/1likte-seller-panel",
      links: [],
      portrait: false,
    },
  ] satisfies LabWork[],
  /** Further work for a compact list. */
  more: [
    { title: "1likte Admin Panel", href: "/work/1likte-admin-panel", line: "Operations panel for the 1likte team." },
    { title: "DUHA Architects", href: "/work/duha-architects-website", line: "Portfolio site for an architecture studio." },
    { title: "The Pale Blue Dot", href: "/work/the-pale-blue-dot", line: "A WebGL tribute to Carl Sagan's photograph." },
    { title: "react-window-modals", href: "/work/react-window-modals", line: "Open-source draggable window modals for React." },
    { title: "Adventures of the Knight", href: "/work/adventures-of-the-knight", line: "A 2D platformer built in Godot." },
  ],
};

export type LabFacts = typeof labFacts;
