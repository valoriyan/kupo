import { useEffect, useState } from "react";
import { throttle } from "./throttle";

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = throttle(() => {
      const scrollY = window.scrollY;
      setScrollPosition(scrollY);
    });

    window.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
};
