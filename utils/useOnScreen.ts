import {RefObject, useEffect, useState} from "react"

export default function useOnScreen(ref: RefObject<HTMLElement>, allowMultiple?: boolean, options?: IntersectionObserverInit) {

  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (allowMultiple) {
          setIntersecting(entry.isIntersecting);
        } else {
          if (entry.isIntersecting) {
            setIntersecting(true);
          }
        }
      }, options);

    const elem = ref.current;

    if (elem) {
      observer.observe(elem);
    }

    // Clean up the observer
    return () => {
      if (elem) {
        observer.unobserve(elem);
      }
    };
  }, [allowMultiple, options, ref]);

  return isIntersecting;
}
