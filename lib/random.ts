/** Small deterministic helpers so server and client render the same "random" shapes. */

export function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A hand-drawn looking blob inside a 100×100 box: a circle whose radius wobbles
 * with a couple of low-frequency sine waves, smoothed with quadratic curves.
 */
export function blobPath(seedStr: string, wobble = 4, r0 = 45) {
  const rnd = seeded(hash(seedStr));
  const a1 = rnd() * Math.PI * 2;
  const a2 = rnd() * Math.PI * 2;
  const k1 = 2 + Math.floor(rnd() * 2);
  const k2 = 3 + Math.floor(rnd() * 2);
  const n = 48;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const r = r0 + Math.sin(t * k1 + a1) * wobble * 0.6 + Math.sin(t * k2 + a2) * wobble * 0.4;
    pts.push([50 + Math.cos(t) * r, 50 + Math.sin(t) * r]);
  }
  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const f = (v: number) => v.toFixed(2);
  const start = mid(pts[n - 1], pts[0]);
  let d = `M${f(start[0])} ${f(start[1])}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const m = mid(p, pts[(i + 1) % n]);
    d += `Q${f(p[0])} ${f(p[1])} ${f(m[0])} ${f(m[1])}`;
  }
  return d + "Z";
}

export const svgMask = (d: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`,
  )}")`;
