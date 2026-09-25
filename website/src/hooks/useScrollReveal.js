import { useEffect, useRef } from "react";

export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Element already visible on load — reveal immediately with small delay
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;

    if (isVisible && options.immediate !== false) {
      // Small delay to make the animation visible
      setTimeout(() => {
        element.classList.add("revealed");
      }, options.delay || 100);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a small delay so the animation is actually visible
          setTimeout(() => {
            entry.target.classList.add("revealed");
          }, options.delay || 0);
          if (options.once !== false) observer.unobserve(entry.target);
        } else if (options.once === false) {
          entry.target.classList.remove("revealed");
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "0px 0px -80px 0px",
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [
    options.threshold,
    options.rootMargin,
    options.once,
    options.delay,
    options.immediate,
  ]);

  return ref;
};

export default useScrollReveal;
