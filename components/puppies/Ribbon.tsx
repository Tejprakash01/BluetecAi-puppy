"use client";

import { useEffect, useRef } from "react";

/** A bookmark ribbon down the left edge that grows as you read the puppy's story. */
export function Ribbon() {
  const band = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = band.current!;
    const article = el.closest("article")!;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = article.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0.04, -r.top / total)) : 1;
      el.style.transform = `scaleY(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div aria-hidden="true" className="tp-ribbon">
      <div className="tp-ribbon__track">
        <span ref={band} className="tp-ribbon__band" style={{ transform: "scaleY(0.04)" }} />
      </div>
    </div>
  );
}
