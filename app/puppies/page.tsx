import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PuppyBrowser } from "@/components/puppies/PuppyBrowser";
import { SketchCard } from "@/components/puppies/SketchCard";
import { Teddy } from "@/components/teddy/Teddy";
import { gonePups } from "@/lib/data/gone";
import { tiltFor, washFor } from "@/lib/data/puppies";

export const metadata: Metadata = {
  title: "Available puppies",
  description: "Teacup and toy puppies available now in Dubai — real photos of every puppy.",
};

export default function PuppiesPage() {
  return (
    <div data-page="pups">
      <section aria-labelledby="pups-title" className="tp-sketchbook">
        <div className="gutter mx-auto max-w-[110rem] pt-10 pb-24 md:pt-16">
          <div className="tp-sketchbook__head">
            <div className="tp-sketchbook__words">
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal>
                from Teddy&apos;s sketchbook
              </p>
              <h1 id="pups-title" className="font-plush text-giant tp-sketchbook__title" data-reveal>
                Available puppies
                <svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none" className="tp-sketchbook__underline">
                  <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength={1} />
                </svg>
              </h1>
              <p className="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft" data-reveal>
                Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.
              </p>
            </div>
            <div className="tp-sketchbook__self" data-reveal>
              <Teddy pose="sit" facing="left" label="Teddy, the TeddyPups puppy" />
              <span className="font-scrawl tp-sketchbook__caption">self-portrait</span>
            </div>
          </div>
          <div className="mt-12">
            <Suspense fallback={null}>
              <PuppyBrowser />
            </Suspense>
          </div>
        </div>
      </section>

      <section aria-labelledby="gone-title" className="tp-gone-strip">
        <div className="gutter mx-auto flex max-w-[110rem] flex-col gap-10 md:flex-row md:items-center">
          <div className="md:w-1/3" data-reveal>
            <h2 id="gone-title" className="font-plush text-big">
              Already gone home
            </h2>
            <p className="mt-3 text-cocoa-soft">These puppies have found their families.</p>
            <Link className="btn btn-primary mt-6" href="/gone-home">
              See the puppies who&apos;ve gone home
            </Link>
          </div>
          <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
            {gonePups.slice(0, 6).map((g, i) => (
              <li key={g.slug}>
                <SketchCard
                  slug={g.slug}
                  name={g.name}
                  image={g.image}
                  focal={g.focal}
                  wash={washFor(g.slug)}
                  tilt={tiltFor(g.slug, 1)}
                  delay={i * 70}
                  sticker="gone home ♥"
                  home
                  small
                  label={`${g.name}, ${g.meta}, gone home`}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
