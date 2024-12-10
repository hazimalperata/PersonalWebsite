import Link from "next/link"
import {FaGithub, FaLinkedin} from "react-icons/fa"
import {MdFacebook} from "react-icons/md"
import {RiInstagramFill} from "react-icons/ri"


export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 grid grid-cols-2 gap-12 lg:gap-16 py-20">
        <div className="space-y-6">
          <Link href="#">
            {/*<span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-800 to-indigo-400 font-bold text-2xl">U</span>*/}
            Logo
          </Link>
          <p className="max-w-lg">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur quo aliquam est ipsam. Magni,
            iusto,
          </p>
        </div>
        <div className="flex justify-end items-center w-full gap-3">
          <a href="#" className="p-1 rounded-full hover:text-blue-600 group hover:scale-110 transition-all">
            <MdFacebook fontSize={24} className="group-hover:scale-110"/>
          </a>
          <a href="#" className="p-1 rounded-full hover:text-blue-600 group hover:scale-110 transition-all">
            <FaLinkedin fontSize={24} className="group-hover:scale-110"/>
          </a>
          <a href="#" className="p-1 rounded-full hover:text-blue-600 group hover:scale-110 transition-all">
            <RiInstagramFill fontSize={24} className="group-hover:scale-110"/>
          </a>
          <a href="#" className="p-1 rounded-full hover:text-blue-600 group hover:scale-110 transition-all">
            <FaGithub fontSize={24} className="group-hover:scale-110"/>
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5">
        <div className="w-full flex justify-center py-3 border-t border-gray-200 dark:border-t-gray-800 text-gray-700 dark:text-gray-300">
          <div className="flex text-center sm:text-left sm:min-w-max">
            <p> ©2024 | Made with 💕 </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
