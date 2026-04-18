import { IconType } from 'react-icons';

import {
  HiArrowUpRight,
  HiOutlineLink,
  HiArrowTopRightOnSquare,
  HiEnvelope,
  HiCalendarDays,
  HiArrowRight,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineDocument,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineRocketLaunch,
  HiRectangleStack,
  HiCheckBadge,
} from 'react-icons/hi2';

import {
  PiHouseDuotone,
  PiUserCircleDuotone,
  PiGridFourDuotone,
  PiBookBookmarkDuotone,
  PiImageDuotone,
  PiLightning,
} from 'react-icons/pi';

import {
  SiJavascript,
  SiNextdotjs,
  SiFigma,
  SiSupabase,
  SiTailwindcss,
  SiExpo,
  SiReactquery,
} from 'react-icons/si';

import {
  FaDiscord,
  FaGithub,
  FaLinkedin,
  FaX,
  FaThreads,
  FaInstagram,
  FaXTwitter,
  FaFacebook,
  FaPinterest,
  FaWhatsapp,
  FaReddit,
  FaTelegram,
  FaGolang,
} from 'react-icons/fa6';
import { FaNodeJs, FaReact } from 'react-icons/fa';
import { BsTypescript } from 'react-icons/bs';
import { DiMysql } from 'react-icons/di';
import { MdStorage } from 'react-icons/md';
import { TbProgress } from 'react-icons/tb';
import { GrDocumentUser } from 'react-icons/gr';

export const iconLibrary: Record<string, IconType> = {
  arrowUpRight: HiArrowUpRight,
  arrowRight: HiArrowRight,
  email: HiEnvelope,
  globe: HiOutlineGlobeAsiaAustralia,
  person: PiUserCircleDuotone,
  grid: PiGridFourDuotone,
  book: PiBookBookmarkDuotone,
  openLink: HiOutlineLink,
  calendar: HiCalendarDays,
  home: PiHouseDuotone,
  gallery: PiImageDuotone,
  discord: FaDiscord,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaX,
  twitter: FaXTwitter,
  threads: FaThreads,
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,
  document: HiOutlineDocument,
  rocket: HiOutlineRocketLaunch,
  javascript: SiJavascript,
  nextjs: SiNextdotjs,
  supabase: SiSupabase,
  figma: SiFigma,
  facebook: FaFacebook,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
  reddit: FaReddit,
  telegram: FaTelegram,
  instagram: FaInstagram,
  react: FaReact,
  typescript: BsTypescript,
  tailwind: SiTailwindcss,
  expo: SiExpo,
  nodejs: FaNodeJs,
  mysql: DiMysql,
  golang: FaGolang,
  tanstack: SiReactquery,
  speed: PiLightning,
  storage: MdStorage,
  completed: HiCheckBadge,
  inProgress: TbProgress,
  cv: GrDocumentUser,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
