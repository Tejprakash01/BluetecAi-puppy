"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Teddy } from "@/components/teddy/Teddy";
import { site } from "@/lib/data/site";

type State = "intro" | "idle" | "covering" | "covered" | "lifting";

function Scallop({ id }: { id: string }) {
  return (
    <svg width="100%" height="40" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id={id} width="76" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill="var(--color-honey-soft)" />
          <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
          <path d="M11 33A27 19 0 0 1 65 33" fill="none" stroke="#2a170e" strokeWidth="1.6" strokeDasharray="3.5 5.5" strokeLinecap="round" opacity=".42" />
        </pattern>
      </defs>
      <rect width="100%" height="40" fill={`url(#${id})`} />
    </svg>
  );
}

export const scrollToTop = () => {
  const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
};

/**
 * Page transitions: a quilted "blanket" slides up over the page while Teddy runs across it,
 * the route changes underneath, then the blanket lifts away. Also plays once on first load.
 */
export function RouteCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<State>("intro");
  const stateRef = useRef<State>("intro");
  const set = (s: State) => {
    stateRef.current = s;
    setState(s);
  };

  // first-load intro
  useEffect(() => {
    const t = setTimeout(() => set("idle"), 1050);
    return () => clearTimeout(t);
  }, []);

  // intercept internal link clicks so the blanket can cover the page first
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onClick = (e: MouseEvent) => {
      if (reduce.matches || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (stateRef.current !== "idle") return;
      e.preventDefault();
      set("covering");
      setTimeout(() => {
        set("covered");
        router.push(url.pathname + url.search + url.hash);
      }, 320);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // new route rendered → lift the blanket
  useEffect(() => {
    if (stateRef.current !== "covered") return;
    if (!location.hash) scrollToTop();
    const t1 = setTimeout(() => set("lifting"), 120);
    const t2 = setTimeout(() => set("idle"), 640);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  // safety net: never leave the page covered
  useEffect(() => {
    if (state !== "covered") return;
    const t = setTimeout(() => stateRef.current === "covered" && set("lifting"), 2500);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <div className="tp-curtain" data-state={state} aria-hidden="true">
      <div className="tp-curtain__blanket">
        <span className="tp-curtain__edge tp-curtain__edge--top" style={{ width: "100%" }}>
          <Scallop id="tp-curtain-top" />
        </span>
        <span className="tp-curtain__edge tp-curtain__edge--bottom" style={{ width: "100%" }}>
          <Scallop id="tp-curtain-bottom" />
        </span>
        {state !== "idle" && (
          <div className="tp-curtain__stage">
            <div className="tp-curtain__runner">
              <Teddy pose="walk" interactive={false} />
            </div>
            <span className="tp-curtain__note font-scrawl">{site.tagline}</span>
          </div>
        )}
      </div>
    </div>
  );
}
