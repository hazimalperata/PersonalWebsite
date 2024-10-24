"use client"

import useOnScreen from "@/utils/useOnScreen";
import clsx from "clsx";
import ServiceCard from "@/components/Feature/ServiceCard";

const services = [
  {
    id: 1,
    title: "Social media marketing",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "100% 100%"
  },
  {
    id: 2,
    title: "Email marketing",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "50% 100%"
  },
  {
    id: 3,
    title: "Service 3",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "0% 100%"
  },
  {
    id: 4,
    title: "Email marketing",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "100% 0%"
  },
  {
    id: 5,
    title: "Service 4",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "50% 0%"
  },
  {
    id: 6,
    title: "Email marketing",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto deserunt culpa autem",
    icon: "send",
    transformValues: "0% 0%"
  },
]
export default function Services() {

  const titleOnScreen = useOnScreen();
  const descriptionOnScreen = useOnScreen();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 flex flex-col items-center gap-10 xl:gap-14">
        <div className="text-center max-w-3xl mx-auto space-y-4 z-1">
          <h1 ref={titleOnScreen.ref} className={clsx("fromBlurAppear text-gray-900 dark:text-white font-semibold text-4xl", {
            "atScreen": titleOnScreen.isIntersecting
          })}>
            What can I offer?
          </h1>
          <p ref={descriptionOnScreen.ref} className={clsx("fromBlurAppear text-gray-700 dark:text-gray-300", {
            "atScreen": descriptionOnScreen.isIntersecting
          })}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-6 z-1 w-3/4">
          {services.map(service => (
            <ServiceCard key={service.id} {...service} />
          ))}
          <div className="absolute w-[70%] h-[300px] rounded-2xl -z-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{backgroundSize: "200% auto", backgroundImage: "linear-gradient(-45deg,red,blue)"}}/>
        </div>
      </div>
    </section>
  )
}
