import clsx from "clsx";
import styles from "@/components/Technologies/index.module.scss";
import Technology from "@/components/Technologies/TechnologySection";
import React, { CSSProperties } from "react";
import { TechnologyCategoryProps } from "@/components/Technologies/TechnologyCategory/types";

export default function TechnologyCategory(props: TechnologyCategoryProps) {
  const { technologies } = props;

  const total = technologies.length;

  const centerIndex1 = Math.floor((total - 1) / 2);
  const centerIndex2 = Math.ceil((total - 1) / 2);

  return (
    <div
      style={{ "--data-count": technologies.length } as CSSProperties}
      className={clsx(
        "flex flex-row flex-wrap items-center justify-center",
        styles.technologies,
      )}
    >
      {technologies.map((tech, index) => {
        const distance = Math.min(
          Math.abs(centerIndex1 - index),
          Math.abs(centerIndex2 - index),
        );

        const delay = distance * 0.6;

        return (
          <Technology
            key={tech.name}
            tech={tech}
            style={{ transitionDelay: `${delay}s` }}
          />
        );
      })}
    </div>
  );
}
