"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Paw } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";
import { cover, DOOR_COLORS, doorMeta, focal, puppies } from "@/lib/data/puppies";

/**
 * "Meet the pups" — a hallway of doors, one per puppy.
 * Desktop: the section pins and vertical scroll drives the hallway sideways while Teddy
 * walks along the floor; each door swings open as he reaches it.
 * Phones / reduced motion: a plain grid where doors open as they scroll into view.
 */
export function MeetThePups() {
  const rangeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const hallRef = useRef<HTMLDivElement>(null);
  const teddyRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<"left" | "right">("right");

  // decide layout
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (min-height: 520px) and (prefers-reduced-motion: no-preference)");
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // pinned: scroll → horizontal track
  useEffect(() => {
    if (!pinned) return;
    const range = rangeRef.current!;
    const track = trackRef.current!;
    const hall = hallRef.current!;
    let distance = 0;
    let lastY = window.scrollY;
    let stopT: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      range.style.height = `calc(${distance}px + 100vh)`;
    };

    const update = () => {
      frame = 0;
      const top = range.getBoundingClientRect().top;
      const p = distance ? Math.min(1, Math.max(0, -top / distance)) : 0;
      const x = -p * distance;
      track.style.transform = `translate3d(${x}px,0,0)`;
      hall.style.setProperty("--floor-x", `${x}px`);

      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) > 0.5 && p > 0 && p < 1) {
        setWalking(true);
        setFacing(dy < 0 ? "left" : "right");
        clearTimeout(stopT);
        stopT = setTimeout(() => setWalking(false), 220);
      }

      // doors Teddy has reached swing open (and stay open)
      const t = teddyRef.current?.getBoundingClientRect();
      if (!t) return;
      const reach = t.left + t.width * 0.75;
      const doors = track.querySelectorAll<HTMLElement>("[data-door]");
      setOpen((prev) => {
        let changed = false;
        const next = new Set(prev);
        doors.forEach((d, i) => {
          if (!next.has(i) && d.getBoundingClientRect().left < reach) {
            next.add(i);
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      measure();
      update();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      clearTimeout(stopT);
      range.style.height = "";
      track.style.transform = "";
    };
  }, [pinned]);

  // grid: doors open as they come into view
  useEffect(() => {
    if (pinned) return;
    const doors = trackRef.current!.querySelectorAll<HTMLElement>("[data-door]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.door);
            setOpen((prev) => new Set(prev).add(i));
          }
        }),
      { threshold: 0.6 },
    );
    doors.forEach((d) => io.observe(d));
    return () => io.disconnect();
  }, [pinned]);

  return (
    <section
      className="tp-scene tp-meet"
      data-tone="light"
      data-pinned={pinned ? "true" : undefined}
      style={{ "--sky-top": "#fff1d8", "--sky-bottom": "#fbe3b4" } as React.CSSProperties}
      aria-labelledby="meet-title"
    >
      <div ref={rangeRef}>
        <div className="tp-meet__stage">
          <header className="tp-meet__head gutter">
            <div>
              <h2 id="meet-title" className="font-plush text-huge">
                Meet the pups
              </h2>
              <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">Real puppies, real photos, looking for their families right now.</p>
            </div>
            <Link className="btn btn-primary shrink-0" href="/puppies">
              See all available puppies
            </Link>
          </header>
          <div ref={hallRef} className="tp-meet__hall">
            <ol ref={trackRef} className="tp-meet__track" aria-label="Puppies looking for a family">
              {puppies.map((p, i) => {
                const c = cover(p);
                return (
                  <li key={p.slug} className="tp-door" data-door={i} data-open={open.has(i)}>
                    <Link className="tp-door__link" href={`/puppies/${p.slug}`} style={{ "--door": DOOR_COLORS[i % DOOR_COLORS.length] } as React.CSSProperties}>
                      <span className="tp-door__plate">
                        <span className="font-plush tp-door__name">{p.displayName}</span>
                        <span className="tp-door__meta">{doorMeta(p)}</span>
                      </span>
                      <span className="tp-door__frame">
                        <span className="tp-door__room">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.u} alt={c.alt} loading="lazy" style={{ objectPosition: focal(c), backgroundColor: c.c }} />
                        </span>
                        <span aria-hidden="true" className="tp-door__way">
                          <span className="tp-door__leaf">
                            <Paw className="tp-door__peephole" />
                            <span className="tp-door__knob" />
                          </span>
                        </span>
                        <span className="tp-door__tag font-scrawl">Available</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li className="tp-door tp-door--all">
                <Link className="tp-door__link" href="/puppies">
                  <span className="tp-door__frame tp-door__frame--all">
                    <span className="font-plush tp-door__all">Meet them all</span>
                  </span>
                </Link>
              </li>
            </ol>
            <div aria-hidden="true" className="tp-meet__floor" />
            <div ref={teddyRef} className="tp-meet__teddy">
              <Teddy pose={walking ? "walk" : "stand"} facing={facing} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
