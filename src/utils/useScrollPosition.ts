import { useEffect, useState } from "react";
import { throttle } from "./throttle";

export const useScrollPosition = (
  container: HTMLElement | null,
  onScrollChange?: (scrollPosition: number) => void,
) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!container) return;

    const updatePosition = throttle(() => {
      const scrollTop = container.scrollTop;
      if (onScrollChange) onScrollChange(scrollTop);
      else setScrollPosition(scrollTop);
    });

    container.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => container.removeEventListener("scroll", updatePosition);
  }, [container, onScrollChange]);

  return scrollPosition;
};
