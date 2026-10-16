import styles from "./hero.module.css";

/** Decorative: a thin line that draws down every 2 s. Static under reduced motion. */
export function ScrollCue() {
  return (
    <div aria-hidden="true" className="absolute right-6 bottom-8 hidden md:block">
      <div className={`${styles.cueLine} h-12 w-px bg-fg-2`} />
    </div>
  );
}
