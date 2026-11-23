#!/usr/bin/env node
/**
 * Downloads every photo / video referenced by the site's data files from the
 * reference site into /public, mirroring the original paths
 * (e.g. /media/abc/123/photo.jpg -> public/media/abc/123/photo.jpg).
 *
 * - Runs automatically before `npm run build` (the "prebuild" script), so a fresh
 *   deploy on Vercel always has its media served locally.
 * - Already-downloaded files are skipped, so it is cheap to run again.
 * - Never fails the build: anything that can't be fetched is still reachable via
 *   the fallback rewrite in next.config.ts.
 *
 * Usage:  npm run assets            (or: node scripts/fetch-assets.mjs)
 */
import { readFile, readdir, mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = process.env.ASSET_ORIGIN || "https://puppy.instabizweb.com";
const SCAN_DIRS = ["lib", "app", "components"];
const CONCURRENCY = 6;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(tsx?|json)$/.test(entry.name)) out.push(p);
  }
  return out;
}

async function collect() {
  const urls = new Set(["/brand/logo.png"]);
  for (const d of SCAN_DIRS) {
    for (const file of await walk(path.join(ROOT, d))) {
      const text = await readFile(file, "utf8");
      for (const m of text.matchAll(/["'`](\/media\/[^"'`\s)]+)["'`]/g)) urls.add(m[1]);
    }
  }
  return [...urls];
}

const exists = (p) => stat(p).then((s) => s.size > 0, () => false);

async function download(url) {
  const dest = path.join(ROOT, "public", ...url.split("/").filter(Boolean));
  if (await exists(dest)) return "skip";
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60_000);
  try {
    const res = await fetch(ORIGIN + url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    return "ok";
  } finally {
    clearTimeout(timer);
  }
}

const urls = await collect();
console.log(`[assets] ${urls.length} media files referenced — fetching missing ones from ${ORIGIN}`);
let ok = 0, skip = 0, fail = 0;
const queue = [...urls];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const url = queue.shift();
      try {
        (await download(url)) === "ok" ? ok++ : skip++;
      } catch (e) {
        fail++;
        console.warn(`[assets] could not fetch ${url}: ${e.message}`);
      }
    }
  }),
);
console.log(`[assets] done — ${ok} downloaded, ${skip} already present, ${fail} failed`);
if (fail) console.warn("[assets] missing files will be proxied from the reference site at runtime (see next.config.ts)");
