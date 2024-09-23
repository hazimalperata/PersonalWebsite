import styles from "./index.module.scss";
import clsx from "clsx";
import Technology from "@/components/Technologies/TechnologySection";

export default function Technologies() {
  const technologies = [
    "1",
    "2",
    "3",
    "4",
    "5",
  ]

  return (
    <section className="py-20">
      <div className="flex flex-col items-center max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 space-y-10">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">Technologies</h1>
        </div>
        <div className={clsx("flex justify-center flex-wrap w-fit", styles.technologies)}>
          {[...new Array(5)].map((_, index) => (
            <Technology key={technologies[index]}/>
          ))}
        </div>
      </div>
    </section>
  )
}
