'use client'

import {IoIosArrowRoundUp} from "react-icons/io";
import {useEffect, useState} from "react";
import clsx from "clsx";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js

  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({top: 0, behavior: 'smooth'});
  }


  const handleScroll = () => {
    // Show the button when the user scrolls down
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    // Add scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      className={clsx("fixed bottom-0 right-0 bg-black rounded-s-full px-4 py-2 mb-[71px] z-50 items-center text-xs flex gap-2 transition-opacity duration-300", {
        "opacity-100": isVisible,
        "opacity-0": !isVisible
      })}
      onClick={scrollToTop}
    >
      BACK TO TOP
      <IoIosArrowRoundUp className="inline-block h-4 w-4"/>
    </button>
  )
}
