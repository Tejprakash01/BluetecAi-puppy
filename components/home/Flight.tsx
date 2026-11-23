"use client";

import { useEffect, useId, useRef } from "react";
import { cover, puppies } from "@/lib/data/puppies";

/**
 * A little plane (with a puppy in the porthole) flying Korea → Dubai.
 * Its position along the dotted route is tied to how far the scene has scrolled through the viewport.
 */
export function Flight() {
  const clip = useId().replace(/:/g, "");
  const routeRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const pup = cover(puppies[1]);

  useEffect(() => {
    const route = routeRef.current!;
    const plane = planeRef.current!;
    const box = boxRef.current!;
    const len = route.getTotalLength();
    let frame = 0;
    const place = (t: number) => {
      const p = route.getPointAtLength(t * len);
      const q = route.getPointAtLength(Math.min(len, t * len + 1));
      const angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      plane.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
    };
    const update = () => {
      frame = 0;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the scene enters from the bottom, 1 when it reaches the upper third
      const t = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75 + r.height * 0.4)));
      place(0.04 + t * 0.96);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) place(1);
    else {
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="tp-flight" ref={boxRef}>
      <svg viewBox="0 0 660 300" role="img" aria-label="A plane bringing a Korean Teacup Maltipoo puppy from Korea to Dubai">
        <defs>
          <clipPath id={clip}>
            <circle r="25" />
          </clipPath>
        </defs>
        <path ref={routeRef} d="M40 250 C 170 40, 470 20, 620 168" className="tp-flight__route" />
        <circle cx="40" cy="250" r="7" className="tp-flight__dot" />
        <circle cx="620" cy="168" r="7" className="tp-flight__dot" />
        <text x="40" y="284" textAnchor="middle" className="tp-flight__label">
          Korea
        </text>
        <text x="620" y="202" textAnchor="middle" className="tp-flight__label">
          Dubai
        </text>
        <g ref={planeRef} transform="translate(620 168) rotate(44.5)">
          <g transform="translate(-126 -78)">
            <path d="M28 60 L8 26 L34 26 L60 54 Z" className="tp-flight__wing" />
            <path d="M108 112 L142 156 L172 156 L158 112 Z" className="tp-flight__wing tp-flight__wing--far" />
            <path d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z" className="tp-flight__body" />
            <path d="M104 44 L138 2 L168 2 L154 44 Z" className="tp-flight__wing" />
            <path d="M206 64 C215 67 221 73 224 80" className="tp-flight__line" />
          </g>
          <g transform="translate(10 2)">
            <image href={pup.u} x="-25" y="-25" width="50" height="50" clipPath={`url(#${clip})`} preserveAspectRatio="xMidYMid slice" />
            <circle r="25" className="tp-flight__porthole" />
          </g>
        </g>
      </svg>
    </div>
  );
}
