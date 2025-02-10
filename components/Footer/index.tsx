import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdFacebook } from "react-icons/md";
import { RiInstagramFill } from "react-icons/ri";
import { PersonalLogo } from "@/components/icons";
import { IconType } from "react-icons";
import clsx from "clsx";

type SocialMedia = {
  href: string;
  icon: IconType;
};

export default function Footer() {
  const socialMedias: SocialMedia[] = [
    { href: "https://www.facebook.com/hazim.alper.ata/", icon: MdFacebook },
    { href: "https://www.linkedin.com/in/hazim-alper-ata/", icon: FaLinkedin },
    {
      href: "https://www.instagram.com/hazim.alper.ata/",
      icon: RiInstagramFill,
    },
    { href: "https://github.com/hazimalperata", icon: FaGithub },
  ];

  return (
    <footer className="bg-secondary">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-5 py-4 sm:px-10 md:px-12 lg:gap-16 lg:px-5">
        <PersonalLogo />
        <div className="flex w-full items-center justify-end gap-3">
          {socialMedias.map((x, index) => (
            <a
              key={x.href}
              target="_blank"
              href={x.href}
              className={clsx(
                "group rounded-full p-1 transition-all hover:scale-110",
                {
                  "hover:text-blue-600": [0, 1].includes(index),
                  "hover:text-purple-600": index === 2,
                },
              )}
            >
              {x.icon({ size: 24, className: "group-hover:scale-110" })}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 sm:px-10 md:px-12 lg:px-5">
        <div className="flex w-full justify-center border-t border-gray-200 py-3 text-gray-800 dark:border-t-gray-800 dark:text-gray-300">
          <div className="flex text-center sm:min-w-max sm:text-left">
            <p>
              ©2025 | Made with <span className="text-xl">🧠💪</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
