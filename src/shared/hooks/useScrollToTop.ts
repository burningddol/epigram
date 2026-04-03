import { useState, useEffect, useCallback } from "react";

const SCROLL_THRESHOLD = 300;

interface UseScrollToTopReturn {
  isVisible: boolean;
  scrollToTop: () => void;
}

export function useScrollToTop(): UseScrollToTopReturn {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll(): void {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback((): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { isVisible, scrollToTop };
}
