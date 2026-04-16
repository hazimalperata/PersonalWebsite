import {About, Blog, Gallery, Home, Newsletter, Person, Social, Work} from "@/types";
import {Line, Row, Text} from "@once-ui-system/core";

const person: Person = {
  firstName: "Hazim Alper",
  lastName: "Ata",
  name: `Hazim Alper Ata`,
  role: "Front & Mobile Engineer",
  avatar: "/images/avatar.jpeg",
  email: "hazimalperata@gmail.com",
  timeZone: "Europe/Istanbul",
  location: "Turkey/Bursa", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "German", "Turkish (Native)",], // optional: Leave the array empty if you don't want to display languages
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/hazim-alper-ata/",
    essential: true,
  },
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/hazimalperata",
    essential: true,
  },
  {
    name: "Facebook",
    icon: "facebook",
    link: "https://www.facebook.com/hazimalperata",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/hazim.alper.ata/",
    essential: false,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.png",
  label: "Home",
  title: `${person.name} – Frontend & Mobile Developer`,
  description: `I build scalable web and mobile applications using React, Next.js and React Native.`,
  headline: <>Building scalable products from idea to production</>,

  subline: (
    <>
      I'm a frontend and mobile developer specializing in <strong>React, Next.js and React Native</strong>.
      I design and build complete products — from UI to production-ready systems — with a focus on performance,
      scalability and user experience.
    </>
  ),

  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">1likte</strong>
        <Line background="brand-alpha-strong" vert height="20"/>
        <Text marginRight="4" onBackground="brand-medium">
          Current Main Project
        </Text>
      </Row>
    ),
    href: "/work",
  },
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,

  tableOfContent: {
    display: true,
    subItems: false,
  },

  avatar: {
    display: true,
  },

  calendar: {
    display: false,
    link: ""
  },

  intro: {
    display: true,
    title: "Who I am",
    description: (
      <>
        A frontend and mobile developer with experience building and scaling real-world products from scratch, leading
        development of a production platform in 1likte. Also exploring Go language for API and game development.
      </>
    ),
  },

  work: {
    display: true,
    title: "Experience",
    experiences: [
      {
        company: "1likte",
        timeframe: "Nov 2021 – Present",
        role: "Frontend Lead",
        achievements: [
          <>
            Developed 1likte’s web platform and mobile application from scratch, managing all technology choices,
            architecture, and implementation processes.
          </>,
          <>
            Built Next.js-based Seller Panel, Admin Panel, Landing Page, and Link Shortener projects, ensuring platform
            scalability.
          </>,
          <>
            Implemented localization and security optimizations, enabling the platform to adapt quickly and securely to
            multiple markets.
          </>,
          <>
            Converted Figma designs into pixel-perfect interfaces, improving overall user experience.
          </>,
          <>
            Developed mobile application interfaces using React Native and Expo, managing the deployment and store
            submission process.
          </>,
          <>
            Created and optimized email templates and systems, strengthening the platform’s communication
            infrastructure.
          </>,
          <>
            Performed performance analysis and implemented optimizations, ensuring fast and efficient web applications.
          </>,
          <>
            Defined technical roadmap and analyzed future needs to plan and manage development processes.
          </>,
          <>
            Implemented SEO optimizations to enhance platform visibility and reach.
          </>,
        ],
        images: [],
      },
      {
        company: "Baykar",
        timeframe: "Aug 2023 – Oct 2023",
        role: "Web Software Intern",
        achievements: [
          <>
            Developed an online education platform from scratch, contributing to the digitalization of internal training
            systems.
          </>,
          <>
            Improved UI/UX and fixed usability issues across multiple web platforms.
          </>,
          <>
            Worked with Django to support backend development and improve system efficiency.
          </>,
          <>
            Optimized database structures for faster and more reliable data flow.
          </>,
        ],
        images: [],
      },
      {
        company: "Inovathings",
        timeframe: "Apr 2020 – Apr 2021",
        role: "Frontend Developer",
        achievements: [
          <>
            Developed responsive web interfaces using React and modern CSS.
          </>,
          <>
            Improved performance through code optimization and best practices.
          </>,
          <>
            Contributed to experimental projects and explored new frontend technologies.
          </>,
        ],
        images: [],
      },
    ],
  },

  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "Izmir Institute of Technology - IZTECH",
        description: (
          <>BSc in Computer Engineering (GPA: 2.98 / 4.00)</>
        ),
      }
    ],
  },

  technical: {
    display: true,
    title: "Technical Skills",
    skills: [
      {
        title: "Frontend Development",
        description: (
          <>Building scalable web applications with performance and UX focus.</>
        ),
        tags: [
          {name: "React", icon: "react"},
          {name: "Next.js", icon: "nextjs"},
          {name: "TypeScript", icon: "typescript"},
          {name: "Tailwind", icon: "tailwind"},
        ],
        images: [],
      },
      {
        title: "Mobile Development",
        description: (
          <>Cross-platform mobile apps using React Native and Expo.</>
        ),
        tags: [
          {name: "React Native", icon: "react"},
          {name: "Expo", icon: "expo"},
        ],
        images: [],
      },
      {
        title: "Backend & System",
        description: (
          <>Working with APIs, authentication systems and scalable architectures.</>
        ),
        tags: [
          {name: "GO", icon: "golang"},
          {name: "Node.js", icon: "nodejs"},
          {name: "Express", icon: "nodejs"},
          {name: "MySQL", icon: "mysql"},
          {name: "REST API", icon: "link"},
        ],
        images: [],
      },
      {
        title: "Performance & Optimization",
        description: (
          <>Focused on SEO, performance metrics and scalable system design.</>
        ),
        tags: [
          {name: "SEO", icon: "search"},
          {name: "LCP", icon: "speed"},
          {name: "Caching", icon: "storage"},
          {name: "Tanstack", icon: "tanstack"},
          {name: "Zustand", icon: "zustand"}
        ],
        images: [],
      },
    ],
  },
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-2.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-4.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-5.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-5.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-6.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-6.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-7.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-7.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-8.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-8.jpeg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export {person, social, home, about, work, gallery};
