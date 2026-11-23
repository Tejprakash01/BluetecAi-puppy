"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Teddy } from "@/components/teddy/Teddy";
import { breedFilters, cover, focal, hasVideo, puppies, sketchMeta, tiltFor, washFor } from "@/lib/data/puppies";
import { SketchCard } from "./SketchCard";

type Where = "all" | "imported" | "local" | "korean-teacup";

/**
 * Filterable puppy grid. Filter state lives in the URL (?origin=, ?collection=, ?breed=, ?sex=)
 * so links like "/puppies?breed=poodle" from the home page land pre-filtered and the view is shareable.
 */
export function PuppyBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const where: Where = params.get("collection") === "korean-teacup" ? "korean-teacup" : ((params.get("origin") as Where) ?? "all");
  const breed = params.get("breed");
  const sex = params.get("sex");

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k);
      else next.set(k, v);
    }
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const setWhere = (w: Where) =>
    set({
      origin: w === "imported" || w === "local" ? w : null,
      collection: w === "korean-teacup" ? w : null,
    });

  const list = useMemo(
    () =>
      puppies.filter((p) => {
        if (where === "imported" && p.origin !== "imported") return false;
        if (where === "local" && p.origin !== "local") return false;
        if (where === "korean-teacup" && !p.collections.includes("korean-teacup")) return false;
        if (breed && !p.breeds.includes(breed)) return false;
        if (sex === "boy" && !p.gender.includes("male")) return false;
        if (sex === "girl" && p.gender === "male") return false;
        return true;
      }),
    [where, breed, sex],
  );

  const chip = (pressed: boolean, label: string, onClick: () => void) => (
    <button key={label} type="button" aria-pressed={pressed} className="tp-sticker-chip" onClick={onClick}>
      {label}
    </button>
  );

  return (
    <div>
      <div role="group" aria-label="Filter puppies" className="tp-sketchpad flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">where</span>
          {chip(where === "all", "Everywhere", () => setWhere("all"))}
          {chip(where === "imported", "Imported", () => setWhere(where === "imported" ? "all" : "imported"))}
          {chip(where === "korean-teacup", "Korean Teacup", () => setWhere(where === "korean-teacup" ? "all" : "korean-teacup"))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">breed</span>
          {breedFilters.map((b) => chip(breed === b.slug, b.label, () => set({ breed: breed === b.slug ? null : b.slug })))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">boy or girl</span>
          {chip(sex === "boy", "Boys", () => set({ sex: sex === "boy" ? null : "boy" }))}
          {chip(sex === "girl", "Girls", () => set({ sex: sex === "girl" ? null : "girl" }))}
        </div>
      </div>

      <p className="font-scrawl mt-10 text-lg text-[var(--ink-soft)]" aria-live="polite">
        {list.length === 1 ? "1 puppy looking for a home" : `${list.length} puppies looking for a home`}
      </p>

      {list.length ? (
        <ul className="tp-sketches mt-8" key={`${where}-${breed}-${sex}`}>
          {list.map((p, i) => {
            const c = cover(p);
            return (
              <li key={p.slug} style={{ "--n": i } as React.CSSProperties}>
                <SketchCard
                  slug={p.slug}
                  name={p.displayName}
                  meta={sketchMeta(p)}
                  image={c.u}
                  focal={focal(c)}
                  bg={c.c}
                  wash={washFor(p.slug)}
                  tilt={tiltFor(p.slug)}
                  delay={Math.min(i, 6) * 70}
                  video={hasVideo(p)}
                  label={`${p.displayName}, ${sketchMeta(p).replace(/ · /g, ", ")}, available`}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="tp-board mx-auto mt-10 grid max-w-xl justify-items-center gap-3 text-center">
          <div className="w-36">
            <Teddy pose="sit" />
          </div>
          <p className="font-plush text-[1.8rem]">No puppies match — yet!</p>
          <p className="text-cocoa-soft">New litters arrive all the time. Try another filter, or tell us what you&apos;re dreaming of on WhatsApp.</p>
          <button type="button" className="btn btn-primary mt-2" onClick={() => router.replace(pathname, { scroll: false })}>
            Show all puppies
          </button>
        </div>
      )}
    </div>
  );
}
