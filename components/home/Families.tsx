"use client";

import Link from "next/link";
import { useState } from "react";
import { Teddy } from "@/components/teddy/Teddy";
import { Lightbox } from "@/components/ui/Lightbox";
import { familyPhotos, featuredFamilyPhotos, testimonial, type FamilyPhoto } from "@/lib/data/families";

export function Polaroid({ photo, i }: { photo: FamilyPhoto; i: number }) {
  const tapes = photo.tapePos === "corners" ? ["tl", "tr"] : [photo.tapePos];
  return (
    <span className="tp-polaroid" style={{ "--tilt": `${photo.tilt}deg`, "--tape": photo.tape, "--i": i } as React.CSSProperties}>
      {tapes.map((t) => (
        <span key={t} aria-hidden="true" className={`tp-tape tp-tape--${t}`} />
      ))}
      <span className="tp-polaroid__photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt="A happy TeddyPups family with their new puppy" width={photo.width} height={photo.height} loading="lazy" />
      </span>
      <span className="tp-polaroid__caption font-scrawl">{photo.caption}</span>
    </span>
  );
}

const slides = familyPhotos.map((p) => ({ src: p.src, alt: "A happy TeddyPups family with their new puppy", caption: p.caption }));
const DELAYS = [330, 0, 550, 110, 660, 220, 770, 440];

/** "Happy families & puppies" at dusk — polaroids pinned to the front of a house. */
export function Families() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section
      className="tp-scene tp-dusk"
      data-tone="dark"
      style={{ "--sky-top": "#a65a30", "--sky-bottom": "#4d2b19" } as React.CSSProperties}
      aria-labelledby="dusk-title"
    >
      <div className="tp-dusk__sky gutter">
        <div>
          <h2 id="dusk-title" className="font-plush text-huge">
            Happy families &amp; puppies
          </h2>
          <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">
            We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.
          </p>
        </div>
        <figure className="tp-dusk__note">
          <blockquote className="font-plush-text">“{testimonial.quote}”</blockquote>
          <figcaption className="font-scrawl">
            {testimonial.author}, {testimonial.place}
          </figcaption>
        </figure>
      </div>
      <div className="tp-photowall">
        <div className="tp-photowall__wall">
          <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
            {featuredFamilyPhotos.map((p, i) => (
              <li key={p.src} data-reveal="custom" style={{ "--d": `${DELAYS[i]}ms` } as React.CSSProperties}>
                <button
                  type="button"
                  className="tp-photowall__print"
                  aria-label={`Open photo ${familyPhotos.indexOf(p) + 1} of ${familyPhotos.length}: ${p.caption}`}
                  onClick={() => setIndex(familyPhotos.indexOf(p))}
                >
                  <Polaroid photo={p} i={i} />
                </button>
              </li>
            ))}
          </ul>
          <div className="tp-facade__ground">
            <span aria-hidden="true" className="tp-facade__door" />
            <span aria-hidden="true" className="tp-lamp">
              <span className="tp-lamp__light" />
            </span>
            <Link className="btn btn-primary tp-facade__cta" href="/happy-families">
              See every happy family
            </Link>
            <div className="tp-dusk__teddy tp-hide-sm">
              <Teddy pose="sit" />
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="tp-street__pavement" />
      </div>
      <Lightbox slides={slides} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </section>
  );
}
