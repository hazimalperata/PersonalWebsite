import clsx from "clsx";
import styles from "@/components/EntrySection/TextArea/index.module.scss";
import React from "react";
import { NameText } from "@/components/icons";
import ProfileImage from "@/public/assets/new_profile.jpg";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function TextArea() {
  const t = useTranslations("HomePage.heroSection");

  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={ProfileImage}
        alt="profile_image"
        width={300}
        height={300}
        placeholder="blur"
        className={clsx(
          "h-[300px] w-[300px] rounded-full object-cover",
          styles.profileImage,
        )}
      />
      <NameText
        className={clsx(
          "stroke-darkGrey stroke-2 dark:stroke-white",
          styles.textFillAnimation,
        )}
      />
      <div
        className={clsx(
          "inline-block select-none text-6xl opacity-0",
          styles.textContainer,
        )}
      >
        <span
          className={clsx(
            "inline-block w-full overflow-hidden whitespace-nowrap border-r-2 border-current font-medium",
            styles.typingTextAnimation,
          )}
        >
          {t("title")}
        </span>
      </div>
      <div className="relative flex h-10 w-7 justify-center rounded-full border-2 border-gray-700 dark:border-gray-300">
        <div
          className={clsx(
            "absolute h-2 w-1 rounded-full bg-gray-700 dark:bg-gray-300",
            styles.mouseWheel,
          )}
        />
      </div>
    </div>
  );
}
