"use client";

import { useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import { focal, type Media } from "@/lib/data/puppies";

/** Storybook gallery: big "page" with prev/next, a strip of thumbnails, and a full-screen viewer. */
export function Gallery({ media, name }: { media: Media[]; name: string }) {
  const [i, setI] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const m = media[i];
  const n = media.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const kind = (x: Media) => (x.k === "video" ? "video" : "photo");

  return (
    <div>
      <div className="tp-storypage relative aspect-[4/5] md:aspect-[5/6]">
        {m.k === "video" ? (
          <video
            key={m.u}
            className="tp-storypage__media"
            src={m.u}
            poster={m.p}
            controls
            playsInline
            loop
            aria-label={m.alt}
            style={{ objectPosition: m.pfx !== undefined ? focal({ fx: m.pfx, fy: m.pfy ?? 0.5 }) : undefined, backgroundColor: "#2a170e" }}
          />
        ) : (
          <button type="button" className="absolute inset-0 block size-full" aria-label={`Open ${name}, photo ${i + 1} of ${n} full screen`} onClick={() => setViewer(i)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={m.u} className="tp-storypage__media" src={m.u} alt={m.alt} style={{ objectPosition: focal(m), backgroundColor: m.c }} />
          </button>
        )}
        {n > 1 && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-between">
            <button type="button" className="pointer-events-auto grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold" aria-label="Previous photo" onClick={() => go(-1)}>
              ‹
            </button>
            <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
              {i + 1} / {n}
            </span>
            <button type="button" className="pointer-events-auto grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold" aria-label="Next photo" onClick={() => go(1)}>
              ›
            </button>
          </div>
        )}
      </div>
      {n > 1 && (
        <ul className="mt-3 flex gap-3 overflow-x-auto px-1 pt-2 pb-2 [scrollbar-width:thin]" aria-label={`All photos of ${name}`}>
          {media.map((x, j) => (
            <li key={x.u} className="shrink-0">
              <button
                type="button"
                aria-label={`${name}, ${kind(x)} ${j + 1} of ${n}`}
                aria-current={j === i}
                onClick={() => setI(j)}
                className={`relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24 ${
                  j === i ? "-translate-y-1 -rotate-3 border-toffee-deep" : "border-cocoa/30 hover:-rotate-2 hover:border-cocoa"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={x.k === "video" ? x.p : x.u}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover"
                  style={{ objectPosition: x.k === "video" ? focal({ fx: x.pfx ?? 0.5, fy: x.pfy ?? 0.5 }) : focal(x), backgroundColor: x.c }}
                />
                {x.k === "video" && <span className="absolute inset-0 grid place-items-center bg-cocoa/30 text-lg text-milk">▶</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      <Lightbox
        label={`${name} photos`}
        slides={media.map((x) => ({ src: x.u, alt: x.alt, kind: x.k, poster: x.p }))}
        index={viewer}
        onIndex={(j) => {
          setViewer(j);
          setI(j);
        }}
        onClose={() => setViewer(null)}
      />
    </div>
  );
}
