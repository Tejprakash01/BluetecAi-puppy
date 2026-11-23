import Link from "next/link";
import { PAW_PATH } from "@/components/icons";
import { blobPath, hash, seeded, svgMask } from "@/lib/random";
import { responsive } from "@/lib/img";

/**
 * A puppy drawn into Teddy's sketchbook: a watercolour wash, a wobbly blob-masked photo,
 * a hand-inked outline that "draws itself" (stroke-dashoffset) and a couple of doodles.
 * Every shape is generated from the puppy's slug, so each card is unique but stable.
 */
export function SketchCard({
  slug,
  name,
  meta,
  image,
  focal,
  bg,
  wash,
  tilt,
  delay = 0,
  sticker = "Available",
  video = false,
  small = false,
  home = false,
  label,
}: {
  slug: string;
  name: string;
  meta?: string;
  image: string;
  focal: string;
  bg?: string;
  wash: string;
  tilt: number;
  delay?: number;
  sticker?: string;
  video?: boolean;
  small?: boolean;
  home?: boolean;
  label: string;
}) {
  const rnd = seeded(hash(slug + "doodle"));
  const outline = blobPath(slug + "ink", 3.2, 47.5);
  const retrace = blobPath(slug + "re", 3.5, 49);
  const mask = svgMask(blobPath(slug + "mask", 2.6, 45.5));
  const washD = blobPath(slug + "wash", 3.5, 46);
  const wx = (rnd() * 8 - 4).toFixed(1);
  const wy = (rnd() * 6 + 2).toFixed(1);
  const pawAt = { x: (4 + rnd() * 10).toFixed(1), y: (10 + rnd() * 12).toFixed(1), r: (-20 + rnd() * 20).toFixed(0) };
  const curlAt = { x: (-8 + rnd() * 6).toFixed(1), y: (60 + rnd() * 10).toFixed(1) };

  return (
    <Link
      className={`tp-sketch${small ? " tp-sketch--small" : ""}`}
      data-reveal="custom"
      aria-label={label}
      href={`/puppies/${slug}`}
      style={{ "--tilt": `${tilt.toFixed(2)}deg`, "--d": `${delay}ms`, "--wash": wash } as React.CSSProperties}
    >
      <span className="tp-sketch__frame">
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__wash" style={{ translate: `${wx}% ${wy}%` }}>
          <path d={washD} />
        </svg>
        <span className="tp-sketch__photo" style={{ maskImage: mask, WebkitMaskImage: mask }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img {...responsive(image, small ? "9rem" : "(min-width: 1024px) 18rem, 46vw", small ? 384 : 640)} alt="" loading="lazy" style={{ objectPosition: focal, backgroundColor: bg }} />
        </span>
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__ink">
          <path d={outline} pathLength={1} className="tp-sketch__line" />
          <path d={retrace} pathLength={1} strokeDasharray="0.42 1" className="tp-sketch__line tp-sketch__line--retrace" />
          <g transform={`translate(${curlAt.x} ${curlAt.y}) rotate(-9) scale(0.85)`}>
            <g className="tp-sketch__doodle">
              <path d="M0 0c1.6-.6 2.4 1.4.8 2.6-2 1.4-4.6-.4-4-3 .7-3 4.8-3.8 6.8-1.2 2.4 3-0.2 7.4-3.8 7.2" fill="none" stroke="#c2622b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
          <g transform={`translate(${pawAt.x} ${pawAt.y}) rotate(${pawAt.r}) scale(0.95)`}>
            <g className="tp-sketch__doodle">
              <path d={PAW_PATH} transform="scale(.17) translate(-32 -34)" fill="#d4893f" opacity="0.85" />
            </g>
          </g>
        </svg>
        <span className={`tp-sketch__sticker${home ? " tp-sketch__sticker--home" : ""} font-scrawl`}>{sticker}</span>
        {video && <span className="tp-sketch__video">▶ video</span>}
      </span>
      <span className="tp-sketch__name font-plush">{name}</span>
      {meta && <span className="tp-sketch__meta">{meta}</span>}
    </Link>
  );
}
