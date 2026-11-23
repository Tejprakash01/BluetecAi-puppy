"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Teddy } from "@/components/teddy/Teddy";
import { cover, puppies } from "@/lib/data/puppies";
import { site } from "@/lib/data/site";

/** Final call to action: the front door swings open to reveal a puppy waiting inside. */
export function WelcomeHome() {
  const ref = useRef<HTMLElement>(null);
  const [visited, setVisited] = useState(false);
  const max = cover(puppies[0]);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisited(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(ref.current!.querySelector(".tp-house")!);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="tp-scene tp-home"
      data-tone="dark"
      data-visited={visited}
      style={{ "--sky-top": "#2f1a10", "--sky-bottom": "#24130b" } as React.CSSProperties}
      aria-labelledby="cta-title"
    >
      <div className="tp-home__copy gutter">
        <h2 id="cta-title" className="font-plush text-huge">
          Ready to meet your new best friend?
        </h2>
        <p className="tp-home__lede">
          Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.
        </p>
      </div>
      <div className="tp-house">
        <span aria-hidden="true" className="tp-house__plant tp-house__plant--left" />
        <span aria-hidden="true" className="tp-house__lamp" />
        <div className="tp-house__doorway">
          <span className="tp-house__inside">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={max.u} alt={`${puppies[0].displayName}, waiting inside`} loading="lazy" />
          </span>
          <span aria-hidden="true" className="tp-house__door">
            <span className="tp-house__peep" />
            <span className="tp-house__knob" />
          </span>
        </div>
        <span aria-hidden="true" className="tp-house__plant tp-house__plant--right" />
        <span aria-hidden="true" className="tp-house__mat font-scrawl">
          welcome home
        </span>
        <div className="tp-house__teddy">
          <Teddy pose={visited ? "bow" : "sit"} bubble={visited ? null : undefined} />
        </div>
      </div>
      <div className="tp-home__actions gutter">
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          Enquire on WhatsApp
        </a>
        <Link className="btn btn-ghost" href="/contact">
          Visit &amp; contact
        </Link>
      </div>
    </section>
  );
}
