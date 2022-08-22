import { useEffect, useState } from "react";

export const useMediaQuery = (mediaQuery: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(mediaQuery);
    const setValue = () => setMatches(mq.matches);

    // Set the initial value
    setValue();

    // Add a listener to update the value if it changes
    mq.addEventListener("change", setValue);
    return () => {
      mq.removeEventListener("change", setValue);
    };
  }, [mediaQuery]);

  return matches;
};

const prefersMotionQuery = "(prefers-reduced-motion: no-preference)";
export const prefersMotionSelector = `@media ${prefersMotionQuery}`;
export const usePrefersMotion = () => useMediaQuery(prefersMotionQuery);
