"use client";

import { useState } from "react";
import { Polaroid } from "@/components/home/Families";
import { Paw } from "@/components/icons";
import { Lightbox } from "@/components/ui/Lightbox";
import { familyPhotos } from "@/lib/data/families";

const slides = familyPhotos.map((p) => ({ src: p.src, alt: "A happy TeddyPups family with their new puppy", caption: p.caption }));

/** Masonry wall of all 64 family polaroids; each bounces in and gets a paw "pat" as it appears. */
export function FamilyWall() {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <ul className="tp-wall" aria-label="Photos from TeddyPups families">
        {familyPhotos.map((p, i) => (
          <li key={p.src} className="tp-wall__item" data-reveal="custom" style={{ "--d": `${(i % 4) * 90}ms` } as React.CSSProperties}>
            <button type="button" className="tp-wall__print" aria-label={`Open photo ${i + 1} of ${familyPhotos.length}${p.caption ? `: ${p.caption}` : ""}`} onClick={() => setIndex(i)}>
              <Polaroid photo={p} i={i} />
              <Paw className="tp-wall__paw" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox slides={slides} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
