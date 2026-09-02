import { useEffect, useRef, useState } from "react";

/**
 * Fade-up-on-scroll, matching idi-ridi.lv's pattern: opacity-0 translate-y-10
 * -> opacity-100 translate-y-0 over a 700ms transition, triggered once by an
 * IntersectionObserver (never re-hides on scroll back up). No parallax,
 * rotation, or scale — keep it to this one effect for consistency.
 *
 * Pass `enabled: false` to fully skip the observer and animation (e.g. the
 * /menu page's full item grid, where reveal effects on 60+ items would just
 * feel sluggish) — the returned className/style are then both inert, so the
 * element renders exactly as if this hook weren't used at all.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  delay = 0,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(!enabled);
  const [animate, setAnimate] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimate(false);
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  const className = animate
    ? `transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`
    : "";
  const style = animate && delay ? { transitionDelay: `${delay}ms` } : undefined;

  return { ref, className, style };
}
