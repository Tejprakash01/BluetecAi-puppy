"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole site.
 * Any element rendered with `data-reveal` gets `data-armed` (hidden state) once JS runs,
 * then `data-revealed` the first time it scrolls into view. All the actual animation lives
 * in CSS, so server components can opt in with a single attribute and no extra JS.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).setAttribute("data-revealed", "true");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const arm = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-armed])").forEach((el) => {
        el.setAttribute("data-armed", "true");
        io.observe(el);
      });
    };
    arm();
    // pick up elements rendered later (filters, client components, etc.)
    const mo = new MutationObserver(arm);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
