import {useEffect, useRef, useState} from "react"

export default function useOnScreen(allowMultiple?: boolean, options?: IntersectionObserverInit) {
  const ref = useRef(null);

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

  return {ref, isIntersecting};
}
