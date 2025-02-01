"use client";

import styles from "./index.module.scss";
import clsx from "clsx";
import Technology, { Tech } from "@/components/Technologies/TechnologySection";
import React from "react";
import {
  AxiosIcon,
  CSharpIcon,
  CssIcon,
  DockerIcon,
  ExpressJsIcon,
  FigmaIcon,
  GithubIcon,
  GitIcon,
  HtmlIcon,
  JavascriptIcon,
  JestIcon,
  MotionIcon,
  MySqlIcon,
  NextJsIcon,
  OllamaIcon,
  PostmanIcon,
  PyCharmIcon,
  PythonIcon,
  ReactIcon,
  ReactNativeIcon,
  ReduxIcon,
  SanityIcon,
  SassIcon,
  SwaggerIcon,
  TailwindIcon,
  TanstackIcon,
  TypescriptIcon,
  VercelIcon,
  WebstormIcon,
} from "@/components/icons";
import useOnScreen from "@/utils/useOnScreen";
import { useTranslations } from "next-intl";
import TechnologyCategory from "@/components/Technologies/TechnologyCategory";

type TechCategory = {
  title: string;
  technologies: Tech[];
};

export default function Technologies() {
  const t = useTranslations("HomePage.techStack");

  const allTechnologies: TechCategory[][] = [
    [
      {
        title: t("programmingLanguages"),
        technologies: [
          {
            icon: PythonIcon,
            name: "Python",
          },
          {
            icon: JavascriptIcon,
            name: "Javascript",
          },
          {
            icon: TypescriptIcon,
            name: "Typescript",
          },
          {
            icon: HtmlIcon,
            name: "HTML (imposter)",
          },
          {
            icon: CSharpIcon,
            name: "C#",
          },
        ],
      },
    ],
    [
      {
        title: t("frameworks"),
        technologies: [
          {
            icon: NextJsIcon,
            name: "NextJS",
          },
          {
            icon: ReactIcon,
            name: "ReactJs",
          },
          {
            icon: ReactNativeIcon,
            name: "ReactNative",
          },
        ],
      },
    ],
    [
      {
        title: t("styleTools"),
        technologies: [
          {
            icon: FigmaIcon,
            name: "Figma",
          },
          {
            icon: CssIcon,
            name: "CSS",
          },
          {
            icon: SassIcon,
            name: "SASS/SCSS",
          },
          {
            icon: TailwindIcon,
            name: "TailwindCSS",
          },
        ],
      },
    ],
    [
      {
        title: t("apiRequests"),
        technologies: [
          {
            icon: ExpressJsIcon,
            name: "ExpressJS",
          },
          {
            icon: NextJsIcon,
            name: "NextJS",
          },
          {
            icon: SwaggerIcon,
            name: "Swagger",
          },
          {
            icon: PostmanIcon,
            name: "Postman",
          },
        ],
      },
    ],
    [
      {
        title: t("ides"),
        technologies: [
          {
            icon: WebstormIcon,
            name: "WebStorm",
          },
          {
            icon: PyCharmIcon,
            name: "PyCharm",
          },
        ],
      },
    ],
    [
      {
        title: t("libraries"),
        technologies: [
          {
            icon: TanstackIcon,
            name: "Tanstack",
          },
          {
            icon: MotionIcon,
            name: "Motion",
          },
          {
            icon: AxiosIcon,
            name: "Axios",
          },
          {
            icon: ReduxIcon,
            name: "Redux",
          },
        ],
      },
    ],
    [
      {
        title: t("containerization"),
        technologies: [
          {
            icon: DockerIcon,
            name: "Docker",
          },
        ],
      },
      {
        title: t("testing"),
        technologies: [
          {
            icon: JestIcon,
            name: "Jest",
          },
        ],
      },
    ],
    [
      {
        title: t("versionControlSystem"),
        technologies: [
          {
            icon: GitIcon,
            name: "Git",
          },
          {
            icon: GithubIcon,
            name: "Github",
          },
        ],
      },
      {
        title: t("ai"),
        technologies: [
          {
            icon: OllamaIcon,
            name: "Ollama",
          },
        ],
      },
    ],
    [
      {
        title: t("cms"),
        technologies: [
          {
            icon: SanityIcon,
            name: "Sanity",
          },
        ],
      },
      {
        title: t("cloudPlatform"),
        technologies: [
          {
            icon: VercelIcon,
            name: "Vercel",
          },
        ],
      },
    ],
    [
      {
        title: t("database"),
        technologies: [
          {
            icon: MySqlIcon,
            name: "MySQL",
          },
        ],
      },
    ],
  ];

  const { ref, isIntersecting } = useOnScreen();

  return (
    <section className="py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center space-y-10 px-5 sm:px-10 md:px-12 lg:px-5">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1
            ref={ref}
            className={clsx(
              "fromBlurAppear text-2xl lg:text-3xl font-bold capitalize",
              {
                atScreen: isIntersecting,
              },
            )}
          >
            {t("title")}
          </h1>
        </div>
        <div className="flex flex-col gap-y-10 items-center">
          {allTechnologies.map((technologies, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-y-10 sm:gap-y-0 items-center justify-between w-full"
            >
              {technologies.map((technology, index) => (
                <div
                  key={technology.title + index}
                  className="flex flex-col gap-y-1 items-center w-full"
                >
                  <div className="text-lg lg:text-xl font-medium capitalize">
                    {technology.title}
                  </div>
                  <TechnologyCategory technologies={technology.technologies} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
