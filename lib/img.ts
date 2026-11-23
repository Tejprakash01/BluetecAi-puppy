/**
 * Responsive image URLs through Next.js' built-in optimizer (/_next/image).
 * The original photos are up to 4000px wide and 600KB+; this serves a resized
 * AVIF/WebP that fits the slot, so pages load several times lighter.
 */
const WIDTHS = [128, 256, 384, 640, 828, 1080, 1920];

export const opt = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

/** Props to spread on an <img>: src (fallback) + srcSet + sizes. */
export function responsive(src: string, sizes: string, max = 1920) {
  const ws = WIDTHS.filter((w) => w <= max);
  return {
    src: opt(src, ws[ws.length - 1]),
    srcSet: ws.map((w) => `${opt(src, w)} ${w}w`).join(", "),
    sizes,
  };
}
