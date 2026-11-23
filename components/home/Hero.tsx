"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Teddy } from "@/components/teddy/Teddy";
import { cover, focal, puppies, type Puppy } from "@/lib/data/puppies";
import { site } from "@/lib/data/site";
import { responsive } from "@/lib/img";

const SEATS = [
  { x: "9%", w: "8.6rem", peek: 0.62, tilt: "-5deg" },
  { x: "22.5%", w: "10.4rem", peek: 0.8, tilt: "3deg" },
  { x: "35%", w: "9.2rem", peek: 0.7, tilt: "-2deg" },
  { x: "65%", w: "9.4rem", peek: 0.74, tilt: "3deg" },
  { x: "77.5%", w: "10.6rem", peek: 0.82, tilt: "-3deg" },
  { x: "91%", w: "8.4rem", peek: 0.6, tilt: "4deg" },
];

const label = (p: Puppy) => p.displayName;

/**
 * Hero: six real puppies peek over a quilt with Teddy in the middle.
 * Every few seconds one pup ducks down and a different one pops up in its seat
 * (with a name tag), while Teddy shouts "peekaboo!".
 */
export function Hero() {
  const [here, setHere] = useState(false);
  const [seated, setSeated] = useState<Puppy[]>(puppies.slice(0, 6));
  const [state, setState] = useState<Record<number, "duck" | "pop" | undefined>>({});
  const [tag, setTag] = useState<number | null>(null);
  const [bubble, setBubble] = useState<string | null>(null);
  const bench = useRef(6);
  const busy = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setHere(true), 650);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const tick = () => {
      if (busy.current || document.hidden) return;
      busy.current = true;
      const seat = Math.floor(Math.random() * SEATS.length);
      setState((s) => ({ ...s, [seat]: "duck" }));
      timers.push(
        setTimeout(() => {
          setSeated((cur) => {
            const next = [...cur];
            // pick the next puppy from the bench that isn't already seated
            for (let k = 0; k < puppies.length; k++) {
              const cand = puppies[bench.current % puppies.length];
              bench.current++;
              if (!next.some((p) => p.slug === cand.slug)) {
                next[seat] = cand;
                break;
              }
            }
            return next;
          });
          setState((s) => ({ ...s, [seat]: "pop" }));
          setTag(seat);
          setBubble("peekaboo!");
        }, 420),
        setTimeout(() => {
          setTag(null);
          setBubble(null);
          setState((s) => ({ ...s, [seat]: undefined }));
          busy.current = false;
        }, 2300),
      );
    };
    const id = setInterval(tick, 3800);
    return () => {
      clearInterval(id);
      timers.forEach(clearTimeout);
      timers = [];
    };
  }, []);

  return (
    <section
      className="tp-scene tp-hero"
      data-tone="light"
      data-here={here}
      style={{ "--sky-top": "#fffdf8", "--sky-bottom": "#fff1d8", "--quilt": "#fff1d8" } as React.CSSProperties}
      aria-labelledby="hero-title"
    >
      <span aria-hidden="true" className="tp-hero__sun" />
      <div className="tp-hero__copy gutter">
        <p className="tp-hero__note font-scrawl">
          {site.tagline}
          <svg viewBox="0 0 220 24" preserveAspectRatio="none" aria-hidden="true">
            <path d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
        <h1 id="hero-title" className="tp-hero__title font-plush">
          <span className="tp-hero__line">Premium teacup</span>
          <span className="tp-hero__line tp-hero__line--2">puppies in Dubai</span>
        </h1>
        <p className="tp-hero__lede">
          Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.
        </p>
        <div className="tp-hero__actions">
          <Link className="btn btn-primary" href="/puppies">
            View available puppies
          </Link>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            Enquire on WhatsApp
          </a>
        </div>
      </div>

      <div className="tp-hero__stage">
        <ul className="tp-lineup" aria-label="Some of the puppies in our showroom">
          {SEATS.map((s, i) => {
            const p = seated[i];
            const c = cover(p);
            return (
              <li key={i} className="tp-lineup__seat" style={{ "--x": s.x, "--w": s.w, "--peek": s.peek, "--tilt": s.tilt, "--i": i } as React.CSSProperties}>
                <Link className="tp-lineup__pup" data-state={state[i]} aria-label={`Meet ${label(p)}, ${p.breed}`} href={`/puppies/${p.slug}`}>
                  <span className="tp-lineup__photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img {...responsive(c.u, "11rem", 384)} alt={c.alt} style={{ objectPosition: focal(c), backgroundColor: c.c }} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
          {SEATS.map((s, i) => (
            <li key={i} className="tp-lineup__seat" style={{ "--x": s.x, "--w": s.w, "--peek": s.peek, "--tilt": s.tilt, "--i": i } as React.CSSProperties}>
              <span className="tp-lineup__ghost" data-tag={tag === i ? "show" : undefined}>
                <span className="tp-lineup__name font-scrawl">{label(seated[i])}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="tp-hero__teddy">
          <Teddy pose="peek" label="Teddy, the TeddyPups puppy, peeking over the quilt" bubble={bubble} />
        </div>
        <div aria-hidden="true" className="tp-quilt">
          <svg className="tp-quilt__edge" width="100%" height="40" preserveAspectRatio="none">
            <defs>
              <pattern id="tp-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40V27A38 25 0 0 1 76 27V40Z" style={{ fill: "var(--quilt)" }} />
                <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
                <path d="M11 33A27 19 0 0 1 65 33" fill="none" stroke="#2a170e" strokeWidth="1.6" strokeDasharray="3.5 5.5" strokeLinecap="round" opacity=".42" />
              </pattern>
            </defs>
            <rect width="100%" height="40" fill="url(#tp-scallop)" />
          </svg>
        </div>
      </div>
    </section>
  );
}
