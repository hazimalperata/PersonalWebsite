import {FaGithub, FaLinkedin} from "react-icons/fa"
import {MdFacebook} from "react-icons/md"
import {RiInstagramFill} from "react-icons/ri"
import {PersonalLogo} from "@/components/icons";
import {IconType} from "react-icons";
import clsx from "clsx";

type SocialMedia = {
  href: string;
  icon: IconType;
}

export default function Footer() {
  const socialMedias: SocialMedia[] = [
    {href: "https://www.facebook.com/hazim.alper.ata/", icon: MdFacebook},
    {href: "https://www.linkedin.com/in/hazim-alper-ata/", icon: FaLinkedin},
    {href: "https://www.instagram.com/hazim.alper.ata/", icon: RiInstagramFill},
    {href: "https://github.com/hazimalperata", icon: FaGithub},
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 grid grid-cols-2 gap-12 lg:gap-16 py-20">
        <PersonalLogo/>
        <div className="flex justify-end items-center w-full gap-3">
          {socialMedias.map((x, index) => (
            <a key={x.href} target="_blank" href={x.href} className={clsx("p-1 rounded-full group hover:scale-110 transition-all", {
              "hover:text-blue-600": [0, 1].includes(index),
              "hover:text-purple-600": index === 2
            })}>
              {x.icon({size: 24, className: "group-hover:scale-110"})}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5">
        <div className="w-full flex justify-center py-3 border-t border-gray-200 dark:border-t-gray-800 text-gray-700 dark:text-gray-300">
          <div className="flex text-center sm:text-left sm:min-w-max">
            <p> ©2024 | Made with <span className="text-xl">💕</span> </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
